///<reference path="../server.interface.d.ts" />
import * as connect from 'connect-mongo';
import * as mongoose from 'mongoose';
import * as crypt from 'crypto';
import cnf from '../config/connect.cnf';
import * as session from 'express-session';
import CMSModel from '../model/cmsModel';
import {Repository} from '../model/repository';

export class DBConnect {

  //@TODO provide correct typings for these as needed
  private sessionData :any;
  private mongoData :any;
  private connection:any=null;

  constructor(){
  }

  public sessionStart = ():any => {
    if(this.connection) return this.connection;

    let options:Object = cnf.session.options;
    this.connection = mongoose.connect(cnf.mongoUrl, options, (err:any)=>{
      if(err){
        console.log(`mongoose did not connect ${err}`);
        this.sessionStop();
        process.exit;
      }
    });
    return this.connection;
  }
  
  public sessionStop = ():any => {
    if(this.connection){
      this.connection.close();
      this.connection = null;
    }
  }

  public sessionDB = ():any => {

    let connector = connect(session);

    return {
      store: new connector(cnf.session),
      secret: cnf.key,
      maxAge: new Date(Date.now() + 60*60*1000*cnf.duration),
      saveUninitialized: true,
      resave: false,
    }

  }


}
export default new DBConnect();
