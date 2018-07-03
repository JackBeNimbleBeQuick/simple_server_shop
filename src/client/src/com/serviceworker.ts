
import {SocketClient} from './socketclient';
import * as path from 'path';
export class ServiceWorker{

  constructor(){
    //test io socket
    new SocketClient();
  }

  register = () => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('client/src/com/serviceworker.js')
          .then(function(registration) {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
  }

}
export default new ServiceWorker();
