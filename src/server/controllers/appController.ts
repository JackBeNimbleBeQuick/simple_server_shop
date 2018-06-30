import * as  mongoose from 'mongoose';
import {Response, Request} from 'express';
import * as path from 'path';
import {WS} from '../com/ws'

export class AppController{
  /**
   * @TODO
   . provide initial pages of app as server rendered
   */

  private app: any;
  private ws: WS;

  constructor(app: shopApp){
    this.ws = new WS(app);
    this.app = app.get();
  }

  public getApp= (req: Request, res:Response) => {
  }

}
