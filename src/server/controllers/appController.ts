import * as  mongoose from 'mongoose';
import {Response, Request} from 'express';
import {Server} from 'https';
import {Socket} from '../com/socket';
import * as path from 'path';
import * as fs from 'fs';

export class AppController{
  /**
   * @TODO
   . provide initial pages of app as server rendered
   */

  private server: Server;
  private io: any;

  constructor(shopApp?: shopApp){
    // console.log(app);
    this.server = shopApp.getHttpsServer();
    this.io = new Socket(this)
  }

  public startIO = () => {
    this.io.tap('client', this.update);
  }

  public update = (socket, data) => {
    console.log('AppController.update: response');
    console.log(data);

    switch(data.type){
      //send update based on version / response
      case 'handshake':
        socket.emit('server',JSON.stringify({type: 'news', data: 'Hello from server'}));
        break;
      case 'clientState':
        console.log('Client state returned');
        break;
    }
  }

  public getApp = (req: Request, res:Response) => {
    console.log(req);
  }

}
