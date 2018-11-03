import * as mongoose from 'mongoose';
import * as validator from 'validator';
import * as PWStrength from 'zxcvbn';

interface connect{
  sessionStart():void,
  action(Object): void
}

interface repo{
  getModel(string): mongoose.ModelProperties,
  repo(string): mongoose.ModelProperties,
  isUnique(uniquePost, Function): connectedModel
  validation?: Object
}

interface validatedBatch{
  failed: {
    [Identifier:string]:[
      {message: string}
    ]
  },
  isValid: boolean
}

interface validations{
  [Identifier:string]: Array<string>
}

interface validateResult{
  field: string,
  isValid: boolean,
  message: string,
}

interface validTasker{
  tasker_id: number,
  validators: Object,
  response: Function,
  size: number,
  processed: number,
  state:{
    failed: Object,
    isValid: boolean
  }
}

interface connectedModel{
  find(Object,cb:Function):any,
  findOne(Object,cb:Function):any,
  any:any
}

interface repo{
  getModel(string): mongoose.ModelProperties,
  repo(string): mongoose.ModelProperties,
  isUnique(uniquePost, Function): connectedModel
}

interface validResponse{
  tasker: validTasker,
  task: number,
  field: string,
  key: string,
  isValid: boolean,
  message: string
}

interface validQuery{
  tasker: validTasker,
  task: number,
  validation: string,
  key: string,
  field: string,
  value: string,
  values: Object,
}


export class Validation{

  private connector?:connect;
  private repo?:repo;


  //@NOTE interim preliminary lang step
  private lang={
    email: {
     form: 'This does not look like an Email, please verify',
     empty: 'An Email is required',
    },
    name: {
      form: 'Only letters are allowed for this entry',
      empty: 'A value is required',
    },
    required: {
      empty: 'A value is required'
    },
    unique: {
      email: {
        inuse: 'value: __VALUE__ is in use, please reset the account or report this issue'
      },
      login: {
        inuse: 'value: __VALUE__ is in use, please try again'
      },
    },
    password:{
      mininum: 'Minimum password length is 8 characters long',
      strength: 'This password needs to be stronger; capitals, special chars, numbers, and length all help',
    }

  }

  constructor(connector?:any , repo?: any){
    if(connector && repo){
      this.connector = connector;
      this.repo = repo;
    }
  }

  public isJson = (json:string | Object) => {
    if(typeof json === 'object'){
      return validator.isJSON(JSON.stringify(json));
    }
    return validator.isJSON(json);
  }

  /**
   * Provides a funcional Unit of work Object Class
   * @param  validators this Unit of work is for validators
   * @return new Object / Unit of work class
   */
  public unitOfWork = (validators: Object, responder: Function) => {

    let size = 0;

    Object.keys(validators).forEach((field)=>{
      let valids = (validators[field]).length;
      if(valids) size += parseFloat(valids);
    });

    return {
      tasker_id: Date.now(),
      validators: validators,
      response: responder,
      size: size,
      processed: 0,
      state:{
        failed: {},
        isValid: true
      }
    }
  }

  /**
   * Unit Of Work pattern for server side validations
   * @param  validators chain of validators to run on form
   * @param  respond  Function to return the results as each Unit of Work completes
   * @return @.gathere(query) results for each validation Chain Unit of Work
   */
  public batch = (validators: Object, data:any, respond: Function) => {

    let task = 0;

    let unitOW = this.unitOfWork(validators, respond);

    for(let field in validators){
      let value = data[field] ? data[field] : '';
      let tovalidate:Array<string> = validators[field];

      if(tovalidate){
        tovalidate.forEach((validate)=>{

          if(validate == 'optional' && validator.isEmpty(value)) {
            unitOW.size--;
            return;
          }

          task ++;

          let hasKeys = validate.split('.');

          let query = {
            tasker: unitOW,
            task: task,
            key:validate,
            field:field,
            value:value,
            values:data,
          }

          // console.log(`task: ${task} query to ${validate} for ${field}`)
          if(hasKeys.length > 1){
            return this.distribute(query)
          }
          if(this[validate]){
            return this[validate](query);
          }else{
            throw new Error(`Validation: failed to batch process ${validate} `);
          }
        });
      }
    }
  }

