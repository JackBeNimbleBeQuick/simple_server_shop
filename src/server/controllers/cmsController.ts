///<reference path="../server.interface.d.ts" />
import * as  mongoose from 'mongoose';
import {Response, Request} from 'express';
import * as path from 'path';
import * as pug from 'pug';
import * as fs from 'fs';
import * as url from 'url';

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
    this.parts['body'] = 'Main introductions of app';
    res.render('layout',this.parts);
  }

  public shop = (req: Request, res:Response) => {
    let pathName:string|undefined = url.parse(req.url).pathname;
    let files    = path.join(__dirname, '../clients' + pathName);
    let template = this.template_path+pathName + '.pug';
    // console.log(files);
    // console.log(pathName);

    if(pathName === '/shop'){

      this.parts['title'] = 'Shopping';
      this.parts['heading'] = 'Time to shop!! 8^)"';
      this.parts['body'] = 'Shopping page';

      let data = pug.renderFile(template, this.parts);
      res.set('Content-Type', 'text/html');
      res.set('Service-Worker-Allowed', '/shop');
      res.write(data);
      return res.end();

    }

    fs.readFile(files, (err, data) => {

        if(err){
            res.writeHead(404, {'Content-type':'text/plan'});
            res.write('File Not Found');
            res.end();
        }
        else{
          let filter = /[\.](js|css|png|svg|gif|jpeg)/;
          let image = /(png|svg|gif|jpeg)/;
          let types = pathName ? pathName.match(filter): [];
          let type = types && types.length > 0 ? types[0].replace(/[\.]/,'') : '';
          let typed  = 'application/javascript';
          console.log(pathName);
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
    })

  }

  public login = (req: Request, res:Response) => {
    this.parts['title'] = 'Login please';
    this.parts['heading'] = 'Login page:';
    this.parts['body'] = 'Login form';
    res.render('layout',this.parts);
  }
}
