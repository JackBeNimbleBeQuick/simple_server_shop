import * as validator from 'validator';
import Comservices from 'clients/lib/com/Comservices';
import * as PWStrength from 'zxcvbn';

interface validatedBatch{
  failed: {
    [Identifier:string]:[
      {message: string}
    ]
  },
  isValid: boolean

}

interface validateResult{
  isValid: boolean,
  message: string,
}


export class Validation{

  public isJson = (json:string | Object) => {
    if(typeof json === 'object'){
      return validator.isJSON(JSON.stringify(json));
    }
    return validator.isJSON(json);
  }


  public batchValidate = (validators: any, data:any):validatedBatch=> {
    let failed   = {};
    let isValid = true;
    for( let name in validators ){
      let v_keys:Array<string> = validators[name];

      //cast undefined | null to string
      let value = data[name] ? data[name] : '';
      let empty  = validator.isEmpty(value);

      //@TODO look for better validation chaining method... i.e. ?? observable maybe... ?? not sure yet
      //validations for each field value starts here where each field can have multiple
      if(v_keys && v_keys.length){

        let optional:boolean =  v_keys.indexOf('optional') !==-1;

        if(optional && empty) continue;

        for (let v = 0; v < v_keys.length; v++){
          let key = v_keys[v];
          let result = this.validate(key, value, data);
          let messages:Array<string> = [];

          if(result.isValid === false){

            isValid = false;
            messages.push(result.message);
            failed[name] = messages;

          }
        }

      }
    }
    return {
      failed: failed,
      isValid: isValid,
    }
  }

  public validate = (key: string, value:string, values: any):validateResult => {

    let valid  = false;
    let empty  = validator.isEmpty(value);
    let message = '';

    if(typeof value === 'object' && Object.getOwnPropertyNames(value).length) throw new TypeError('value need to be converted to string');
    value = typeof value !== 'string' ? '' : value;
    // let value = values[key] || values[key].value;

    switch(key){
      case 'email':
       valid = validator.isEmail(value);

       if(!valid) message = ! empty
        ? 'This does not look like an Email, please verify'
        : 'An Email is required';

        break;

      case 'name':
        valid = validator.isAlpha(value);

        if(!valid) message = empty
          ? 'A value is required'
          : 'Only letters are allowed for this entry';

        break;

      case 'optional_name':
        valid = validator.isAlpha(value) || empty;

        if(!valid) message =  'Only letters are allowed for this entry';

        break;

      case 'required':
        valid = empty === false;

        if( empty ) message =  'A value is required';

        break;

      case 'password':
      let score = PWStrength(value);
        valid = !empty && value.length >7 ? true : false;
        if( ! valid ){
          message = 'Minimum password length is 8 characters long';
        }
        valid = score.score >= 3;
        if(score.score < 4){
          valid   = false;
          message = 'This password needs to be stronger; capitals, special chars, numbers, and length all help';

        }
        break;

      default:
        let isMatch = key.match(/(match)/);
        if(isMatch){
          let keys = key.split('.');
          let tomatch = keys.length===2 ? values[keys[1]] : '';
          valid = validator.equals(value, tomatch);
          if(!valid) message =  `This value does not match ${tomatch}`;
        }

    }

    return {
      isValid: valid,
      message:  message
    }

  }

}
export default new Validation();
