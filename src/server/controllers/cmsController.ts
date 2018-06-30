import * as  mongoose from 'mongoose';
import {Response, Request} from 'express';
import * as path from 'path';

export class CmsController{

  private basePath: string;

  private parts: Object;

  private app: any;

  constructor(app:shopApp){

    this.app = app.get();

    //@NOTE Pug templates
    this.basePath = path.join(__dirname, '../templates');
    this.app.set('view engine','pug');
    this.app.set('views', this.basePath);

    //@NOTE provides simplistic rendering scheme using pug
    this.parts = {
      title: 'Home',
      header: 'Header for Home',
      body: 'Some introductory notes and words',
      footer: 'foot notes'
    }

  }

  public main = (req: Request, res:Response) => {
    this.parts['title'] = 'Main page';
    this.parts['header'] = 'Welcome to our site';
    this.parts['body'] = 'Main introductions of app';
    res.render('layout',this.parts);
  }

  public shop = (req: Request, res:Response) => {
    this.parts['title'] = 'Shopping';
    this.parts['header'] = 'The main point of this Header "HEADS Up!! 8^)"';
    this.parts['body'] = 'Shopping page';
    res.render('layout',this.parts);
  }

  public login = (req: Request, res:Response) => {
    this.parts['title'] = 'Login please';
    this.parts['header'] = 'Login page:';
    this.parts['body'] = 'Login form';
    res.render('layout',this.parts);
  }
}
