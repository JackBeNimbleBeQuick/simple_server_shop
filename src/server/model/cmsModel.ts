///<reference path="../server.interface.d.ts" />
import * as mongoose from 'mongoose';
import {Response, Request, NextFunction} from 'express';
import {Repository} from './repository';
import Validate from './validate';
import * as https from 'https';
import cnf from '../config/connect.cnf'


export let Schema = mongoose.Schema;
export let ObjectId = mongoose.Schema.Types.ObjectId;
export let Mixed = mongoose.Schema.Types.Mixed;

export class CMSModel{

  private configs:any;

  private model:any = null;

  private schema:any = null;

  private repository:any = null;

  constructor(){

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
                validators:['optional_name'],
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
            type: Number,
            required: false,
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
            required: 'Login required',
            meta:{
              form: {
                validators:['name'],
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
                label: 'Login',
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
    if(this.schema) return this.schema;
    let s_object :any = this.configs? this.configs[name] : null;
    if( s_object){
      this.schema = new mongoose.Schema(s_object);
    }
    return this.schema
  }

  public getModel = (name:string):any|null => {
    if(this.model) return this.model;
    let schema = this.getSchema(name);
    if(schema){
      this.model = mongoose.model(name,schema);
    }
    return this.model;
  }

  public repo = (name:string) => {
    if(this.repository) return this.repository;
    let model = this.getModel(name);
    if(model){
      this.repository = new Repository(model);
    }
    return this.repository;
  }

  public validators = (name:string) => {
    let schema = this.getSchema(name);
    if(schema){
      return Validate.validators(schema);
    }
    return null;
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