  /**
   * Gathers the result for each Unit of work
   * responds with the tasker.response
   * @param  validQuery query for each validator
   * @return Object | void with Function call
   */
  public gather = (query):void|Object => {
    query.tasker.processed++;
    if(query.isValid === false){
      query.tasker.state.isValid = false;
      let failed = query.tasker.state.failed;

      failed[query.field] = failed[query.field]
        ? failed[query.field].push(query.message)
        : [query.message];
    }
    // console.log(`${query.tasker.size} ?= ${query.tasker.processed}`);
    if(query.tasker.processed === query.tasker.size){

      let response = query.tasker.response;
      let result = {
        isValid: query.tasker.state.isValid,
        failed: query.tasker.state.failed
      };

      if(typeof response === 'function') return response(result);
      return result;
    }
  }

  /**
   * Handler for validators that need to reference the
   * form validate state ... i.e. data
   * @param  '.' [description]
   * @return     [description]
   */
  private distribute = (query:any) => {
    let keys = query.key.split('.');
    let validate = keys[0];
    let method = this[validate];
    // console.log(`Distrib: ${validate}`);
    // console.log(`Distrib: ${typeof method}`);

    if( typeof method === 'function' ) return method(query);

    else throw new Error(`Validation: failed to distribute ${keys[0]} `);
  }

  /* All validator to follow same pattern eith sync or async */

  public email = (query:validQuery):void => {

    let message       = '';
    let valid:boolean = validator.isEmail(query.value);

    if(!valid) message = ! validator.isEmpty(query.value)
     ? this.lang.email.form
     : this.lang.email.empty;

    this.gather({
      tasker: query.tasker,
      task: query.task,
      key: query.key,
      field: query.field,
      isValid: valid,
      message: message
    });
  }

  public optional = (query:validQuery):void => {
    this.gather({
      tasker: query.tasker,
      task: query.task,
      key: query.key,
      field: query.field,
      isValid: true,
      message: ''
    });
  }

  public name = (query:validQuery):void => {
    let empty   = validator.isEmpty(query.value)
    let message = '';
    let valid:boolean = validator.isAlpha(query.value);

    if(!valid) message = empty
      ? this.lang.name.empty
      : this.lang.name.form;

    this.gather({
      tasker: query.tasker,
      task: query.task,
      key: query.key,
      field: query.field,
      isValid: !empty,
      message: message
    });
  }

  public required = (query:validQuery):void => {
    let message = '';
    let empty   = validator.isEmpty(query.value)

    if(empty) message = this.lang.required.empty

    this.gather({
      tasker: query.tasker,
      task: query.task,
      key: query.key,
      field: query.field,
      isValid: !empty,
      message: message
    });
  }

  public password = (query:validQuery):void => {
    let score = PWStrength(query.value);
    let message = '';
    let empty   = validator.isEmpty(query.value)
    let valid = !empty && query.value.length >7 ? true : false;

    if( ! valid ){
      message = this.lang.password.mininum;
    }

    valid = score.score > 3;

    if(score.score < 4){
      valid   = false;
      message = this.lang.password.strength;
    }

    this.gather({
      tasker: query.tasker,
      task: query.task,
      key: query.key,
      field: query.field,
      isValid: valid,
      message: message
    });
  }

  public match = (query:validQuery):void => {

    let message = '';
    let valid   = false;
    let keys    = query.key.split('.');
    let tomatch =  query.values[keys[1]];
    valid = validator.equals(query.value, tomatch);
    // console.log(`match? ${query.value} == ${tomatch}`);
    if(!valid) message =  `This value does not match ${tomatch}`;

    this.gather({
      tasker: query.tasker,
      task: query.task,
      key: query.key,
      field: query.field,
      isValid: valid,
      message: message
    });
  }

  public unique = (query:validQuery) => {

    let keys = query.key.split('.');

    if(this.connector && this.connector.sessionStart)
      this.connector.sessionStart();

    if(this.repo && this.repo.isUnique){


      //@NOTE uniquePost Model types need to migrate to central repository
      let isu = {
        entity: keys[1],
        field: keys[2],
        value: query.value,
        values: query.values
      }

      return this.repo.isUnique(isu, (isValid)=>{
        let message = '';

        // console.log(`isUnique response: is ${query.value} valid?: ${isValid}`);
        let lang = this.lang.unique.login.inuse;
        if(query.field === 'email'){
          lang = this.lang.unique.email.inuse;
        }

        let valid = isValid && isValid ==true ? true : false;
        if(!valid) message =  lang.replace('__VALUE__', query.value);

        this.gather({
          tasker: query.tasker,
          task: query.task,
          key: query.key,
          field: query.field,
          isValid: valid,
          message: message
        });
      });
    }else{
      this.gather({
        tasker: query.tasker,
        task: query.task,
        key: query.key,
        field: query.field,
        isValid: true,
        message: ''
      });

    }
  }

}
export default Validation;
