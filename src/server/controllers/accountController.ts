
///<reference path="../server.interface.d.ts" />

import * as  mongoose from 'mongoose';
import {Response, Request, NextFunction} from 'express';
import {Server} from 'https';
import {Socket} from '../com/socket';
import * as path from 'path';
import * as url from 'url';
import * as pug from 'pug';
import * as Promise from 'promise';
import Responder from './boilerplate/responder';
import CMSModel from '../model/cmsModel';
import Mailer from '../mail/mailer';
import DBConnect from '../db/db_connect';
import Validation from '../utils/validation';
import {FormsController} from './formsController';
import cnf from '../config/connect.cnf';


//Interfaces needed for this class
interface validations{
  filters: any,
  validators: any,
}

export class AccountController{

  private server: Server;
  private template_path: string;
  // private response: Object;
  private csrfTokens: any;
  private app: any;

  constructor(shopApp: shopApp){
    this.app = shopApp.get();
    this.server = shopApp ? shopApp.getHttpsServer() : null;
    this.template_path = path.join(__dirname, '../templates');
    // this.response = require(path.join(__dirname, 'boilerplate', cnf.locale.lang, cnf.locale.region))['default'];
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
    let data  = req.body.data;

    this.validateAction(req, res, ()=>{

      CMSModel.createAccount(data , ()=> {this.dataSuccess(res,'registered')}, this.dataError);

      //email reset
      this.sendMail({
        type: 'create_enrol',
        fname: data.fname,
        lname: data.lname,
        mname: data.mname,
        email: data.email,
      });

      //send http response
      res.set('Content-Type', 'application/json');
      res.write(JSON.stringify({
        type: 'response',
        message: Responder.render('create_enrol'),
        token: '',
        action: 'none',
        validators: {},
        filters: {},
      }));
      res.end();

    }, (result:any) => {
        //return errors from result
        res.send({
          errors: result.failed
        });
    });

  }

  //@TODO abstract out the data queries to db.querieName(ql, success, errro);
  public reset = (req: Request, res:Response, next:NextFunction) => {
    let data  = req.body.data;

    if(data.login){

      CMSModel.setResetKeyByLogin(data.login, (reset) => {

        if(reset.person){

          let person = reset.person;
          let login  = reset.login;
          let key    = reset.resetKey;

          let mailer = {
            type: 'start_reset',
            fname: person.fname,
            lname: person.lname,
            mname: person.mname,
            email: login.email,
            key:   key
          }

          let pkg = Mailer.mailer(mailer, 'start_reset');
          Mailer.mail(pkg);
        }
      });
    }

    //send http response
    res.set('Content-Type', 'application/json');
    res.write(JSON.stringify({
        type: 'response',
        message: Responder.render('start_reset'),
    }));

    res.end();

  }

  public activate = (req: Request, res:Response, next:NextFunction) => {
    let data  = req.body.data;
    console.log(data);

    this.validateAction(req, res, (result:any)=>{

      console.log(result);

      res.write(JSON.stringify({
          type: 'reset_complete',
          message: Responder.render('reset_complete'),
      }));

      res.end();

    }, (result: any) => {

      res.send({
        errors: result.failed
      });

    });
  }

  private sendMail = (mailer) => {
    //send mail
    let pkg = Mailer.mailer(mailer , mailer.type);
    Mailer.mail(pkg);
    // console.log(pkg);
  }

  /**
   * Generalized Validation
   * @param  req.url
   * @return void Success or Fail Function gets called
   */
  private validateAction = (req: Request, res: Response, scs:Function, fail:Function) => {

    let data  = req.body.data;
    let path_o:any = req.url
      ? url.parse(req.url).pathname
      : "";

    let specs = this.validators(path_o.replace('/',''));
    console.log(`Validating for: ${path_o}`);

    // console.log(data)
    if(!data){
      console.log(`ERROR: no data defined`);
      res.sendStatus(404);
    }

    let validator = new Validation(DBConnect, CMSModel);
    let validators = specs.validators;
    let captcha = req.session && req.session.captcha;
    data['captcha'] = captcha;
    validator.batch(validators, data, (result)=>{

      if(result.isValid)
        return scs(result);

      return fail(result);

    })
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

      case 'activate':
        data.validators['confirm_password'] = ['match.password','required'];
        break;

      case 'reset':
        data.validators['login'] = ['required'];
        data.filters['login'] = [];
        break;

      case 'login':
        data.validators['login'] = ['required'];
        data.validators['confirm_password'] = ['match.password','required'];
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
