///<reference path="../../../lib/interfaces/shop.interface.d.ts" />

import * as React from 'react';
import Tracker from 'clients/shop/data/tracker';
import Loading from 'clients/lib/component/loading';
import DomUtils from 'clients/lib/util/dom';
import Store from 'clients/shop/data/store';
import Session from 'clients/lib/com/session';
import Actions from 'clients/shop/data/actions';

import ShopperFrame from 'clients/shop/composits/parts/shopperframe';

export default class Shopping extends React.Component<any, any>{

  // defaultProps = {
  //   didLoad: false,
  //   list: {}
  // }

  constructor(props:any){
    super(props);
    console.log('Shopping constructor');
    console.log(props);
    this.state = {
      list: {},
      didLoad: false,
    }
  }

  componentWillUnmount () {
    // Store.unsubscribe(this.setList);
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
    // console.log(product);
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
    if(this.props.list.length && this.props.didLoad===true){
      list = this.props.list.map((product:product,i:any)=>{
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
    console.log(this.props);

    if(this.props.didLoad){
      return(
        <div className="shopping">
          {this.renderList()}
        </div>
      );
    }else{
      return (
        <Loading />
      );
    }
  }
}





// export default Shopping;
