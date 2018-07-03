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
    this.socket = io.connect('http://localhost:4040');
    this.socket.on('server', function (data) {
      let d_ = JSON.parse(data);
      console.log(d_);
      switch(d_.type){
        case 'news':
          this.socket.emit('client', { type:'clientState', data: 'news received' });
        break;
        default:
      }
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
