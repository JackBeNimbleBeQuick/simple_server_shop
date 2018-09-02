///<reference path="../server.interface.d.ts" />
import * as connect from 'connect-mongo';
import * as mongoose from 'mongoose';
import * as crypt from 'crypto';
import * as session from 'express-session';
import cnf from '../config/connect.cnf';
import CMSModel from '../model/cmsModel';
import {Repository} from '../model/repository';

export class DBConnect {

  //@TODO provide correct typings for these as needed
  // private sessionData :any;
  private mongoData :any;
  private connection:any=null;
  private sessionRepo: any;
  private db:any;
  private promise:any;

  constructor(){
    // this.sessionRepo = CMSModel.repo('session');
    this.db = mongoose.connection;
    this.promise = global.Promise;
  }

  public sessionStart = (cb?:Function):any => {
    if(this.connection) return this.connection;

    let options:Object = cnf.session.options;

    this.connection = mongoose.connect(cnf.mongoUrl, {}, (err:any)=>{
      if(cb){
        return cb()
      }
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
      console.log('Attempting to close connection');
      // console.log(this.connection);
      // this.connection.close();
      this.connection = null;
    }
  }

}
export default new DBConnect();
