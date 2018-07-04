import * as io from '../../vendor/socket.io';

/**
 * Socket Class provides the connection layer to Server
 * @TODO provide ajax as fallback com layer
 */
export class SocketClient{
  private socket;

  constructor(){
  }

  public connect = (options?:any) => {
    this.optionsSetup(options);
    console.log('service worker')
    console.log(options);

    //start client connection
    this.socket = io.connect('https://localhost:4050');

    this.socket.on('connect', (data)=>{
      console.log('Connect with Server');
      this.socket.emit('client', { type:'get_updates', data: 'version (?)' });
    });

    this.socket.on('updates', function (data) {
      console.log('receiving updates');
      let d_ = JSON.parse(data);
      console.log(data);
    });
  }

  /**
   * Socket options processing
   . could provide connection options such as:
    .. waitTime, fallback connections and other settings
   . could perform tests such as network availabliity and connect methods available
   * @return {void}
   */
  private optionsSetup = (options?:any):void => {

  }

}
export default new SocketClient();
