
import * as fs from 'fs';

export default {
  session:{
    adapter: 'connect-mongo',
    collection: 'session',
    url: 'mongodb://127.0.0.1:27017/simpleStore',
    // username: 'admints',
    // password: 'eafb0424376b45769ccc4ffeacbd8f48',
  },
  ssl:{
    key: fs.readFileSync(__dirname + '/key.pem'),
    cert: fs.readFileSync(__dirname + '/cert.pem'),
    passphrase: 'goodword'
  },
  ioOptions:{ //ioOptions refer to server.interface.d
    serveClient: true,
    pingInterval: 5000,
    pingTimeout: 2500,
    cookie: true
  },
  port: 8095,
  sslPort: 4040,
  wsPort: 40510,
  ioPort: 4050,
  duration: 24, //hours
  mongoUrl: 'mongodb://127.0.0.1:27017/simpleStore',
  key: 'bf6987742b9c56b947f9c02baa6930dc',
}
