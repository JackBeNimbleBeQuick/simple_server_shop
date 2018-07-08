
import * as express from 'express';
import * as body from 'body-parser';
import {Server} from 'https';
import {Routes} from './route/routes';
//setup sessions env
import * as session from 'express-session';
import * as helmet from 'helmet';
//setup db
import * as connect from 'connect-mongo';
import * as mongoose from 'mongoose';
import * as crypt from 'crypto';
import cnf from './config/connect.cnf';


/**
 * Application configurations and set up class
  . Routes are instataited with this app as it is created
  .. this way app is never imported again from fs after instantiation
 */
class App implements shopApp{
  private app: express.Application;
  private router:Routes;
  private storage:any;
  public httpsServer:any;

  //@NOTE tieing the mongoose connection to start up
  constructor(){
    this.app = express();
    this.mongoSetup();
  }

  private start = ():void => {
    this.router.routes();
    this.app
      .use(helmet())
      // .use(helmet.hidePoweredBy())
      .use('/public',express.static(__dirname + '/public'))
      .use('/shop/js',express.static(__dirname + '/public/js/shop'))
      .use(session(this.sessionCnf()))
      .use(body.json())
      .use(body.urlencoded({extended: false}))
      //** @TODO changes for react to come
      ;

  }

  private mongoSetup = ():void => {
    // console.log(connect);

    mongoose.connect(cnf.mongoUrl, {}, (err)=>{
      if(err){
        console.log(`mongoose did not connect ${err}`);
        process.exit;
      }
    });
  }

  //Session configuration
  private sessionCnf = ():sessionConnect => {

    this.storage = connect(session);

    return {
      store: new this.storage(cnf.session),
      secret: cnf.key,
      maxAge: new Date(Date.now() + 60*60*1000*cnf.duration),
      saveUninitialized: true,
      resave: false,
    }
  }

  public init = ():express.Application => {
    return this.app;
  }

  public buildRoutes = () => {
    this.router = new Routes(this);
    this.start();
  }

  /**
   * Providing separate method from init to support possible
   * differences from the initial startup of app and accessing the running instance
   *  ?? really not too clear on this yet 8^)
   * @return {express.Application}
   */
  public get = () => {
    return this.app;
  }

  public getHttpsServer = () => {
    return this.httpsServer;
  }


}
export default new App();
