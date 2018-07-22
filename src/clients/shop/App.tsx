///<reference path="../lib/interfaces/shop.interface.d.ts" />

import * as React from 'react';
import Comservices from 'clients/lib/com/Comservices';
import Shopping from 'clients/shop/composits/views/shopping'
import DisplayBox from 'clients/shop/composits/parts/displaybox'
import Store from 'clients/shop/data/store'
import Types from 'clients/shop/data/types'
import Tracker from 'clients/shop/data/tracker'
import SidePanel from 'clients/shop/composits/parts/sidepanel';
import Actions from 'clients/shop/data/actions'
import {connect, Provider} from 'react-redux';

/**
 * Redux container consumes React Component and provides basic linkage to
 * the Action -> Dispatch -> ReduceStore cycle
 * @type {React.Component}
 */
// export let AppContainer = new Container.create(
class App extends React.Component<any, any>{


  constructor(props:any){
    super(props);
    this.state={
      store: Store.getStore(),
      didLoad: false,
      list: {}
    }
  }

  /**
   * By using listener on store, this component becomes stateful
   */
  componentDidMount () {

    console.log('shopping did mount');

    console.log('shopping get data call made');
    Comservices.action({
      type: 'GET',
      action: Actions.getData,
      uri: 'shop/new/all-new',
    });
  }

  componentWillReceiveProps (next:any){
    console.log('componentWillReceiveProps');
    console.log(next);
    if(next.list && next.list.groups){
      Tracker.buildProductList(next.list);
      this.setState({
        didLoad: true,
        list: next.list
      });
    }
  }

  /**
   * @return {DOMElement} composition
   * each will set listener for store changes in
   * componentDidMount : @NOTE I am still looking for something more elegant for this
   */
  render () {

    return (
        <Provider store={this.state.store}>
          <div className="page">
            <Shopping
              didLoad={this.state.didLoad}
              list={this.state.list}
            />
            <SidePanel
              history={Tracker.getByKey(Types.SESSION_TRACKING)}
              last_seen={Tracker.getLastProduct()}
            />
            <DisplayBox/>
          </div>
        </Provider>
    );

  }
}

let mapStateToProps = (data:any) => {
  let list = data.shopping && data.shopping.all
    ? data.shopping.all : {};
  return {list: list};
}

export default connect(mapStateToProps,{})(App);
// export default new AppContainer({});
