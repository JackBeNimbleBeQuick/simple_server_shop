
///<reference path="../server.interface.d.ts" />

import * as  mongoose from 'mongoose';
import {Response, Request, NextFunction} from 'express';
import {Server} from 'https';
import {Socket} from '../com/socket';
import * as path from 'path';
import * as url from 'url';
import * as pug from 'pug';
import CMSModel from '../model/cmsModel';
import DBConnect from '../db/db_connect';
import Validation from '../utils/validation';

interface formSpec{
  rendered: string,
  form: Array<any>,
  filters: any,
  validators: any,
}

interface validations{
  filters: any,
  validators: any,
}

interface formAttr{
  name:string,
  label:string,
  type:string,
  [Identifier:string]:any
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

    console.log('Registration post reached');
    console.log(req.body.data);

    //@NOTE annoying unable use method for common Response settings
    res.set('Content-Type', 'application/json');
    res.set('Service-Worker-Allowed', '/');
    res.write(JSON.stringify({id:'nothing really at all'}));
    res.end();
  }

  public register = (req: Request, res:Response, next:NextFunction) => {
    console.log('Register post reached');
    let specs = this.validators('register');
    let data  = req.body.data;
    let validators = specs.validators;
    let captcha = req.session && req.session.captcha;
    data['captcha'] = captcha;
    console.log('Registration post reached');
    console.log(data);
    console.log(specs);


    let result = Validation.batchValidate(validators, data);
    console.log(result);
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

  //@NOTE providing req:any until the ts-node typings catch up
  //@NOTE as of now thing bonk for the csrf function even when it does exist
  public forms = (req: any, res:Response, cb?:Function) => {

    this.app.set('view engine','pug');
    this.app.set('views', this.template_path);
    let token:string = res.locals.token;

    // console.log(`Forms: token: ${token}`);

    let boxed = this.formBuilds(req, res, token);

    //@NOTE annoying unable use method for common Response settings
    res.set('Content-Type', 'application/json');
    res.set('Service-Worker-Allowed', '/');
    res.write(JSON.stringify(boxed));
    res.end();

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
        data.validators['email'] = ['email'];
        data.validators['login'] = ['optional','unique'];
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

  //@NOTE there are parts of this may need to be parted out
  //  .get needs rendered template
  //  .post just needs validators and filters
  /**
   * provide connecting details from model schema and specific
   * GET responses
   * POST Processint
   * @param  req
   * @return         [description]
   */
  private formBuilds = (req:any, res: Response, token?: string) => {

    let template = this.template_path+'/forms/form.pug';

    let submitLabel = 'Submit';

    let action:string = '/register';

    //NOTE determine request type on GET
    let pathName:string|undefined = url.parse(req.url).pathname;
    let type = pathName ? pathName.replace('/forms/','') : 'register';
    let captcha = false;

    //NOTE initialize data object
    let data:any = {};
    data.hasData = false;

    let spec:formSpec = {
      rendered: '',
      form: [],
      filters: {},
      validators: {},
    };

    switch(type){
      case 'register':
        captcha = true;
        action = '/register';
        submitLabel = 'Create account';
        data = this.extractForm('Person');
        data.form.push({
          name: 'email',
          type: 'email',
          label: 'Email',
          autocomplete: 'email',
        });

        data.form.push({
          name: 'login',
          type: 'text',
          label: 'Login (optional)',
          autocomplete: 'additional-name',
        });

        data.form.push({
          name: 'password',
          type: 'password',
          label: 'Password',
          autocomplete: 'off',
        });

        data.form.push({
          name: 'confirm_password',
          type: 'password',
          label: 'Password confirmation',
          autocomplete: 'off',
        });

        data.validators['email'] = ['email'];
        data.validators['login'] = ['optional','unique'];
        data.validators['sigmond']  = ['required'];
        data.validators['password'] = ['password','required'];
        data.validators['confirm_password'] = ['match.password','required'];

        data.filters['email'] = [];
        data.filters['login'] = [];
        data.filters['password'] = [];
        data.filters['confirm_password'] = [];
        data.hasData = true;
        break;

      case 'login':
        action = '/login';
        submitLabel = 'Login';
        data = this.extractForm('Login');
        data.validators['login'] = ['required'];
        data.filters['login'] = [];
        data.hasData = true;
        break;

      case 'reset':
        action = '/reset';
        submitLabel = 'Reset account';
        data = this.extractForm('Login',/(pw)/);
        data.validators['login'] = ['required'];
        data.filters['login'] = [];
        data.hasData = true;
        break;
      default:
    }

    if(data.hasData){
      spec.form.push(data.form)
      spec.validators = data.validators;
      spec.filters    = data.filters;
      spec.rendered   = pug.renderFile(template, {Spec: data.form, token: token, submitLabel: submitLabel, action: action, captcha: captcha});
    }

    return {
      token: token,
      action: action,
      validators: spec.validators,
      filters: spec.filters,
      type:`${type}_form`,
      message:spec.rendered,
    }
  }

  private extractForm = (key:string, filter?: RegExp) => {
    let data:entitySpec| null = CMSModel.config(key);
    if(data){

      let formSpec:Array<formAttr> = [];
      let filters     = {};
      let validators  = {};
      let spec:any = {};

      for(let name in data){
        if(filter && filter.test(name)) continue;
        let field:entitySpec = data[name];
        if ( field.meta && field.meta.form){
          let form = field.meta.form;
          if(form.attributes) spec = form.attributes;

          //accumulate
          spec['name'] = name;
          spec['label'] = form.label;
          spec['type'] = form.type;

          validators[name]  = field.meta.form.validators;
          filters[name]     = field.meta.form.filters;

          //push the form spec
          // formSpec.push(field.meta.form);
          formSpec.push(spec);
        }

      }
      return {
        form: formSpec,
        filters: filters,
        validators: validators,
      };
    }
    return {
      form: [],
      filters: {},
      validators: {},
    };

  }
}
