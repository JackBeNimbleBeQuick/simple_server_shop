
import Actions from 'clients/shop/data/actions';
import Types from 'clients/shop/data/types';
import {combineReducers} from 'redux';

let init = {
  didLoad: false,
  shoppingProps:{
    categories:[],
    groups: [],
    id: 'Waiting',
    name: 'Updating results',
    totalPages: 0,
  },
}
export default combineReducers ({
  shopping:(state=init, action:any)=>{
    switch(action.type){
      case 'RESET_TRACKING':
        return init;

      case 'GET_DATA':
        console.log('GET_DATA')
        console.log(action);
        return {
          all: action.payload.data
        }

      case 'SESSION_TRACKING':
        return {
          tracked: action.payload.data
        }

      case 'LAST_VIEWED':
        console.log('LAST_VIEWED')
        console.log(action);
        return{
          viewing: action.payload.data
        }

      case 'ADD_TO_CART':
        return action;
      default:
       return state;
    }
  },
});