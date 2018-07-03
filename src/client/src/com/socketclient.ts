import * as io from '../../vendor/socket.io';

export class SocketClient{
  private socket;

  constructor(){
  }

  public connect = () => {
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

}
// export default new SocketClient();
