import Register from 'clients/lib/com/register'
import SocketClient from 'clients/lib/com/socketclient'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import Store from 'clients/shop/data/store'
import Config from 'clients/lib/com/Coms.config'

SocketClient.setServer(`https://localhost:${Config.ports.iosocket}`),
Register.check(SocketClient.setup,'shop_sw.js');

ReactDOM.render(
  <App
    store={Store.getStore()}
  />,
  document.getElementById('root')
);
