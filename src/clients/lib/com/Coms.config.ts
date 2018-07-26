/// <reference path="../../lib/interfaces/com.interface.d.ts"/>

let env = document && document.location.hostname =='localhost' ? 'dev': 'prod';

let ports = {
  dev:{
    server: 6040,
    iosocket: 6050,
  },
  prod:{
    server: 6040,
    iosocket: 6050,
  },
}

export default {
  env: env,
  ports:{
    server: env==='dev' ? ports.dev.server : ports.prod.server,
    iosocket: env==='dev' ? ports.dev.iosocket : ports.prod.iosocket,
  },
  services:{
    url: env==='dev' ? `https://localhost:${ports.dev.server}/` : `https://sockets.daisyranch.org:${ports.prod.server}/`,
    login: 'login',
    login_success: {"status":"ok"},
    uri: 'shop/data',
  }

}
