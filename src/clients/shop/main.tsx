import Register from 'clients/lib/com/register'
import SocketClient from 'clients/lib/com/socketclient'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

Register.check(SocketClient.connect,'shop_sw.js');

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
