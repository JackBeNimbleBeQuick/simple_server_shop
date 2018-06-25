import App from './app';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';

//Secure Socket Layer port
let ssl_PORT = '4040';
//None Secure port
let ns_PORT = '8095';

//@NOTE acting main instantiation method

//@TODO provide runtime env handlers here

let options = {
  key: fs.readFileSync(__dirname + '/config/key.pem'),
  cert: fs.readFileSync(__dirname + '/config/cert.pem'),
  passphrase: 'goodword'
}

//@NOTE just to prove it can be done for now
https.createServer(options, App.init()).listen(ssl_PORT, () => {
  console.log(`Express server listing port: ${ssl_PORT}`)
});

//@NOTE expedient for view dev
http.createServer(App.init()).listen(ns_PORT, () => {
  console.log(`Express server listing port: ${ns_PORT}`)
});
