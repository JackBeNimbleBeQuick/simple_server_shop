
///<reference path="../../lib/interfaces/shop.interface.d.ts" />
///<reference path="../../lib/interfaces/react.interface.d.ts" />

import Types from 'clients/shop/data/types';
import {action} from 'typesafe-actions';

//@TODO definitely type the data and return values as step towards
//@TODO validators
export class Actions implements Actions {

  sessionTracking = (data:any):any =>{
    return action(Types.SESSION_TRACKING,{
      type: Types.SESSION_TRACKING,
      data,
    });
  }

  login = (data:any):any => {
    return  action(Types.LOGIN,{
      type: Types.LOGIN,
      data,
    });
  }

  getData = (data:any):any =>{
    return  action(Types.GET_DATA,{
      type: Types.GET_DATA,
      data,
    });
  }

  setViewed = (data:any):any =>{
    return action(Types.LAST_VIEWED,{
      type: Types.LAST_VIEWED,
      data,
    });
  }

  addToCart = (data:any):any =>{
    return action(Types.ADD_TO_CART,{
      type: Types.ADD_TO_CART,
      data,
    });
  }

  resetTracking = (data:any):any => {
    return action(Types.RESET_TRACKING,{
      type: Types.RESET_TRACKING,
      data,
    });
  }

  responseError = (data:any):any => {
    console.log('actions response errro fired');
    console.log(data);
    return action(Types.ERROR_RESPONSE,{
      type: Types.ERROR_RESPONSE,
      data,
    });

  }

}
export default new Actions();
