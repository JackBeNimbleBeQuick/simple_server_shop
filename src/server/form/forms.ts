import App from '../app';
import * as express from 'express';
import CMSModel from 'model/cmsModel';

export class Forms{

  //@NOTE will start with Formage and work out from there
  private formate:any;

  construtor(){
  }

  public loginForm = () => {
    // return Formage.init(App.get(), express, CMSModel.login );
  }

}
