///<reference path="./clients/lib/interfaces/shop.interface.d.ts" />
///<reference path="./clients/lib/interfaces/react.interface.d.ts" />
import Mock from './clients/lib/mocking/shopping';
import DBConnect from './server/db/db_connect';
import CMSModel from './server/model/cmsModel';
import {Repository} from './server/model/repository';
import cnf from './server/config/connect.cnf';
import * as http from 'http';
import {readFile, readdir, writeFile, createWriteStream} from 'fs';
import * as request from 'request';

import * as mongoose from 'mongoose';

interface Incoming extends http.IncomingMessage {
  absoluteUri: string
}

export class DBRunner{

  constructor(){
  }

  build = () => {
    let data = <shoppingProps> new Mock();
    let products = this.productList(data);
    this.collect('products',products);
  }

  /**
   * Builds productList
   * called as part of store.reduce when service was called
   * @param {null}
   * @return {void}
   * @TODO Create Actions.products wthif PRODUCTS type and move this into Reduce/Store
   */
  productList = ( list: shoppingProps):null|shoppingProps => {

    let prodArray = list.groups ? list.groups : null;
    if(prodArray){
      let products:any = {};
      prodArray.map( (prod:any, i:any)=>{
        let key = this.productKey(prod);
        prod['key'] = key;
        if(key && prod) products[key] = prod;
      });
      return products;
    }
    return null;
  }

  /**
   * Products can be referennced by their key
   * @param  /[a-z]{1}d{4}/gi
   * @return  {string|null}
   * attempts to return a product key from product.id
   */
  productKey = (prod:product):string | null => {
    let matches = prod.id.match(/[a-z]{1}\d{4}/gi);
    if(matches && matches[0]) return matches[0];
    return null;
  }

  public collect = (key:string, data:any) => {
    DBConnect.sessionStart();
    let model = CMSModel.getModel(key);
    if(model){
      let repo = new Repository(model);

      let schemaKeys = Object.keys(model.schema.paths);
      let prodKeys  = Object.keys(data);

      prodKeys.map( (key:string) => {
        repo.find({key: key}, (err:any, result:any )=>{
          // console.log(result.length);

          let values = this.values(schemaKeys, data[key]);
          values['key'] = key;
          if(!result || result.length===0 || err!==null){
            repo.create(values, (err:any, prod:any)=>{
              console.log(`creating record ${prod.key}`);
            });
          }else{
            console.log(`record found ${result[0].key}`);
          }
          return this;
        });
      });
    }
  }

  /**
   * looks for existing stored images
   * .if exists then change href for each image object
   * @param  'collection.products'
   * @return
   */
  public renameMediaRefs = () => {
    let dir = './server/public/imgs/products';
    console.log(cnf.paths.product_image);
    readdir(dir, (err:any, files: any)=>{
      if(err===null){
        DBConnect.sessionStart();
        let repo:any = CMSModel.repo('products');
        if(repo){
          // console.log(files);
          repo.retrieve((err:any, prods:any)=>{
            if(err===null){
              prods.forEach((prod:any)=>{

                let id: string;
                let key:string = prod.key;
                let m_name = `${cnf.paths.shop_image_path}${key}_main_.jpg`;
                let t_name = `${cnf.paths.shop_image_path}${key}_thumbnail_.jpg`;

                let it:any = {
                  _0:{
                    name: m_name,
                    exists: files.indexOf(m_name) !==-1,
                    set: {'$set':{'hero.href':m_name}},
                    diffname: m_name !== prod.hero.href
                  },
                  _1:{
                    name: t_name,
                    exists: files.indexOf(t_name) !==-1,
                    set: {'$set':{'thumbnail.href':t_name}},
                    diffname: t_name !== prod.thumbnail.href
                  }
                };

                for(let _i in it){
                  if(it[_i].exists || it[_i].diffname ){
                    console.log(`prod: ${id} href changing to: ${it[_i].name}`);
                    repo.update({_id: id }, it[_i].set, (err:any, prod:any)=>{
                      console.log('updating');
                      console.log(prod);
                    });
                  }else{
                    console.log(`All is cool with hero.href for: ${it[_i].name}`);
                  }
                }

                for(let j=0; j<prod.images.length; j++){
                  let name = `${cnf.paths.shop_image_path}${key}_images_${j+1}_.jpg`;
                  let exists = files.indexOf(name) !==-1;
                  if(exists || name !== prod.images[j].href){
                    console.log(`prod: ${id} href changing to: ${name}`);
                    let ip = `images.${j}.href`;
                    repo.update({_id: id},{'$set':{[ip]:name}}, (err:any, prod:any)=>{
                      console.log('updating');
                      console.log(prod);
                    });
                  }else{
                    console.log(`All is cool with images.${j}.href for: ${name}`);
                  }
                }
                return this;
              });
            }
          });
        }
      }else{
        console.log('meida files have not yet been downloaded');
      }
    });
  }

