///<reference path="../server/server.interface.d.ts" />
import * as connect from 'connect-mongo';
import * as mongoose from 'mongoose';
import * as crypt from 'crypto';
import * as session from 'express-session';
import cnf from '../server/config/connect.cnf';
import CMSModel from '../server/model/cmsModel';
import {Repository} from '../server/model/repository';

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

  public action = {
  }

  public sessionStart = (cb?:Function):any => {
    if(this.connection) return this.connection;

      return mongoose.connect(cnf.tests.mongoUrl, cnf.tests.mongoOptions, (err:any)=>{
        if(cb){
          // return this.connection;
          return cb()
        }
        if(err){
          console.log(`mongoose did not connect ${err}`);
          this.sessionStop();
          process.exit;
        }
      });
    // return this.connection;
  }

  public dropDB = () => {
    // let promise = this.sessionStart();
    this.sessionStart().then((conn)=>{
      conn.connection.dropDatabase();
    });
  }

  public sessionStop = ():any => {
    if(this.connection){
      console.log('Attempting to close connection');
      // this.connection.close();
      this.connection = null;
    }
  }


}
export default new DBConnect();
