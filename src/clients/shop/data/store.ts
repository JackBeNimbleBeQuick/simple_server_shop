

///<reference path="../../lib/interfaces/shop.interface.d.ts" />
///<reference path="../../lib/interfaces/react.interface.d.ts" />
import { createStore, applyMiddleware, bindActionCreators } from 'redux';

import Comservices from 'clients/lib/com/Comservices';
import Reducer from 'clients/shop/data/reduce';
import Types from 'clients/shop/data/types';
import Actions from 'clients/shop/data/actions';


export class Store{
  private store: any;

  constructor(){
    this.store = createStore(Reducer);
  }

  public getState = () => {
    return this.store.getState();
  }

  public getStore = () => {
    return this.store;
  }

  //@TODO mapping of states and props is still needed
  public subscribe = (func:Function) => {
    console.log('subscribe');
    console.log(this.getState());
    this.store.subscribe(()=>{
      console.log('subscribe called');
      return func(this.getState())
    });
  }

  //@TODO mapping of states and props is still needed
  public unsubscribe = (func:Function) => {
    console.log('unsubscribe');
    console.log(this.store.getState());
    this.store.unsubscribe(func);
  }

  public setVisibility = (type:string) => {
    let state:any = this.getState();
    switch(type){
      case Types.ADD_TO_CART :
      return ;
      case Types.CURRENT_ITEM:
      return ;
    }
  }

  public dispatchAction = (action:Function, state:any):void => {
    this.store.dispatch(action(state));
  }

  public dispatch = (action:any):void => {
    console.log('dispatch');
    console.log(action);
    this.store.dispatch(action);
  }

  /**
   * Products can be referennced by their key
   * @param  /[a-z]{1}d{4}/gi
   * @return  {string|null}
   * attempts to return a product key from product.id
   */
  public productKey = (prod:product):string | null => {
    let matches = prod.id.match(/[a-z]{1}\d{4}/gi);
    if(matches && matches[0]) return matches[0];
    return null;
  }

  /**
   * Provide current state by type if that type exists or
   * return the whole state object
   * @return {Store.reduce.state}
   */
  public getByIndex = (type:string) => {
    let state = this.getState();
    return  state[type] && state[type].data ?  state[type].data : {};
  }

}

export default new Store();
