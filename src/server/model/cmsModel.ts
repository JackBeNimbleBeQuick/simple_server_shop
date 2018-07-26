import * as mongoose from 'mongoose';
import {Response, Request, NextFunction} from 'express';
import {Repository} from '../model/repository';
import * as https from 'https';


interface schemata{
  [Identifier:string]: {}
}

export class CMSModel{

  private schemas:schemata;

  private model:any = null;

  private schema:any = null;

  private repository:any = null;

  constructor(){
    let Mixed = mongoose.SchemaTypes.Mixed;

      this.schemas={
        login: {
          key: {
            type:String,
            required: true
          },
          login: {
            type:String,
            required: 'Login required'
          },
          pw: {
            type:String,
            required: 'Password required'
          },
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

  public getSchema = (name:string):any|null => {
    if(this.schema) return this.schema;
    let s_object :any = this.schemas ? this.schemas[name] : null;
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
