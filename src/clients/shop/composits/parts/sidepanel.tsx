
///<reference path="../../../lib/interfaces/shop.interface.d.ts" />

import * as React from 'react';
import {connect} from 'react-redux';
import ShopperFrame from 'clients/shop/composits/parts/shopperframe';
import Image from 'clients/lib/component/image';
import Login from 'clients/shop/composits/parts/login';
import Store from 'clients/shop/data/store';
import Actions from 'clients/shop/data/actions';
import Types from 'clients/shop/data/types';
import Tracker from 'clients/shop/data/tracker';
import Session from 'clients/lib/com/Session';

export class SidePanel extends React.Component<any,any>{

  static defaultProps = {
    label: 'sidebar',
    history: {},
    history_name: 'history:',
    last_seen: null,
  }

  submit = (e:any) =>{
    console.log(e);
  }

  constructor(props:any){
    super(props);
    this.state = {
      history: this.props.history,
      last_seen: this.props.last_seen,
      opened:false,
    }
  }

  /**
   * By using listener on store, this component becomes stateful
   * @return {void} there is async method to setState
   */
  componentDidMount(){
    console.log('SidePanel did mount with history:');
    console.log('SidePanel getting initial state');

    window.addEventListener('resize', (e) => {
      this.setState({aspect: window.outerWidth/window.outerHeight});
    });
  }

  componentWillUnmount(){
    // Store.releaseStoreChange('sp_lister');
    // Store.releaseStoreChange('sp_last_viewed');
  }

  componentWillReceiveProps(data:any){
    this.setState(data);
  }

  /**
   * Open state of tab / panel
   * @param  {any} e really not used in this context
   * @return {void}
   * results in toggling the open state of panel
   */
  open = (e:any) => {
    console.log(e);
    this.setState({
      opened: this.state.opened ? false : true
    });
  }

  /** Stubs for future functionality START**/
  search = (e:any) => {
    e.preventDefault();
    console.log(e);
  }

  selectLast = (e:any) => {
    console.log(e);
  }

  selectFromHistory = (e:any) => {
    console.log(e);
  }

  selectFromShoping = (e:any) => {
    console.log(e);
  }
  /** Stubs for future functionality END**/

  clearHistory = (e:any) => {
    Session.clearTracking();
    this.setState({
      history: {},
    });
  }

  renderHistory = () => {
    // console.log(this.state.history);
    let prodKeys = this.state.history ? Object.keys(this.state.history) : [];
    console.log(prodKeys);
    if(prodKeys.length){
      let history = prodKeys.map((index, i)=>{

        //@TODO create Actions.findProduct with FIND_PRODUCT type and move to Store/Reduce
        let prod = Tracker.findProduct(index);
        if(prod)
          return (
            <ul className="row product" key={i}>
              <li className="image">
                <Image
                  handler = {this.selectFromHistory}
                  alt = {prod.name}
                  image = {prod.thumbnail}
                />
              </li>
              <li className="text">
                {prod.name}
              </li>
            </ul>
          );

      });
      return (
        <div className="history">
          <button className="button left" onClick={e=>this.clearHistory(e)} >
            clear
          </button>
          <h4> {this.props.history_name}</h4>
          <div className="list">
            {history}
          </div>
        </div>
      );
    }
    return null;
  }

  renderLastSeen = () => {

    if(this.state.last_seen){
      return(
        <div className="last-seen">
          <ShopperFrame
            heading= "last seen:"
            expander={(e:any) => this.selectLast(e)}
            product= {this.state.last_seen}
          />
        </div>
      );
    }
    return null;
  }

  render(){
    let tab = ['sidepanel', this.state.opened ? 'open' :null]

    return(
      <div className={tab.join(" ")}>
        <span className="tab" onClick={e => this.open(e)}>
          {this.props.label}
        </span>
        <div className="view">
          <div className="heading">
            <form onSubmit={e=>{this.search(e)}}>
              <label className="search">
                <input type="text" name="search" placeholder="find stuff"/>
              </label>
              <input type="submit" value="find"/>
            </form>
          </div>
            {this.renderLastSeen()}
            {this.renderHistory()}
        </div>
        <Login />
      </div>
    );
  }
}

let mapper = (state:any) => {
  let shopping = state.shopping && state.shopping.viewing
    ? {
        last_seen: state.shopping.viewing,
        history: Tracker.getByKey(Types.SESSION_TRACKING)
      }
    : {};

  return shopping;
}


export default connect(mapper,{})(SidePanel);
