import * as io from 'clients/vendor/socket.io';
import Config from 'clients/lib/com/Coms.config';

/**
 * Socket Class provides the connection layer to Server
 */
export class SocketClient{

  private sock:string ='';

  private connected = false;

  private socket:any;

  private server = `https://localhost:${Config.ports.iosocket}`;

  private connectOptions: any;

  constructor(){
    this.wireTap();
  }

  public setServer = (url: string) => {
    this.server = url;
  }

  public setup = (options?:any) => {
    this.connectOptions = options;
    this.connect();
  }

  private connect = () => {
    this.connected = navigator && navigator.onLine==true;
    this.optionsSetup(this.connectOptions);

    //avoid mutliple listeners on same socket
    if(this.connected){
      console.log('Connecting');
      try{
        this.socket = io.connect(this.server,{forceNew: true});
      }catch(e){}
      this.sock = this.socket.id;
      this.listen();
    }
  }

  public post = (success:Function, error:Function) => {

  }

  private listen = () => {
    this.socket.on('connect', (data:any)=>{
      console.log('connect received');
      this.sock = this.socket.id
      console.log(this.socket.id);
      console.log(this.socket);
      this.getUpdates();
    });

    this.socket.on('disconnect', (data:any) => {
      console.log('socket is getting disconnect');
      this.disconnect();
    });

    this.socket.on('updates', (data:any) => {
      this.runUpdates(data);
    });

    this.socket.on('error', (data:any) => {
      console.log('error: disconnection');
      this.disconnect();
    });

    this.socket.on('connect_error', (data:any) => {
      console.log('connection error: disconnection');
      this.disconnect();
    });

  }

  private disconnect = () => {
    console.log('disconnect received');
    if(this.socket){
      this.socket.disconnect();
    }
  }

  private wireTap = () => {
    (window as any).addEventListener('online', this.connect);
    (window as any).addEventListener('offline', this.disconnect);
    (window as any).addEventListener('error', this.disconnect);
  }

  /**
   * A placeholder for what is to come for what may be a whole tasking process
   * @param  'ConnectwithServer'
   * @return
   */
  private getUpdates = () => {
    console.log('Get updates from server');
    this.socket.emit('client', { type:'get_updates', data: 'version (?)' });
  }

  private runUpdates = (data:any) => {
      console.log('receiving updates');
      let d_ = JSON.parse(data);
      console.log(data);
  }

  /**
   * Socket options processing
   . could provide connection options such as:
    .. waitTime, fallback connections and other settings
   * @return {void}
   */
  private optionsSetup = (options?:any):void => {

  }

}
export default new SocketClient();
