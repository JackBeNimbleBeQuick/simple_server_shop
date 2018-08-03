import App from './app';
import * as https from 'https';
import * as http from 'http';
import cnf from './config/connect.cnf';

//@NOTE just to prove it can be done for now
App.httpsServer = https.createServer(cnf.ssl, App.init()).listen(cnf.sslPort, () => {
  console.log(`Express server listing port: ${cnf.sslPort}`)
  App.buildRoutes();
});
// App.httpsServer = http.createServer( App.init()).listen(cnf.sslPort, () => {
//   console.log(`Express server listing port: ${cnf.sslPort}`)
//   App.buildRoutes();
// });
