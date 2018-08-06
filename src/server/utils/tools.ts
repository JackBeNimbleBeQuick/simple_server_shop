import {stat} from 'fs';
import * as validator from 'validator';


export class Tools{


  public isFile = (path:string,callback:Function) =>{
    stat(path, (err, stat) => {
        if(err == null) {
          console.log('File exists');
          return callback(true);
        }
        return callback(false);
    });
  }

  public isJson = (json:string | Object) => {
    if(typeof json === 'object'){
      return validator.isJSON(JSON.stringify(json));
    }
    return validator.isJSON(json);
  }

  public validate = (key: string, values:any) => {

    let valid   = false;
    let message = '';
    let value = values[key] || values[key].value;
    let empty = true;

    console.log(value);

    switch(key){
      case 'email':
       valid = validator.isEmail(value);

       if(!valid) message = value && value.length
        ? 'This does not look like an Email, please verify'
        : 'A Email is required';

        break;

      case 'name':
        valid = validator.isAlpha(value);

        if(!valid) message = value && value.length
          ? 'A value is required'
          : 'Only letters are allowed for this entry';

        break;

      case 'optional_name':

        empty = validator.isEmpty(value);
        valid = validator.isAlpha(value) || empty;

        if(!valid) message =  'Only letters are allowed for this entry';

        break;

      case 'required':

        valid !== validator.isEmpty(value);

        if( ! valid ) message =  'A value is required';

        break;

    }

    return {
      isValid: valid,
      message: message
    }

  }

}
export default new Tools();
