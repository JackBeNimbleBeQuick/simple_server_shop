///<reference path="../server.interface.d.ts" />
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

export class BaseModel{

  private configs:any;

  private instantiated:any = {};

  private _id: string;

  constructor(){

    this._id = 'initial_id_value';

    this.configs = {
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
}

export default new BaseModel();
