import * as  mongoose from 'mongoose';
import {Response, Request} from 'express';
import {Server} from 'https';
import {Socket} from '../com/socket';
import * as path from 'path';
import CMSModel from '../model/cmsModel';
import DBConnect from '../db/db_connect';

export class AppController{
  /**
   * @TODO
   . provide initial pages of app as server rendered
   */

  private server: Server;
  private io: any;

  constructor(shopApp?: shopApp){
    // console.log(app);
    this.server = shopApp ? shopApp.getHttpsServer() : null;
    this.io = new Socket(this)
  }

  public startIO = () => {
    this.io.tap('client', this.update);
  }

  public update = (socket:any, data:any) => {
    console.log('AppController.update: response');
    console.log(`data type: ${data.type}`);
    console.log(data);

    switch(data.type){
      //send update based on version / response
      case 'get_updates':
        socket.emit('updates',JSON.stringify({type: 'start_update', data: {} }));
        break;
      case 'get_news':
        console.log('Client requesting news');
        break;
    }
  }

  public getApp = (req: Request, res:Response) => {
    console.log(req);
  }

  public getShopData = (req: Request, res:Response) => {
    DBConnect.sessionStart();
    let repo = CMSModel.repo('products');

  }

}
