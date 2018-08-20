
///<reference path="../server.interface.d.ts" />

import * as  mongoose from 'mongoose';
import {Response, Request, NextFunction} from 'express';
import {Server} from 'https';
import {Socket} from '../com/socket';
import * as path from 'path';
import * as url from 'url';
import * as pug from 'pug';
import * as Promise from 'promise';
import CMSModel from '../model/cmsModel';
import DBConnect from '../db/db_connect';
import Validation from '../utils/validation';


//Interfaces needed for this class
interface validations{
  filters: any,
  validators: any,
}

export class AccountController{

  private server: Server;
  private template_path: string;
  private csrfTokens: any;
  private app: any;

  constructor(shopApp: shopApp){
    this.app = shopApp.get();
    this.server = shopApp ? shopApp.getHttpsServer() : null;
    this.template_path = path.join(__dirname, '../templates');
  }

  //@NOTE good candidate for using react server side rendering..
  public login = (req: Request, res:Response, next:NextFunction) => {

    let data  = req.body.data;
    console.log('Registration post reached');
    console.log(data);

    //@NOTE annoying unable use method for common Response settings
    // res.set('Content-Type', 'application/json');
    // res.set('Service-Worker-Allowed', '/');
    // res.write(JSON.stringify({id:'nothing really at all'}));
    // res.end();
  }

  public validation = (req: Request, res:Response, next:NextFunction) => {
    let data = req.body.data;
    let toValidate = this.validator('register', data.field );

    let validate = new Validation(DBConnect, CMSModel);

    let post = {[data.field]: data.value};
    // console.log(toValidate);
    // console.log(post);

    validate.batch(toValidate, post, (result)=>{
      console.log(result);
      res.set('Content-Type', 'application/json');
      res.set('Service-Worker-Allowed', '/');
      res.write(JSON.stringify(result));
      res.end;
    });
  }

  public register = (req: Request, res:Response, next:NextFunction) => {
    console.log('Register post reached');
    let specs = this.validators('register');
    let data  = req.body.data;

    // console.log(data)
    if(!data){
      console.log(`ERROR: no data defined`);
      res.sendStatus(404);
    }

    //set and run validations
    let validator = new Validation(DBConnect, CMSModel);
    let validators = specs.validators;
    let captcha = req.session && req.session.captcha;
    data['captcha'] = captcha;
    validator.batch(validators, data, (result)=>{

      // console.log(result);
      if(result.isValid){
        CMSModel.createAccount(data , ()=> {this.dataSuccess(res,'registered')}, this.dataError);
      }else{
        //return errors from result
        res.send({
            errors: result.failed
        });
      }

    });
  }

  //@TODO abstract out the data queries to db.querieName(ql, success, errro);
  public reset = (req: Request, res:Response, next:NextFunction) => {
    let data  = req.body.data;
    if(data.login){
      let success = (result:any) => {
        console.log('SUCCESS');
        console.log(result);
        if(result.length ===1 ){
          //process reset functions
        }else if (result.lenth > 1){
          //should not happen as logins need to be uniquie
          //log issue as major conistency failure
        }
        // error process
      }
      let err = (err:any) => {
        console.log('ERROR');
        console.log(err);
      }
      this.query('Person', {login: data.login }, success, err);
    }
  }

  private validator = (type: string, key:string) => {
    let specs = this.validators(type);
    let validators = specs.validators;
    if(validators[key]) return {[key]: validators[key]};
    return {};
  }

  /**
   * Server side validators differ from client side
   * this provides a simple separation of those concerns
   * @param {string} type
   * @return {validations}
   *
   * @TODO clean out duplications between this and formBuilds methods
   */
  private validators = (type:string):validations => {
    let data:any = {
      validators: {},
      filters: {},
    };

    switch(type){
      case 'register':

        data.validators['login'] = ['unique.Login.login','optional'];
        data.validators['email'] = ['unique.Login.email','email'];
        data.validators['sigmond']  = ['match.captcha'];
        data.validators['password'] = ['password','required'];
        data.validators['confirm_password'] = ['match.password','required'];

        data.filters['email'] = [];
        data.filters['login'] = [];
        data.filters['password'] = [];
        data.filters['confirm_password'] = [];

        break;

      case 'reset':
        data.validators['login'] = ['required'];
        data.filters['login'] = [];
        break;

      case 'login':
        data.validators['login'] = ['required'];
        data.validators['password'] = ['password_match'];
        break;

    }

    return {
      validators: data.validators,
      filters: data.filters,
    }

  }

  private dataError= (res: Response, descript:string) => {
    res.sendStatus(503);
  }

  private dataSuccess = (res: Response, descript:string) => {
    res.send({success: descript});
  }

  private query = (entity: string, query:any, success: Function, err: Function) => {
    DBConnect.sessionStart();
    CMSModel.repo(entity).find(query, (err:any, result:any)=>{
      if(!err){
        return success(result);
      }
      return err(err);
    });
  }


}
