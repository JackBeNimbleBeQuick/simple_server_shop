import Register from '../src/com/register'
import SocketClient from '../src/com/socketclient'

Register.check(SocketClient.connect,'public/js/shop/sw.js');
