
///<reference path="./server.interface.d.ts" />
import * as express from 'express';
import {Response, Request, NextFunction} from 'express';
import * as body from 'body-parser';
import * as csrf from 'csurf';
import {Routes} from './route/routes';

//setup sessions env
import * as helmet from 'helmet';

import DBConnect from './db/db_connect';

/**
 * Application configurations and set up class
  . Routes are instataited with this app as it is created
  .. this way app is never imported again from fs after instantiation
 */
class App implements shopApp{
  private app: express.Application;
  private router:Routes;
  public httpsServer:any;

  //@NOTE tieing the mongoose connection to start up
  constructor(){
    this.app = express();
    this.router = new Routes(this);
    DBConnect.sessionStart();
  }

  private start = ():void => {
    this.router.routes();
    this.app
      .use(helmet.hidePoweredBy())
      .use('/public',express.static(__dirname + '/public',{
        setHeaders: (res: Response) => {
          res.setHeader('Service-Worker-Allowed', '/');
        }
      }))
      .use(DBConnect.sessionDB)
      .use(body.json())
      .use(body.urlencoded({extended: false}))
      .use(csrf())
      .use(helmet())
      .use((req:Request, res:Response, next:NextFunction) => {
        // res.locals.csrftoken = csrf()
        next();
      });
  }

  public init = ():express.Application => {
    return this.app;
  }

  public buildRoutes = () => {
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
