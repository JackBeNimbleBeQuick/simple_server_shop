///<reference path="../server.interface.d.ts" />

import * as  mongoose from 'mongoose';
import {Response, Request, NextFunction} from 'express';
import {Server} from 'https';
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

interface formAttr{
  name:string,
  label:string,
  type:string,
  [Identifier:string]:any
}

export class FormsController{

  private server: Server;
  private template_path: string;
  private csrfTokens: any;
  private app: any;

  constructor(shopApp: shopApp){
    this.app = shopApp.get();
    this.server = shopApp ? shopApp.getHttpsServer() : null;
    this.template_path = path.join(__dirname, '../templates');
  }

  //@NOTE providing req:any until the ts-node typings catch up
  //@NOTE as of now thing bonk for the csrf function even when it does exist
  public forms = (req: any, res:Response, cb?:Function) => {

    this.app.set('view engine','pug');
    this.app.set('views', this.template_path);
    let token:string = res.locals.token;

    // console.log(`Forms: token: ${token}`);

    let boxed = this.formBuilds(req,token);

    //@NOTE annoying unable use method for common Response settings
    res.set('Content-Type', 'application/json');
    res.set('Service-Worker-Allowed', '/');
    res.write(JSON.stringify(boxed));
    res.end();

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
  private formBuilds = (req:any, token?: string) => {

    let template = this.template_path+'/forms/form.pug';

    let submitLabel = 'Submit';

    let action:string = '/register';

    //NOTE determine request type on GET
    let pathName:string|undefined = url.parse(req.url).pathname;
    let type = pathName ? pathName.replace('/forms/','') : 'register';

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
      case 'applets':

       break;
      case 'register':
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
          name: 'sigmond',
          type: 'captcha',
          label: 'I am not a robot?'
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
        data.validators['login'] = ['optional'];
        data.validators['sigmond']  = ['required'];
        data.validators['password'] = ['required','password'];
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
      spec.rendered   = pug.renderFile(template, {Spec: data.form, token: token, submitLabel: submitLabel, action: action});
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
