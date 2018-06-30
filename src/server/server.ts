import App from './app';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import cnf from './config/connect.cnf';

//Secure Socket Layer port
let ssl_PORT = cnf.sslPort;
//None Secure port
let ns_PORT = cnf.port;

//@NOTE acting main instantiation method

//@TODO provide runtime env handlers here

let options = {
  key: fs.readFileSync(__dirname + '/config/key.pem'),
  cert: fs.readFileSync(__dirname + '/config/cert.pem'),
  passphrase: 'goodword'
}

//@NOTE just to prove it can be done for now
let httpApp = https.createServer(options, App.init()).listen(ssl_PORT, () => {
  console.log(`Express server listing port: ${ssl_PORT}`)
});

//@NOTE expedient for view dev
let httpsApp = http.createServer(App.init()).listen(ns_PORT, () => {
  console.log(`Express server listing port: ${ns_PORT}`)
});

App.setServers(httpApp,httpsApp);
