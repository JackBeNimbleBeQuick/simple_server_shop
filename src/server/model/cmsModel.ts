///<reference path="../server.interface.d.ts" />
///<reference path="./model.interface.d.ts" />
import * as mongoose from 'mongoose';
import {Response, Request, NextFunction} from 'express';
import {Repository} from './repository';
import Validate from './validate';
import * as bcrypt from 'bcrypt';
import * as promise from 'promise';
import cnf from '../config/connect.cnf'
import Filters from '../utils/filters';


export let Schema = mongoose.Schema;
export let ObjectId = mongoose.Schema.Types.ObjectId;
export let Mixed = mongoose.Schema.Types.Mixed;

interface person{
  _id: mongoose.Types.ObjectId,
  fname:string,
  lname:string,
  mname:string,
  logins: Array<string>,
  reset: boolean,
  active: boolean,
  resetKey: string,
}

interface login{
  _id: mongoose.Types.ObjectId,
  login: string,
  email: string,
  owner: mongoose.Types.ObjectId,
  pw: string,
}

interface loginPerson{
  person: person,
  login: login
}

interface uniquePost{
  entity: string,
  field: string,
  value: string,
}

interface loginPost{
  login: string,
  pw: string,
}


export class CMSModel {

  private configs:any;

  private model:any = null;

  private schema:any = null;

  private repository:any = null;

  private instantiated:any = {};

  private _id: string;

  constructor(){

      this._id = 'initial_id_value';

      this.configs = {
        Person: {
          fname: {
            type: String,
            required: true,
            meta:{
              form: {
                validators:['name'],
                filters:[],
                label: 'First name',
                type: 'text',
                attributes:{
                  autocomplete: 'given-name',
                },
              },
            }
          },
          lname: {
            type: String,
            required: true,
            meta:{
              form: {
                validators:['name'],
                filters:[],
                label: 'Last name',
                type: 'text',
                attributes:{
                  autocomplete: 'family-name',
                },
              },
            }
          },
          mname: {
            type: String,
            required: false,
            meta:{
              form: {
                validators:['optional'],
                filters:[],
                label: 'Middle name',
                type: 'text',
                attributes:{
                  autocomplete: 'middle-name',
                },
              },
            },
          },
          logins: [{type: ObjectId, ref: 'Login'}],
          active: {
            type: Boolean,
            required: true,
            default: false,
            meta:{
            }
          },
          reset: {
            type: Boolean,
            required: true,
            default: false,
            meta:{
            }
          },
          resetKey: {
            type: String,
            required: true,
            default: 'initiated_account',
            meta:{
            }
          },
          attempts: {
            type: Number,
            required: true,
            default: 0,
            meta:{
            }
          },
        },

        Login: {
          owner: {type: ObjectId, ref: 'Person'},
          key: {
            type:String,
            required: true
          },
          login: {
            type:String,
            required: false
          },
          email: {
            type:String,
            required: 'Login required',
            meta:{
              form: {
                validators:['email'],
                filters:[],
                label: 'Login',
                type: 'text',
                attributes:{
                  autocomplete: 'on',
                },
              },
            },
          },
          pw: {
            type:String,
            required: 'Password required',
            meta:{
              form: {
                validators:['password','required'],
                filters:[],
                label: 'Password',
                type: 'password',
                attributes:{
                  autocomplete: 'on',
                },
              },
            },
          },
        },

        session: {
          data:{
            type: Mixed,
            required: true
          },
          usedAt:{
            type: Date,
            expires: Date.now() + cnf.hour*cnf.hours
          }
        },

        products: {
          key: {
            type:String,
            required: true
          },
          id: {
            type:String,
            required: true
          },
          name: {
            type:String,
            required: true
          },
          flags: {
            type:Mixed,
            required: true
          },
          links: {
            type:Mixed,
            required: true
          },
          messages: {
            type:Mixed,
            required: true
          },
          priceRange: {
            type: Mixed,
            required: true
          },
          reviews: {
            type: Mixed,
            required: true
          },
          swatches: {
            type: Mixed,
            required: true
          },
          hero: {
            type: Mixed,
            required: true
          },
          thumbnail: {
            type: Mixed,
            required: true
          },
          images: {
            type: Mixed,
            required: true
          },
        },
      }
  }

  public config = (name:string):entitySpec | null  => {
    if(this.configs[name]){
      return this.configs[name];
    }
    return null;
  }

  public getSchema = (name:string):any|null => {
    if(this.instantiated[`${name}_schema`]) return this.instantiated[`${name}_schema`];
    // if(this.schema) return this.schema;
    let s_object :any = this.configs? this.configs[name] : null;
    if( s_object){
      this.instantiated[`${name}_schema`] = new mongoose.Schema(s_object);
      return this.instantiated[`${name}_schema`]
    }
    throw new RangeError(`Schema for ${name} does not exist`);
  }

  public getModel = (name:string):any|null => {
    if(this.instantiated[`${name}_model`]) return this.instantiated[`${name}_model`];
    // if(this.model) return this.model;
    let schema = this.getSchema(name);
    if(schema){
      this.instantiated[`${name}_model`] = mongoose.model(name,schema);
      return this.instantiated[`${name}_model`]
    }
    throw new RangeError(`Model for ${name} does not exist`);
  }

