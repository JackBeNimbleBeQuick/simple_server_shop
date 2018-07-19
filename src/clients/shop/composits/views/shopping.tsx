///<reference path="../../../lib/interfaces/shop.interface.d.ts" />

import * as React from 'react';
import Tracker from 'clients/shop/data/tracker';
import DomUtils from 'clients/lib/util/dom';
import Store from 'clients/shop/data/store';
import Types from 'clients/shop/data/types';
import Session from 'clients/lib/com/session';
import Comservices from 'clients/lib/com/Comservices';
import Actions from 'clients/shop/data/actions';

import ShopperFrame from 'clients/shop/composits/parts/shopperframe';

export default class Shopping extends React.Component<any, any>{

  constructor(props:any){
    super(props);
    console.log(props);
    this.state = {
      setList: this.setList.bind(this),
      list:this.props.shoppingProps ? this.props.shoppingProps.groups: {},
      didLoad: false,
      storeEvents: {}
    }
  }

  /**
   * By using listener on store, this component becomes stateful
   */
  componentDidMount () {

    console.log('shopping did mount');

    Store.subscribe(this.setList);

    console.log('shopping get data call made');

    Comservices.action({
      type: 'GET',
      action: Actions.getData,
      uri: 'shop/new/all-new',
    });
  }

  setList = (data:any) => {
    console.log('shopping setList');
    console.log(data);
    if(data.shopping && data.shopping.all){

      Tracker.buildProductList(data.shopping.all);

      this.setState({
        didLoad: true,
        list: data.shopping.all
      });

    }
  }

  componentWillUnmount () {
    Store.unsubscribe(this.setList);
  }

  select = (e:any) => {
    e.preventDefault();
    alert('dropping in cart 8^)');
  }

  view= (e:any) => {
    e.preventDefault();
    alert('viewing now 8^)');
  }

  /**
   * Locks window scrolling, records selection, dispatches action
   * @param  {product} product
   * @return {void}
   */
  expand = (product:product):void => {
    console.log(product);
    DomUtils.lockScroll();
    Tracker.viewedItem(product);
    Store.dispatchAction(Actions.setViewed, product);
  }

  /**
   * Render loop for ShopperFrames Listings
   * @NOTE ? move to its own component ?
   * @return {ReactElement}
   */
  renderList = ():ReactElement | string =>{
    let list = '';
    // console.log(this.state);
    if(this.state.list && this.state.didLoad){
      list = this.state.list.groups.map((product:product,i:any)=>{
        return(
          <ShopperFrame
            key= {i}
            product = {product}
            expander = {this.expand}
          />
        )
      });
    }
    return list;
  }

  render(){
    return(
      <div className="shopping">
        {this.renderList()}
      </div>
    );
  }
}

// export default Shopping;
