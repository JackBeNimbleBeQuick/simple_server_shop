
///<reference path="../interface/class.d.ts" />

import Observer from 'clients/public/lib/observer'
import Subject from 'clients/public/lib/subject'

/**
 * Class to act as agregator of Subjects and Observers
 * does not try to assert directionality in data flows
 * as in this libs context the only valid data originates from live server
 * connections
 * @return [description]
 */
export class Action{

  private observers: observers;
  private subjects: subjects;

  constructor(){
    this.observers = {};
    this.subjects= {};
  }

  public attach = (subject:any) =>{
  }

  public detach =(subject:any) =>{
  }

  //notify other subjects
  public notify =(state:any) =>{
  }

  //update observers
  public update =(state:any) =>{
  }


}

export default new Action();
