
///<reference path="../server.interface.d.ts" />

import * as  mongoose from 'mongoose';
import {Response, Request} from 'express';
import {Server} from 'https';
import {Socket} from '../com/socket';
import * as path from 'path';
import * as fs from 'fs';
import CMSModel from '../model/cmsModel';
import DBConnect from '../db/db_connect';

export class AccountController{
  /**
   */

  private server: Server;

  constructor(shopApp?: shopApp){
    // console.log(app);
    this.server = shopApp ? shopApp.getHttpsServer() : null;
  }

    public login = (req: Request, res:Response) => {

      console.log('login form');

      res.set('Content-Type', 'application/json');
      res.set('Service-Worker-Allowed', '/');
      res.write(JSON.stringify({id:'nothing really at all'}));
      res.end();
    }

    public authenticate = (req: Request, res:Response) => {
      // console.log(req.csrfToken);
      this.message(res, {
        type: 'error',
        message: 'no account found',
      });
    }

    private  message = (res:Response, message:message) => {
      res.set('Content-Type', 'application/json');
      res.set('Service-Worker-Allowed', '/');
      res.write(JSON.stringify(message));
      res.end();
    }

}
