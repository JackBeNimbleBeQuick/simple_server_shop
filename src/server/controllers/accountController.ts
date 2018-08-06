
///<reference path="../server.interface.d.ts" />

import * as  mongoose from 'mongoose';
import {Response, Request} from 'express';
import {Server} from 'https';
import {Socket} from '../com/socket';
import * as path from 'path';
import * as pug from 'pug';
import CMSModel from '../model/cmsModel';
import DBConnect from '../db/db_connect';

interface formSpec{
  rendered: string,
  form: Array<any>,
  filters: any,
  validators: any,
}

export class AccountController{
  /**
   */

  private server: Server;
  private template_path: string;
  private csrfTokens: any;
  private app: any;

  constructor(shopApp: shopApp){
    this.app = shopApp.get();
    // console.log(app);
    this.server = shopApp ? shopApp.getHttpsServer() : null;
    this.template_path = path.join(__dirname, '../templates');
  }

    //@NOTE good candidate for using react server side rendering..
    public login = (req: Request, res:Response) => {
      // console.log('login form');
      // console.log(req.csrfToken);

      //@NOTE annoying unable use method for common Response settings
      res.set('Content-Type', 'application/json');
      res.set('Service-Worker-Allowed', '/');
      res.write(JSON.stringify({id:'nothing really at all'}));
      res.end();
    }

    public forms = (req: Request, res:Response, cb?:Function) => {
      this.app.set('view engine','pug');
      this.app.set('views', this.template_path);
      let type = req.body.data && req.body.data.form ? req.body.data.form : 'register' ;
      let form:any;
      let data:any={};
      let template = this.template_path+'/forms/form.pug';

      let spec:formSpec = {
        rendered: '',
        form: [],
        filters: {},
        validators: {},
      };

      data.hasData = false;

      let submitLabel = 'Add';

      switch(type){
        case 'register':
          submitLabel = 'Create account';
          data = this.extractForm('Person');
          data.hasData = true;

          data.form.push({
            name: 'email',
            type: 'email',
            label: 'Email',
          });

          data.form.push({
            name: 'login',
            type: 'text',
            label: 'Login (optional)',
          });

          data.form.push({
            name: 'password',
            type: 'password',
            label: 'Password',
          });

          data.form.push({
            name: 'confirm_password',
            type: 'password',
            label: 'Password confirmation',
          });


          data.validators['email'] = ['email'];
          data.validators['login'] = ['name','unique'];
          data.validators['password'] = ['password','required'];
          data.validators['confirm_password'] = ['match.password','required'];

          data.filters['email'] = [];
          data.filters['login'] = [];
          data.filters['password'] = [];
          data.filters['confirm_password'] = [];

          console.log(data);
          break;
        case 'reset':
          submitLabel = 'Reset account';
          data = this.extractForm('Login');
          data.hasData = true;
          break;
        default:
      }

      if(data.hasData){
        spec.form.push(data.form)
        spec.validators = data.validators;
        spec.filters    = data.filters;
        spec.rendered   = pug.renderFile(template, {Spec: data.form, Token: 'token', submitLabel: submitLabel});
      }

      let boxed = {
        validators: spec.validators,
        filters: spec.filters,
        type:`${type}_form`,
        message:spec.rendered,
      }

      //@NOTE annoying unable use method for common Response settings
      res.set('Content-Type', 'application/json');
      res.set('Service-Worker-Allowed', '/');
      res.write(JSON.stringify(boxed));
      res.end();

    }

    private extractForm = (key:string) => {
      let data:entitySpec| null = CMSModel.config(key);
      if(data){

        let formSpec:Array<entityForm> = [];
        let filters     = {};
        let validators  = {};

        for(let name in data){
          let field:entitySpec = data[name];
          if ( field.meta && field.meta.form){
            //accumulate
            field.meta.form['name'] = name;

            validators[name]  = field.meta.form.validators;
            filters[name]     = field.meta.form.filters;

            //push the form spec
            formSpec.push(field.meta.form);
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
