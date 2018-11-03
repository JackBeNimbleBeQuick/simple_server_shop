///<reference path="../interface/index.d.ts" />
import {Comservices} from 'clients/lib/com/Comservices';
import Dom from 'clients/public/lib/actions/dom';

/**
 * Class to act as agregator of Subjects and Observers
 * does not try to assert directionality in data flows
 * as in this libs context the only valid data originates from live server
 * connections
 * @return [description]
 */
export class Subject implements subject{

  private observers: observers;

  protected state:any;

  protected changed = false;

  protected connector:Comservices;

  protected filter = /\b(state|filter|selector)\b/;

  constructor(options:shellOptions){
    this.state = {}
    this.observers = {};
    this.connector = new Comservices();

    for(let o in options){
      if(this.filter.test(o)) this[o] = options[o];
    }
  }

  public connect = {
    post: (posting: postage, success?: Function, failure?: Function) => {
      let respond = success ? success : () =>{}
      this.connector.post(posting, respond, failure ? failure : Dom.attachErrors)
    },
    get: (url: string, success?: Function, failure?: Function) => {
      let respond = success ? success : () =>{}
      this.connector.get(url, respond, failure ? failure : Dom.attachErrors)
    },
  }

  public getState = () => {
    return this.state;
  }

  //set only states claimed by instance of Handlers
  public setState = (state:Object) => {
    let keys =  Object.keys(state);
    if(keys.length == 0 ) return;

    //consumes each state
    if(keys.length){
      //pull first
      let key = keys[0];
      console.log(`key: ${key}`)
      console.log(this.state[key])
      //delete from Object
      if(this.state[key]){
        console.log(`Setting ${key}`);
        this.state  = state[key];
        this.changed = true;
      }
      console.log(`Has there been change: ${this.changed}`);
      console.log(this.state);

      delete state[key];
      this.setState(state);
    }
    this.update();
  }

  public attach = (observer:observer) =>{
    this.observers[observer.getName()] = observer;
  }

  public detach =(observer:observer) =>{
    delete this.observers[observer.getName()];
  }

  //notify other subjects
  public notify =(state:any) =>{
  }

  //update observers
  public update =() =>{
    if(this.changed){
      for(let o in this.observers){
        this.observers[o].update(this, this.state);
      }
    }
  }


}
