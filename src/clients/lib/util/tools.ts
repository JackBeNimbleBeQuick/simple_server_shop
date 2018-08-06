import * as validator from 'validator';


export class Tools{


  public validate = (key: string, value:string, values: any) => {

    let valid  = false;
    let empty  = validator.isEmpty(value);
    let message = '';
    // let value = values[key] || values[key].value;

    switch(key){
      case 'email':
       valid = validator.isEmail(value);

       if(!valid) message = ! empty
        ? 'This does not look like an Email, please verify'
        : 'A Email is required';

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
        valid !== validator.isEmpty(value);

        if( !valid ) message =  'A value is required';

        break;



    }

    return {
      isValid: valid,
      message:  message
    }

  }

}
export default new Tools();
