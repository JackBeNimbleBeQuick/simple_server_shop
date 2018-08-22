///<reference path="../server.interface.d.ts" />
import * as  mongoose from 'mongoose';
import {Response, Request, NextFunction} from 'express';
import * as path from 'path';
import * as pug from 'pug';
import {readFile} from 'fs';
import * as url from 'url';
import * as csrf from 'csurf';
import CMSModel from '../model/cmsModel';
import DBConnect from '../db/db_connect';
import FormActions from './formactions';

interface templateParts{
  heading: string,
  title: string,
  content: string,

  useForm?: boolean,
  formSpec?: Object,
  footer?: string,
  action?: string,
  token?: string,
}


export class CmsController{

  private basePath: string;

  private parts: any;

  private app: any;

  private csrfTokens: any;

  private template_path: string;

  constructor(app:shopApp){

    this.app = app.get();

    this.template_path = path.join(__dirname, '../templates');

    this.csrfTokens = csrf();

    //@NOTE Pug templates
    //@TODO evaluate client functions versus cached html .. et al.
    this.basePath = path.join(__dirname, '../templates');
    this.app.set('view engine','pug');
    this.app.set('views', this.basePath);

  }

  public main = (req: Request, res:Response) => {
    this.templateParts({
      title: 'Main page',
      heading: 'Welcome to our site',
      content: 'Main introductions of app',
    });
    res.render('layout',this.parts);
  }

  public _reset = (req: Request, res:Response) => {

    let path_o:any = req.url ? url.parse(req.url) : "";
    let key = path_o.path ? path_o.path.replace('/_reset/',''): '';

    CMSModel.getPersonByKey(key, (result) => {
      
      if(result.isValid){
        let token:string = res.locals.token;
        let form_data = FormActions.formData('resetPassword',token);

        this.templateParts({
          title: 'Rest account',
          heading: 'Reset account',
          content: '',

          useForm: true,
          formSpec: form_data.form,
          action: form_data.action,
          token: form_data.token,
        });

        res.render('layout', this.parts);

      }else{
        res.redirect('/');
      }
    });
  }

  public shop = (req: Request, res:Response) => {
    let pathName:string|undefined = url.parse(req.url).pathname;
    let template = this.template_path+pathName + '.pug';

    /*
      filter for path only /path/** attempts to read file as ServiceWorker
     */
    if(pathName === '/shop'){

      this.templateParts({
        title: 'Shopping',
        heading: 'Time to shop: ',
        content: '',
      });

      let data = pug.renderFile(template, this.parts);
      res.set('Content-Type', 'text/html');
      res.set('Service-Worker-Allowed', '/');
      res.write(data);
      return res.end();

    }else if(pathName === '/shop/data'){
      let repo = CMSModel.repo('products');
      // DBConnect.sessionStart();
      console.log('Getting shop data')
      repo.retrieve((err:any, data:any)=>{
        if(err===null){
          res.set('Content-Type', 'application/json');
          res.set('Service-Worker-Allowed', '/');
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

    readFile(files, (err, data) => {

        if(err){
          return this.notFound(res);
        }else{

          let filter = /[\.](js|css|png|svg|gif|jpeg)/;
          let image = /(png|svg|gif|jpeg)/;
          let types = _path ? _path.match(filter): [];
          let type = types && types.length > 0 ? types[0].replace(/[\.]/,'') : '';
          let typed  = 'application/javascript';
          // console.log(_path);
          // console.log(type);

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

  private templateParts = (templated: templateParts):void => {
    //@NOTE provides simplistic rendering scheme using pug
    this.parts = {
      title: templated.title,
      heading: templated.heading,
      content: templated.content,
      useForm: templated.useForm ? templated.useForm : false,
      formSpec: templated.formSpec ? templated.formSpec : null,
      action: templated.action ? templated.action : null,
      token: templated.token ? templated.token: null,
      footer: templated.footer
        ? templated.footer
        : 'Standard Footer Content',
    }


  }
}