  /**
   * pulls media files into the local server/public/products dir
   * @param  'products'
   * @return {void}
   */
  public grabMedia = () => {
    let repo = CMSModel.repo('products');
    let refs:any = {};
    if(repo){
      repo.retrieve((err:any, records:any)=>{
        for(let i in records){

          //product record.key; record.hero; record.images
          let key:string = records[i].key;
          let href:string = records[i].hero.href;
          let name = `${key}_main_`
          refs[name] = href;

          name = `${key}_thumbnail_`
          href = records[i].thumbnail.href;
          refs[name] = href;

          //product record.images []
          let subsets = records[i].images;
          for(let j=0; j<subsets.length; j++){
            let href:string = subsets[j].href;
            let name = `${key}_images_${j+1}_`;
            refs[name] = href;
          }
        }
        console.log(refs);
        for(let name in refs){
          this.download(refs[name], name);
        }
      });
    }
  }

  public createCacheFile = () => {
    DBConnect.sessionStart();
    CMSModel.cacheable('products', (cacheable:Array<string>)=>{
      let cache = cnf.cache.shop.products.concat(cacheable);

      readFile(cnf.cache.shop.client, 'utf8' ,(err:any, file:any)=>{
        if(err === null){
          let content = file.replace('___CACHE_INSERT___', JSON.stringify(cache));

          // console.log(content);
          writeFile(cnf.cache.shop.server, content , (err)=>{
            if(err ===null){
              return console.log('File saved');
            }
            return console.log(err);
          });

        }else{
          console.log(err);
        }
      });

    });
  }

  public exportJson = () => {

    DBConnect.sessionStart();
    let repo = CMSModel.repo('products');

    repo.retrieve((err:any, data:any)=>{
      let json:string = JSON.stringify(data);

      writeFile('./data.json',json, (err)=>{
        if(err===null){
          console.log('data saved as json');
          readFile('./data.json', (err:any, string:any)=>{
            if(err===null){
              console.log(JSON.parse(string));
            }else{
              console.log('oops');
              console.log(err);
            }

          });
        }else{
          console.log('Error');
          console.log(err);
        }

      });

    });

  }

  /**
   * request lib is now our best friend.. liking this bueno mochos Garcia
   * downloads media files into the dir
   * @param url, name
   * @return {void}
   */
  private download = (url:string, name:string) => {
    let suffix = '.jpg';
    // console.log(`should use cnf.paths.product_image: ${cnf.paths.product_image}`);
    let dir = './server/public/imgs/products/';
    try{

    request.get(url)
      .on('error', (resp: any )=>{
        console.log(`Error on download for: `);
        console.log(resp);
        return null;
      })
      .on('response', (resp: any )=>{
        suffix = resp.headers['content-type'].replace('image/','.');
        console.log(`code: ${resp.statusCode} type: ${resp.headers['content-type']}`);
        console.log(url);
      })
      .pipe(createWriteStream(dir+name+suffix));
    }catch(e){
      console.log(`file may already be there for: ${url}`)
    }
  }

  private values = (schemaKeys:any, data:any) => {
    //acts filter... @TODO flatten and formalize process
      let product:any = {};
      schemaKeys.map(( s_key:string)=>{
        product[s_key] = data[s_key];
      });
      return product;
  }

}
