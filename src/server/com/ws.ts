import * as express from 'express';
import * as WebSockets from 'ws';
import cnf from '../config/connect.cnf';


export class WS{

  private app:shopApp;

  private ws:WebSockets;

  /**
   * Construtor instantiates WS and sets listeners
   * @param {shopApp} app
   */
  constructor(app:shopApp){
    this.app = app;
    this.run();
  }

  private run = () => {
    this.ws = new WebSockets.Server({port: cnf.wsPort});
    this.ws.on('connection', (ws)=>{

      console.info("websocket connection open");

      let timestamp = new Date().getTime();

      ws.send(JSON.stringify({
        msgType: 'onOpenConnection',
        msg: timestamp,
      }));

      ws.on('message', (message, flags)=>{});

      ws.on('close', ()=>{
        timestamp = new Date().getTime();
        console.log(`Closing web socket @ ${timestamp} `);
      });

    });

  }
}
