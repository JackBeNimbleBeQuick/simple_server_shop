import App from '../app';
import * as express from 'express';
import Formage from 'formage';
import CMSModel from 'model/cmsModel';

export class Forms{

  //@NOTE will start with Formage and work out from there
  private formate:Formage;

  construtor(){

  }

  public loginForm = () => {
    return Formage.init(App.get(), express, CMSModel.login );
  }

}
