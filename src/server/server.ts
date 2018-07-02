import App from './app';
import * as https from 'https';
import * as http from 'http';
import cnf from './config/connect.cnf';

//@NOTE just to prove it can be done for now
let httpApp = https.createServer(cnf.ssl, App.init()).listen(cnf.sslPort, () => {
  console.log(`Express server listing port: ${cnf.sslPort}`)
});

//@NOTE expedient for view dev
let httpsApp = http.createServer(App.init()).listen(cnf.port, () => {
  console.log(`Express server listing port: ${cnf.port}`)
});
App.setServers(httpApp,httpsApp);
