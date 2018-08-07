import * as validator from 'validator';
import Comservices from 'clients/lib/com/Comservices';


export class Tools{

  public isJson = (json:string | Object) => {
    if(typeof json === 'object'){
      return validator.isJSON(JSON.stringify(json));
    }
    return validator.isJSON(json);
  }


  public validate = (key: string, value:string, values: any) => {

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
        console.log(`checking for required with : ${value}`);

        if( empty ) message =  'A value is required';

        break;

      default:

        if(/(match\.)/){
          let keys = key.split('.');
          if(keys[1]){

            let tomatch = values[keys[1]];

            console.log(`checking ${tomatch.value} for match with: ${value}`);
            valid = tomatch.value && tomatch.value !==null && validator.equals(value,tomatch.value);

            //comparing
            if(!valid) message =  `This value does not match ${keys[1]}`;

          }
        }




    }

    return {
      isValid: valid,
      message:  message
    }

  }

}
export default new Tools();
