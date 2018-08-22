
import {Request, Response, NextFunction, Application} from 'express';
import {Server} from 'https';
import * as csrf from 'csurf';
import * as svgCaptcha from 'svg-captcha';
import {CmsController} from '../controllers/cmsController';
import {AppController} from '../controllers/appController';
import {AccountController} from '../controllers/accountController';
import {FormsController} from '../controllers/formsController';
import * as path from 'path';

export class Routes{

  cms:CmsController;
  app: Application;
  apps: AppController;
  acc: AccountController;
  forms: FormsController;
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
    this.forms = new FormsController(shopApp);
  }

  public gets = () => {

    this.app.route('')
      .get(this.cms.main)

    this.app.route('/main')
      .get(this.cms.main)

    this.app.route('/shop*')
      .get(this.cms.shop)

    this.app.route('/forms*')
      .get(this.forms.forms);

    this.app.route('/app')
      .get(this.apps.getApp)

    this.app.route('/_reset*')
      .get(this.cms._reset)

    //Captcha for registrations
    this.app.route('/sigmond')
      .get( (req: Request,res:Response) =>{
        let sigmond = svgCaptcha.createMathExpr({
        	// background: 'rgba(255,255,255,0.7)',
          color: true,
          fontSize: 45,
          height: 25,
          noise: 4,
          width: 100,
        })
        if(req.session) req.session.captcha = sigmond.text;

        res.type('svg')
        res.status(200).send(sigmond.data)
      })
  }

  public posts= () => {

    this.app.route('/login')
      .post(this.acc.login)

    this.app.route('/register')
      .post(this.acc.register)

    this.app.route('/reset')
      .post(this.acc.reset)

    this.app.route('/validation')
      .post(this.acc.validation)

  }

}
