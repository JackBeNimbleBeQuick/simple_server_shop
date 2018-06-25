
import * as express from 'express';
import * as body from 'body-parser';
import {Routes} from './route/routes';
import * as mongoose from 'mongoose';

/**
 * Application configurations and set up class
  . Routes are instataited with this app as it is created
  .. this way app is never imported again from fs after instantiation
 */
class App{
  private app: express.Application;
  private router:Routes;
  private mongoUrl = '';

  constructor(){
    this.app = express();
    this.config();
    this.router = new Routes(this.app);
    this.router.routes();
    // this.mongoSetup();
  }

  private config = ():void => {
    this.app
      .use(body.json())
      .use(body.urlencoded({extended: false}))
      //** @TODO changes for react to come
      .use(express.static('public'));
  }

  private mongoSetup = ():void => {
    mongoose.Promise = global.Promise;
    mongoose.connect(this.mongoUrl);
  }

  public init = ():express.Application => {
    return this.app;
  }

  /**
   * Providing separate method from init to support possible
   * differences from the initial startup of app and accessing the running instance
   *  ?? really not too clear on this yet 8^)
   * @return {express.Application}
   */
  public get = () =>{
    return this.app;
  }


}
export default new App();
