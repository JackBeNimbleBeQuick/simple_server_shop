///<reference path="../server.interface.d.ts" />

import * as  mongoose from 'mongoose';
import {Response, Request, NextFunction} from 'express';
import {Server} from 'https';
import * as path from 'path';
import * as url from 'url';
import * as pug from 'pug';
import Mailer from '../mail/mailer';
import CMSModel from '../model/cmsModel';
import DBConnect from '../db/db_connect';
import Validation from '../utils/validation';
import FormActions from './formactions';


export class FormsController{

  private server: Server;
  private template_path: string;
  private csrfTokens: any;
  private app: any;

  constructor(shopApp: shopApp){
    this.app = shopApp.get();
    this.server = shopApp ? shopApp.getHttpsServer() : null;
    this.template_path = path.join(__dirname, '../templates');
  }

  //@NOTE providing req:any until the ts-node typings catch up
  //@NOTE as of now thing bonk for the csrf function even when it does exist
  public forms = (req: any, res:Response, cb?:Function) => {

    this.app.set('view engine','pug');
    this.app.set('views', this.template_path);
    let token:string = res.locals.token;

    // console.log(`Forms: token: ${token}`);

    let boxed = FormActions.formBuilds(req,token);

    //@NOTE annoying unable use method for common Response settings
    res.set('Content-Type', 'application/json');
    res.write(JSON.stringify(boxed));
    res.end();

  }
}
