/// <reference path="../../lib/interfaces/com.interface.d.ts"/>

export class Config {

  public static getServices = ():services => {

    let s_port = 8092;
    let c_port = 8091;
    let d_port = 3050;

    let prodService:service = {
      base: `https://loginservice.com:${d_port}/`,
      login: 'login',
      login_success: {"status":"ok"},
      uri: 'shop/new/all-new',
    }

    let devService:service =  {
      base: `http://localhost:${s_port}/`,
      login: 'login',
      login_success: {"status":"ok"},
      uri: 'shop/new/all-new',
    };

    let env:string = 'prod';

    if(document && document.location){
      let host = document.location.host;
      if(/(localhost)/.test(host)){
        env= 'dev';
      }
    }

    let state:services = {
      server_port: env == 'prod' ? d_port : c_port,
      env: env,
      params: env === 'prod' ? prodService : devService
    }

    return state;
  }
}

export default Config;
