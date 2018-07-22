
/// <reference path="../../lib/interfaces/com.interface.d.ts"/>
/// <reference path="../../lib/interfaces/shop.interface.d.ts"/>
/// <reference path="../../lib/interfaces/react.interface.d.ts"/>
import {Connected} from 'clients/lib/com/Connected';
import {Session} from 'clients/lib/com/Session';
import Config from 'clients/lib/com/Coms.config';
import Mock from 'clients/lib/mocking/shopping';
import Actions from 'clients/shop/data/actions';
import Store from 'clients/shop/data/store';
import {EventEmitter} from 'events';

interface Actions{
  emitter: EventEmitter
}

/*
 * @TODO provide ajax / io fallbacks
 *  => mitigate connection types as we evaluate best use cases for each
 */
export class Comservices{

  private services:services;

  private session:Session;

  private connect:Connected;

  private forward:Function;

  private env:string;

  constructor(){
    this.env      = Config.getServices().env
    this.session  = new Session();
    this.services = this.session.serviceConfig();
    this.connect  = new Connected();
    this.forward  = ()=>{};
  }

  /**
   * Flux / Redux wrapper for Comservices
   * using local com.interace
   * @param  {req: request}
   * @return {void}
   */
  public action = (req:request): void=> {
    let act:Function = req.action;

    if(this.env === 'dev') return Store.dispatch(act(new Mock()));

    let success = (response:any) =>{
      Store.dispatch(act(response));
    }

    this.post(
      this.postage(req), success, this.errors
    );

  }


  //POST | PUT | DELETE @NOTE Build out others as needed
  /**
   * Get
   * @param {Function} success
   * @param  {Function} error
   * @return {void} Connected:sends passes results to the passed in functions
   */
  public post = (post:postage ,success:Function, error:Function ) => {
    let params = this.services.params;
    this.forward = success;
    this.connect.send({
      url: params.base + params.uri,
      type: 'POST',
      data: JSON.stringify(post),
      header_type: 'form',
    },this.packager, error);
  }

  //GET
  /**
   * Get Appointments History
   * @param {Function} success
   * @param  {Function} error
   * @return {void} Connected:sends passes results to the passed in functions
   */
  public get = (success:Function, error:Function ) =>{
    let params = this.services.params;
    this.forward = success;
    this.connect.send({
      url: params.base + params.uri,
      type: 'GET',
      data: null, // 8^) looking into this
      header_type: 'form_ac'
    },this.packager, error);
  }

  //PACKAGE
  /**
   * To handle hydration and any other needs
   * as the app layer evolves provide:
   * . single simple call signatures at app level
   * . offload and communication details from the app layer
   * . maintain reusability with other communication types
   * @param  data
   * @return
   */
  private packager = (data:any) => {
    // console.log(data);
    let boxed = typeof data === 'object' ? data : JSON.parse(data);
    return this.forward(boxed);
  }

  private postage(req:request):postage{
    let params = Config.getServices().params;

    return {
      url: params.base + req.uri,
      data: req.data,
      type: req.type
    }
  }

  /**
   * Under the flux context we need to generalize the errors
   * ideally these could flow into the data/actions context
   * @param  response
   * @return {void}
   */
  private errors = (response:any) => {
    console.log(response);
  }


}
export default new Comservices();
