///<reference path="../../lib/interfaces/shop.interface.d.ts" />
///<reference path="../../lib/interfaces/com.interface.d.ts" />
import Session from 'clients/lib/com/Session';
import Store from 'clients/shop/data/store';
import Types from 'clients/shop/data/types';
import Actions from 'clients/shop/data/actions';

export class Tracker{

  private hasProducts=false;

  constructor(){
    // this.store   = new Store();
  }

  public viewedItem = (visited:product) => {
    console.log('Viewed:');
    console.log(visited);
    this.add(Types.SESSION_TRACKING, visited);
  }

  public addToCart = (selected:product) => {
    console.log('Viewed:');
    console.log(selected);
    this.add('cart', selected);
  }

  /**
   * Builds productList
   * called as part of store.reduce when service was called
   * @param {null}
   * @return {void}
   * @TODO Create Actions.products wthif PRODUCTS type and move this into Reduce/Store
   */
  public buildProductList = ( list: shoppingProps):void => {

    let prodArray = list.groups ? list.groups : null;
    if(prodArray){
      let products:any = {};
      prodArray.map( (prod:any, i:any)=>{
        let key = Store.productKey(prod);
        if(key && prod) products[key] = prod;
      });
      Session.store(Types.PRODUCTS, products);
      this.hasProducts = true;
    }
  }

  public getLastProduct = () => {
    let last = this.getByKey(Types.LAST_VIEWED);
    console.log(last);

    return last && last.product_id
      ? this.findProduct(last.product_id)
      : null;

  }

  /**
   * Returns the product of key or null
   * @param  {id:string}
   * @return {product:null}
   * @TODO Create Actions.findProduct with FIND_PRODUCT type and move this into Reduce/Store
   */
  public findProduct = (id:string):products | null => {
    let products = Session.retrieve(Types.PRODUCTS);
    // console.log(products);
    if( products && products[id] ){
      return products[id];
    }
    return null;
  }

  /**
   * Removes individaul items from store
   * @param  type
   * @return {}
   * @TODO Create Actions.removeProduct with REMOVE_PRODUCT type and move this into Reduce/Store
   */
  public remove = (type:string ,id:string):void => {
    let items:any|null = Session.retrieve(type);

    //if tracking exists
    if(items[type]){
      let item = items[id];

      //& item in tracking exists delete it and store tracking
      item[id] ? delete items[type][id] : null;
      Session.trackItem(items);
    }
  }

  /**
   * last viewed item if it is tracked
   * @param  'state'
   * @return { item | null}
   */
  public getByKey = (key:string) => {
    let state =  Session.retrieve('state');
    if(state && state[key] ) {
      return state[key];
    }
    return null;
  }

  //picking store product points
  private add = (key:string, ref:product):void => {

    //if we cannot create product then just return
    let id = Store.productKey(ref);
    if(!id) return;

    let item:productPoint = {
      name: ref.name,
      product_id: id,
      count: 1
    }

    //store with action call on type
    Store.dispatchAction(Actions.setViewed, ref);

    //store with action call on type
    Actions['sessionTracking']({[id]:item});

    Session.trackItem(item);

    Store.dispatchAction(Actions.sessionTracking, {[id]:item});
    console.log('Tracker.add reached with')
    console.log(id);
    console.log(item);

  }
}
export default new Tracker();
