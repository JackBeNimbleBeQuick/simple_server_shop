
import {readFileSync} from 'fs';
import * as path from 'path';
import site from './private.cnf';

//dump objec to support context usage
let account = {
  user: '',
  pass: ''
}

export default {
  locale: {
    lang: 'en',
    region: 'us',
  },
  mode: 'dev',
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
  mail:{
    returns:{
      mailer_name: site ? site.mail.returns.mailer_name : 'PROVIDE_RETURN_ADDRESS',
      mailer: site ? site.mail.returns.mailer : 'PROVIDE_RETURN_ADDRESS',
    },
    options:{
      host: site && site.mail ? site.mail.options.host : '',
      port: 587,
      secure: false,

      ignoreTLS: true,
      logger: true,
      debug: true,
      authMethod: 'PLAIN'

    },
    auth: {
      user: site && site.mail ? site.mail.auth.user : account.user,
      pass: site && site.mail ? site.mail.auth.pass : account.pass,
    },
    /* using npm smtp-connection
    envelope.from is the sender address
    envelope.to is the recipient address or an array of addresses
    envelope.size is an optional value of the predicted size of the message in bytes. This value is used if the server supports the SIZE extension (RFC1870)
    envelope.use8BitMime if true then inform the server that this message might contain bytes outside 7bit ascii range
    envelope.dsn is the dsn options
    envelope.dsn.ret return either the full message ‘FULL’ or only headers ‘HDRS’
    envelope.dsn.envid sender’s ‘envelope identifier’ for tracking
    envelope.dsn.notify when to send a DSN. Multiple options are OK - array or comma delimited. NEVER must appear by itself. Available options: ‘NEVER’, ‘SUCCESS’, ‘FAILURE’, ‘DELAY’
    envelope.dsn.orcpt original recipient
     */
    envelope:{
      to: '',
      from: '',
      size: null,
      use8BitMime: false,
    }
  },
  ssl:{
    key: readFileSync(__dirname + '/key.pem'),
    cert: readFileSync(__dirname + '/cert.pem'),
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
  devUrl: 'https://localhost',
  prodUrl: 'https://localhost',
  mongoUrl: 'mongodb://127.0.0.1:27017/simpleStore',
  key: site && site.key ? site.key : 'PROVIDE_KEY',
  salt: site && site.salt ? site.salt: 'PROVIDE_SALT',
  paths:{
    shop_image_path: '/public/imgs/products/',
    product_image: path.resolve(`${__dirname}/../public/imgs/products/`)
  },
  tests: {
    mongoUrl: 'mongodb://127.0.0.1:27017/testStore',
    mongoOptions: {
      autoIndex: false,
      useNewUrlParser: true
    }
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