  public repo = (name:string) => {
    // if(this.repository) return this.repository;
    let model = this.getModel(name);
    if(model){
      return new Repository(model);
    }
    throw new RangeError(`Repo for ${name} does not exist`);
  }

  public validators = (name:string) => {
    let schema = this.getSchema(name);
    if(schema){
      return Validate.validators(schema);
    }
    return null;
  }

  /** Entity Mothods **/

  public isUnique = (post:uniquePost, respond: Function):boolean|void => {
    this.repo(post.entity).find({[post.field]: post.value} , (err:any, value:any)=>{
      let isValid = err || !value || value.length === 0 ? true : false;
      respond(isValid);
    });
  }

  public checkLogin = (post: loginPost, cb:Function) => {

    let _login = post.login ? post.login : null;
    let _pw    = post.pw    ? post.pw    : null;

    let fail = (msg?: string) => {
      console.log(msg)
      return {
        isValid: false,
        message: msg ? msg : 'invalid input'
      }
    }

    if( !_login || !_pw) fail();

    let checker = new promise( (resolve:any ,reject:any) => {
      this.repo('Login').find({$or:[{email: _login},{login: _login}]}, (err:any, login: any)=>{
        if(!login || login.length === 0 ) throw 'no_record';
        login.length ? resolve(login[0]) : resolve(login);
      });
    })

    checker.then( (login:any) => {
      bcrypt.compare(_pw, login.pw, (err:any, result:any) => {
        // console.log(`err: ${err} result: ${result}`);
        let msg =  result===true ? '' : 'bad_password';
        if(err) msg = 'system_failure';
        return cb({
          isValid: result === true,
          message: msg
        });
      });
    })
  }

  public login = (key:any, success: Function, error: Function) => {

    if(key === null || key === undefined ) return null;

    let logins = this.repo('Login');

    let loginSearch = new promise( (resolve:any ,reject:any) => {
      logins.find({$or:[{email: key},{login: key}]}, (err:any, login: any)=>{
        return err ? error(err) : resolve(login)
      });
    })

    loginSearch.then( (login:any) => {
      if(!login || login.length === 0 ) throw 'no_record';
      return login.length ? success(login[0]) : success(login);
    }).catch((err)=>{
      if(err) console.log(`ERROR login search ${err}`);
      return null;
    });

  }

  public personByLogin = (key:string, respond:Function) => {
    this.login(key, (login:any) => {
      let people = this.repo('Person');
      people.findOne({_id: login.owner}, (err:any, person:mongoose.ModelProperties)=>{
        if(!err && respond){
          return respond({
            person: person,
            login: login
          });
        }
        if(err) console.log(`ERROR personByLogin no person found ${err}`);
      })
    }, (err:any)=>{
      if(err) console.log(`ERROR personByLogin no login found ${err}`);
    });
  }

  public setResetKeyByLogin = (key:string, respond:Function) => {
    this.personByLogin(key, (loginPerson:loginPerson)=>{
      if(loginPerson && loginPerson.person){
        let people = this.repo('Person');
        let person = loginPerson.person;
        let login  = loginPerson.login;
        let id = loginPerson.person._id;
        let range = Filters.randomRange(128,200);
        let nKey = Filters.generateKey(range);
        people.update({_id: id},{resetKey: nKey},(err:any, ok:any)=>{
          if(!err && respond){
            respond({
              person: person,
              login: login,
              resetKey: nKey
            });
          }
          if(err) console.log(`ERROR setResetKeyByLogin response ${err}`);
        });
      }
    });
  }

  /**
   * CreateAccount
   * @param
   * @return {message}
   */
  public createAccount = (data:any, success: Function, error: Function) => {
    let phash = null;

    new promise( (resolve:any ,reject:any) => {
      bcrypt.hash(data.password, 10).then((hash)=>{
        phash = hash;
        // console.log(hash);
        // console.log(data);
        this.repo('Person').create(data, (err:any, person:any)=>{
          // console.log(person);
          if(err) console.log(`ERROR createAccount ${err}`);
          return err ? reject(err) : resolve(person)
        })
      })
    }).then((person:any)=>{
      this.repo('Login').create({
        key: '_primary',
        email: data.email.trim(),
        login: data.login ? data.login.trim() : '',
        owner: person,
        pw: phash
      }, (err:any, result:any )=>{
        // console.log(`Create account login result`)
        // console.log(result);
        if(err) console.log(`ERROR createLogin ${err}`);
        return err ? error(err) : success(result)
      });
    })

  }

  public cacheable = (name:string, callback: Function) => {
    switch(name){
      case 'products':
        this.getModel(name).find({}, (err:any, entities:any)=>{
          if(err===null){
            let gather:Array<string> = [];
            entities.forEach((entity:any)=>{
              gather.push(entity.hero.href);
              gather.push(entity.thumbnail.href);
              entity.images.forEach( (image:any) =>{
                gather.push(image.href);
              });
            });
            return callback(gather);
          }
          return callback([]);
        });
      break;
    }
  }


}

export default new CMSModel();
