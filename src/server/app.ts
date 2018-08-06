
///<reference path="./server.interface.d.ts" />
import * as express from 'express';
import {Response, Request, NextFunction } from 'express';
import * as body from 'body-parser';
import * as csrf from 'csurf';
import * as favicon from 'serve-favicon';
import * as path from 'path';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import {Routes} from './route/routes';

//session

//session setup
import * as connect from 'connect-mongo';
import * as mongoose from 'mongoose';
import * as crypt from 'crypto';
import cnf from './config/connect.cnf';

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
  private db:any;

  //@NOTE tieing the mongoose connection to start up
  constructor(){
    this.app = express();
    this.router = new Routes(this);
  }

  private start = ():void => {
    let csrfToken = csrf({ cookie: true});

    let connector = connect(session);
    mongoose.connect(cnf.mongoUrl,cnf.session.options);
    this.db = mongoose.connection;

    let store = new connector({mongooseConnection: this.db});

    let sessions = session({
      store: store,
      name: 'app.sid',
      secret: cnf.key,
      resave: true,
      saveUninitialized: true,
      cookie: {
        secure: true,
        httpOnly: true,
        maxAge: cnf.hours*cnf.hour
      }
    })

    this.app

      .use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

      .use(helmet())

      .use(helmet.hidePoweredBy({setTo: 'DaisyRanch tm'}))

      .use(body.json())

      .use(body.urlencoded({extended: true}))

      .use(cookieParser(cnf.key))

      .use(sessions)

      // .use(csrf({cookie: true}))

      //@NOTE not using session on public at this point
      .use('/public',express.static(__dirname + '/public',{
        setHeaders: (res: Response) => {
          res.setHeader('Service-Worker-Allowed', '/');
        }
      }))

      .use((req:Request, res:Response, next:NextFunction) => {
        // sessions(req,res,next);
        next();
      });

    this.router.routes();


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
