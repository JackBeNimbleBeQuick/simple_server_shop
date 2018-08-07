
import {Request, Response, NextFunction, Application} from 'express';
import {Server} from 'https';
import * as csrf from 'csurf';
import {CmsController} from '../controllers/cmsController';
import {AppController} from '../controllers/appController';
import {AccountController} from '../controllers/accountController';
import * as path from 'path';

export class Routes{

  cms:CmsController;
  app: Application;
  apps: AppController;
  acc: AccountController;
  server: any;
  expressApp: any;
  csrfTokens: any;

  constructor(shopApp:shopApp){
    // console.log(expressApp.getHttpServer());
    this.app = shopApp.get();
    // this.expressApp = expressApp;
    this.server =  shopApp.getHttpsServer();
    this.cms  = new CmsController(shopApp);
    this.apps = new AppController(shopApp);
    this.acc  = new AccountController(shopApp);
  }

  /**
   * Provides base routing logic
   * @param  ''
   * @return {void} routes to permitted parts of app
   */
  public routes = () =>{

    this.app.route('')
      .get(this.cms.main)

    this.app.route('/main')
      .get(this.cms.main)

    this.app.route('/shop*')
      .get(this.cms.shop)

    this.app.route('/forms*')
      .get(this.acc.forms);

    this.app.route('/login')
      .post(this.acc.login)

    this.app.route('/app')
      .get(this.apps.getApp)

  }

}
