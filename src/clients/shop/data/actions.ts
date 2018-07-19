
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

}
export default new Actions();
