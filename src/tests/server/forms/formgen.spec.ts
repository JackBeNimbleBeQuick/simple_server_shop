///<reference path="../../../server/server.interface.d.ts" />
import * as  mongoose from 'mongoose';
import {Response, Request, NextFunction} from 'express';
import * as path from 'path';
import * as pug from 'pug';
import {readFile} from 'fs';
import * as url from 'url';
import * as events from 'events';
import * as should from 'should';
import * as csrf from 'csurf';
import * as http_mocks from 'node-mocks-http';
import CMSModel from '../../../server/model/cmsModel';
import DBConnect from '../../../server/db/db_connect';
import {AccountController} from '../../../server/controllers/accountController';
import {FormsController} from '../../../server/controllers/formsController';
import App from '../../../server/app';


describe('Schema base form tests', ()=>{

  it('Extract form data from schema', ()=>{

    let shouldbe = {
      person:{
        count: 3,
      }
    }

    let entities = ['Person'];

    entities.map((key:string, i:number)=>{
      let data:any = CMSModel.config(key);
      // let keys:Array<string> = Object.keys(data);
      let formSpec = [];

      // console.log(data);

      for(let name in data){
        let field = data[name];

        if ( field.meta && field.meta.form){
          formSpec.push(field.meta.form);
        }

      }
      // console.log(field);
      let sbKey = key.toLowerCase();
      expect(formSpec.length).toEqual(shouldbe[sbKey].count);

      console.log(formSpec);
    });
  });

  it('Render tests for Pug',()=>{
    let control = new AccountController(App);
    let forms   = new FormsController(App);
    let res = http_mocks.createResponse();
    let req = http_mocks.createRequest({
      method: 'POST',
      url: '/forms',
      data: {
        form: 'register'
      }
    });

    res.on('end', (data)=>{
      console.log('End event received');
      console.log(data);
      console.log(res);
    });

    let spec = forms.forms(req,res, (result:any) => {
      console.log('Result from controller method');
      console.log(result);
      console.log(res);
    });

  });

  //it('',()=>{});
});
