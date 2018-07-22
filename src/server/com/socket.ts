///<reference path="../server.interface.d.ts" />
import {createServer as SSL} from 'https';
import {createServer as SVR} from 'http';
// import * as express from 'express';
import * as ioSocket from 'socket.io';
import cnf from '../config/connect.cnf';
import {AppController} from '../controllers/appController'


export class Socket{

  private io_ssl:ioSocket.Server;

  private io_ls:ioSocket.Server;

  /**
   * Construtor instantiates WS and sets listeners
   * @param {shopApp} app
   */
  constructor(appController:AppController){
    console.log('Starting io socket');

    let _ssl_server = SSL(cnf.ssl);
    this.io_ssl = ioSocket(_ssl_server, cnf.ioOptions);

    _ssl_server.listen(cnf.io_sslPort,() =>{
      console.log(`ssl ioSocket starting on: ${cnf.io_sslPort}`);
      appController.startIO();
    });

    let _ls_server = SVR();
    this.io_ls = ioSocket(_ls_server, cnf.ioOptions);

    _ls_server.listen(cnf.io_Port,() =>{
      console.log(`nss ioSocket starting on: ${cnf.io_Port}`);
      appController.startIO();
    });

    return this;
  }

  public namedBoadcast = (ns:string, evt:string, data:any) => {
    let named = this.io_ssl.of(ns);
    named.emit(evt,data);
  }

  public namedRoomcast = (ns:string, rm:string, evt:string, data:any) => {
    let named = this.io_ssl.of(ns);
    named.to(rm).emit(evt,data);
  }

  public tap = (evt:string, result:ioConnect):void => {
    this.io_ssl.on('connect', (socket: any )=>{
      // console.log(`receiving ${evt}`);
      socket.on(evt, (m: message)=>{
        // console.log(m);
        return result( socket, m);
      });
    });
  }

}
