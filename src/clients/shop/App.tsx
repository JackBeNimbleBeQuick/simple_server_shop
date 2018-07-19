///<reference path="../lib/interfaces/shop.interface.d.ts" />

import * as React from 'react';
import {Provider} from 'react-redux';
import Shopping from 'clients/shop/composits/views/shopping'
import DisplayBox from 'clients/shop/composits/parts/displaybox'
import Store from 'clients/shop/data/store'
import Types from 'clients/shop/data/types'
import Tracker from 'clients/shop/data/tracker'
import SidePanel from 'clients/shop/composits/parts/sidepanel';

/**
 * Redux container consumes React Component and provides basic linkage to
 * the Action -> Dispatch -> ReduceStore cycle
 * @type {React.Component}
 */
// export let AppContainer = new Container.create(
export default class App extends React.Component<any, any>{


  constructor(props:any){
    super(props)
  }

  /**
   * @return {DOMElement} composition
   * each will set listener for store changes in
   * componentDidMount : @NOTE I am still looking for something more elegant for this
   */
  render () {

    return (
        <Provider store={Store.getStore()}>
          <div className="page">
            <Shopping/>
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

// export default new AppContainer({});
