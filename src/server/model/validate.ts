
import * as mongoose from 'mongoose';
import {validate} from 'mongoose-validator';

export class Validate{

  private list:Object;

  constructor(){
    this.list = {
      name: [
        {
          validator: 'isLength',
          arguments: [1,50],
          message: 'Name needs to fit within {ARGS[0]} and {ARGS[1]} length',
        },
        {
          validator: 'isAlphanumeric',
          passIfEmpty: false,
          message: 'Please do not use special characters or numbers',
        },
      ],
      optional_name: [
        {
          validator: 'isLength',
          arguments: [0,50],
          message: 'Name needs to be no more than {ARGS[1]} in length',
        },
        {
          validator: 'isAlphanumeric',
          passIfEmpty: true,
          message: 'Please do not use special characters or numbers',
        },
      ],
      email: [
        {
          validator: 'isEmail',
          message: 'A valid email is required',
        },
      ],

    }
  }

  public validator = (name:string) => {
    let params = this.list[name] ? this.list[name] : null;
    if(params){
      return new validate(params);
    }
    throw new TypeError(`${name}: does not have a validator associated to it`);

  }


  public validators = (schema:mongoose.Schema) => {
    console.log(schema);
    for(let name in schema){
      if(schema[name].meta){
        let meta = schema[name].meta;
        if(meta.validators){
          return meta.map( (name:string, i:number) => {
            this.validator(name);
          });
        }
      }

    }
  }
}

export default new Validate();
