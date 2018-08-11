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
import Validation from '../../../server/utils/validation';
import {AccountController} from '../../../server/controllers/accountController';
import App from '../../../server/app';


let entries = [
  {
    fname: 'Jack',
    lname: 'Smith',
    mname: 'williams',
    email: 'jack@daisyranch.org',
    password: '12345678',
    confirm_password: '12345678',
  },
  {
    fname: 'Ziggy',
    lname: 'Airhead',
    mname: 'Sunset',
    email: 'ziggyAir@daisyranch.org',
    password: 'p@$$w0rd',
    confirm_password: 'p@$$w0rd',
  },
  {
    fname: 'Sheen',
    lname: 'Austria',
    mname: 'Summer',
    email: 'shiningMoment@daisyranch.org',
    password: 'aZ1p71d3$7h3r3',
    confirm_password: 'aZ1p7h1d3$7h3r3',
  },
  {
    fname: 'Samantha',
    lname: 'Jones',
    mname: 'Astriole',
    email: 'masnoj@daisyranch.org',
    password: 'JustaPhraseThatGoesOn',
    confirm_password: 'JustaPhraseThatGoesOn',
  },
  {
    fname: 'George',
    lname: 'Whistleton',
    mname: null,
    email: 'gwhislte@daisyranch.org',
    password: 'letmeknow',
    confirm_password: 'letmeknow',
  },
]


describe('validator tests',()=>{

  it('validations on controller requests',()=>{

    let control = new AccountController(App);
    let res = http_mocks.createResponse();
    let req;

    for(let i in entries ){
      req = http_mocks.createRequest({
        method: 'POST',
        url: '/forms',
        data: entries[i]
      });

      let specs = this.validators('registerj');
      let data  = req.body.data;
      let validators = specs.validators;
      console.log('Reset post reached');
      let result = Validation.batchValidate(validators, data);
      console.log(result);
    }
  });

  it('',()=>{
  });

});
