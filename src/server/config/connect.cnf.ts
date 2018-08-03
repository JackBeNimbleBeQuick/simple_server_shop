
import * as fs from 'fs';
import * as path from 'path';

export default {
  session:{
    adapter: 'connect-mongo',
    // collection: 'session',
    url: 'mongodb://127.0.0.1:27017/simpleStore',
    options: {
      autoIndex: false,
      useNewUrlParser: true
    },
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
  sslPort: 6040,
  io_Port: 4051,
  io_sslPort: 6050,
  hours: 1,
  hour: 60*60*1000,
  duration: 0.1, //hours
  mongoUrl: 'mongodb://127.0.0.1:27017/simpleStore',
  key: 'bf6987742b9c56b947f9c02baa6930dc',
  paths:{
    shop_image_path: '/public/imgs/products/',
    product_image: path.resolve(`${__dirname}/../public/imgs/products/`)
  },
  cache: {
    shop:{
      client: './clients/shop_sw.js',
      server: './server/clients/shop_sw.js',
      products:[
        '/',
        '/shop',
        '/shop/app.js',
        '/shop/css/main.css',
        '/public/css/main.css',
        '/public/favicon.ico'
      ],
    }
  }
}
