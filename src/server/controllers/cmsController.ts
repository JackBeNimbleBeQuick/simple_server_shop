///<reference path="../server.interface.d.ts" />
import * as  mongoose from 'mongoose';
import {Response, Request, NextFunction} from 'express';
import * as path from 'path';
import * as pug from 'pug';
import * as fs from 'fs';
import * as url from 'url';
import CMSModel from '../model/cmsModel';
import DBConnect from '../db/db_connect';

export class CmsController{

  private basePath: string;

  private parts: any;

  private app: any;

  private template_path: string;

  constructor(app:shopApp){

    this.app = app.get();
    this.template_path = path.join(__dirname, '../templates');


    //@NOTE Pug templates
    //@TODO evaluate client functions versus cached html .. et al.
    this.basePath = path.join(__dirname, '../templates');
    this.app.set('view engine','pug');
    this.app.set('views', this.basePath);

    //@NOTE provides simplistic rendering scheme using pug
    this.parts = {
      title: 'Home',
      heading: 'Header for Home',
      body: 'Some introductory notes and words',
      footer: 'foot notes'
    }

  }

  public main = (req: Request, res:Response) => {
    this.parts['title'] = 'Main page';
    this.parts['headng'] = 'Welcome to our site';
    this.parts['content'] = 'Main introductions of app';
    res.render('layout',this.parts);
  }


  public login = (req: Request, res:Response) => {
    this.parts['title'] = 'Login please';
    this.parts['heading'] = 'Login page:';
    this.parts['content'] = 'Login form';
    res.render('layout',this.parts);
  }

  public shop = (req: Request, res:Response) => {
    let pathName:string|undefined = url.parse(req.url).pathname;
    let template = this.template_path+pathName + '.pug';

    /*
      filter for path only /path/** attempts to read file as ServiceWorker
     */
    if(pathName === '/shop'){

      this.parts['title'] = 'Shopping';
      this.parts['heading'] = 'Time to shop!! 8^)"';
      this.parts['content'] = 'Shopping page';

      let data = pug.renderFile(template, this.parts);
      res.set('Content-Type', 'text/html');
      res.set('Service-Worker-Allowed', '/shop');
      res.write(data);
      return res.end();

    }else if(pathName === '/shop/data'){
      let repo = CMSModel.repo('products');
      DBConnect.sessionStart();
      console.log('Getting shop data')
      repo.retrieve((err:any, data:any)=>{
        if(err===null){
          res.set('Content-Type', 'application/json');
          res.set('Service-Worker-Allowed', '/shop');
          res.write(JSON.stringify(data));
          return res.end();
        }
        return this.notFound(res);
      });
    }else{
      return pathName ? this.serveServiceWorker(pathName,res) : this.notFound(res);
    }


  }

  private notFound = (res:Response) => {
    res.writeHead(404, {'Content-type':'text/plan'});
    res.write('File Not Found');
    res.end();
  }

  private serveServiceWorker = (_path:string, res:Response) => {
    let files    = path.join(__dirname, '../clients' + _path);

    fs.readFile(files, (err, data) => {

        if(err){
          return this.notFound(res);
        }else{

          let filter = /[\.](js|css|png|svg|gif|jpeg)/;
          let image = /(png|svg|gif|jpeg)/;
          let types = _path ? _path.match(filter): [];
          let type = types && types.length > 0 ? types[0].replace(/[\.]/,'') : '';
          let typed  = 'application/javascript';
          console.log(_path);
          console.log(type);

          switch(type){
            case 'css':
              typed  = 'text/css';
            break;
            default:
            if(image.test(type)){
              typed =  'image/' + 'type';
            }
          }
          console.log(typed);

          res.writeHead(200, {'Service-Worker-Allowed':'/', 'Content-Type': typed});
          res.write(data);
          return res.end();

        }
    });

  }
}
