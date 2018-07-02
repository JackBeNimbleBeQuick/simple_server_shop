var socket = io.connect('http://localhost:9010');
console.log('connecting to server');
socket.emit('client', { type:'handshake', data: 'handshake' });
socket.on('server', function (data) {
  var d_ = JSON.parse(data);
  console.log(d_);
  switch(d_.type){
    case 'news':
      socket.emit('client', { type:'clientState', data: 'news received' });
    break;
    default:
  }
});
