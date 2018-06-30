
import {Request , Response, NextFunction} from 'express';
import {CmsController} from '../controllers/cmsController';
import {AppController} from '../controllers/appController';
import * as path from 'path';

export class Routes{

  cms:CmsController;
  apps: AppController;
  app: any;
  expressApp: any;

  constructor(expressApp:shopApp){
    this.app = expressApp.get();
    this.expressApp = expressApp;
    this.cms = new CmsController(expressApp);
    this.apps = new AppController(expressApp);
  }

  /**
   * Provides base routing logic
   * @param  ''
   * @return {void} routes to permitted parts of app
   */
  public routes = () =>{
    // console.log(this.app);

    this.app.route('')
      .get(this.cms.main)

    this.app.route('/main')
      .get(this.cms.main)

    this.app.route('/shop')
      .get(this.cms.shop)

    this.app.route('/login')
      .get(this.cms.login)

    this.app.route('/app')
      .get(this.apps.getApp)

    //all none existing routes
    this.app.route('*')
      .get(this.cms.main)


  }

}
