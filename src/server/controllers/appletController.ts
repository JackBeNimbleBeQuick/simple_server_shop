
///<reference path="../server.interface.d.ts" />

import * as  mongoose from 'mongoose';
import {Response, Request, NextFunction} from 'express';
import {Server} from 'https';
import {Socket} from '../com/socket';
import * as path from 'path';
import * as url from 'url';
import * as pug from 'pug';
import * as Promise from 'promise';

//@TODO create applet Model
import CMSModel from '../model/cmsModel';
import DBConnect from '../db/db_connect';

//@TODO add applet validators ... most like use of dtd validation i.e.Readfile apply
import Validation from '../utils/validation';


//Interfaces needed for this class
interface validations{
  filters: any,
  validators: any,
}


export class AppletController{

  public submit = (req: Request, res:Response, next:NextFunction) => {
    console.log('Register post reached');
    let specs = this.validators('applet');
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


  private validators = (type:string):validations => {
    let data:any = {
      validators: {},
      filters: {},
    };

    switch(type){
      case 'register':
       break;

    }

    return data;

  }


private dataError= (res: Response, descript:string) => {
    res.sendStatus(503);
  }


  private dataSuccess = (res: Response, descript:string) => {
    res.send({success: descript});
  }
}
