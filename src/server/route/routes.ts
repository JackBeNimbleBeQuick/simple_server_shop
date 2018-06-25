
import {Request , Response, NextFunction} from 'express';
import {CmsController} from '../controllers/CmsController';
import * as path from 'path';

export class Routes{

  cms:CmsController;
  app: any;

  constructor(app){
    this.app = app;
    this.cms = new CmsController(app);
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
  }

}
