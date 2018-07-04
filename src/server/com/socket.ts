///<reference path="../server.interface.d.ts" />
import {createServer, Server} from 'https';
import * as express from 'express';
import * as ioSocket from 'socket.io';
import cnf from '../config/connect.cnf';
import {AppController} from '../controllers/appController'


export class Socket{

  // private app:express.Application;

  private io:ioSocket.Server;

  private server:Server;

  // private app: express.Application;

  private port: string | number;

  /**
   * Construtor instantiates WS and sets listeners
   * @param {shopApp} app
   */
  constructor(appController:AppController){
    console.log('Starting io socket');
    // console.log(shopApp.get());

    // this.app = (shopApp.get());

    // this.server = shopApp.getHttpsServer();
    this.server = createServer(cnf.ssl);
    this.port = cnf.ioPort;

    this.io = ioSocket(this.server, cnf.ioOptions);

    this.server.listen(this.port,() =>{
      console.log(`ioSocket starting on: ${this.port}`);
      appController.startIO();
    });

    return this;
  }

  public namedBoadcast = (ns:string, evt:string, data:any) => {
    let named = this.io.of(ns);
    named.emit(evt,data);
  }

  public namedRoomcast = (ns:string, rm:string, evt:string, data:any) => {
    let named = this.io.of(ns);
    named.to(rm).emit(evt,data);
  }

  public tap = (evt:string, result:ioConnect):void => {
    console.log(evt);
    this.io.on('connect', (socket: any )=>{
      console.log(evt);
      socket.on(evt, (m: message)=>{
        console.log(m);
        return result( socket, m);
      });
    });
  }

}
