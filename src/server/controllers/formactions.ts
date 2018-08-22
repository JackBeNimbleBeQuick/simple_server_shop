import * as path from 'path';
import * as url from 'url';
import * as pug from 'pug';
import CMSModel from '../model/cmsModel';


interface formSpec{
  action: string,
  rendered: string,
  form: Array<any>,
  filters: any,
  validators: any,
}

interface formAttr{
  name:string,
  label:string,
  type:string,
  [Identifier:string]:any
}

export class FormActions{

  private template_path: string;

  constructor(){
    this.template_path = path.join(__dirname, '../templates');
  }
  public formBuilds = (req:any, token?: string) => {
    let pathName:string|undefined = url.parse(req.url).pathname;
    let type = pathName ? pathName.replace('/forms/','') : 'register';
    if(type) return this.formBuild(type,token);
    return null;
  }

  //@NOTE there are parts of this may need to be parted out
  //  .get needs rendered template
  //  .post just needs validators and filters
  /**
   * provide connecting details from model schema and specific
   * GET responses
   * POST Processint
   * @param  req
   * @return         [description]
   */
  public formBuild = (type:string, token?: string) => {

    let template = this.template_path+'/forms/form.pug';

    let data = this.formData(type, token);

    let spec:formSpec = {
      action: '/login',
      rendered: '',
      form: [],
      filters: {},
      validators: {},
    };

    if(data.hasData){
      spec.action = data.action;
      spec.form.push(data.form)
      spec.validators = data.validators;
      spec.filters    = data.filters;
      spec.rendered   = pug.renderFile(template, {formSpec: data.form, token: token, submitLabel: data.submitLabel, action: data.action});
    }

    return {
      token: token,
      action: spec.action,
      validators: spec.validators,
      filters: spec.filters,
      type:`${type}_form`,
      message:spec.rendered,
    }
  }

  public formData = (type:string, token?: string) => {
    let submitLabel = 'Submit';

    let action:string = '/register';

    //NOTE determine request type on GET
    //NOTE initialize data object
    let data:any = {};
    data.hasData = false;

    switch(type){
      case 'applets':

       break;
      case 'register':
        data.action = '/register';
        data.submitLabel = 'Create account';
        data = this.extractForm('Person');
        data.form.push({
          name: 'email',
          type: 'email',
          label: 'Email',
          autocomplete: 'email',
        });

        data.form.push({
          name: 'sigmond',
          type: 'captcha',
          label: 'I am not a robot?'
        });

        data.form.push({
          name: 'login',
          type: 'text',
          label: 'Login (optional)',
          autocomplete: 'additional-name',
        });

        data.form.push({
          name: 'password',
          type: 'password',
          label: 'Password',
          autocomplete: 'off',
        });

        data.form.push({
          name: 'confirm_password',
          type: 'password',
          label: 'Password confirmation',
          autocomplete: 'off',
        });

        data.validators['email'] = ['email'];
        data.validators['login'] = ['optional'];
        data.validators['sigmond']  = ['required'];
        data.validators['password'] = ['required','password'];
        data.validators['confirm_password'] = ['match.password','required'];

        data.filters['email'] = [];
        data.filters['login'] = [];
        data.filters['password'] = [];
        data.filters['confirm_password'] = [];
        data.hasData = true;
        break;

      case 'login':
        data.action = '/login';
        data.submitLabel = 'Login';
        data = this.extractForm('Login');
        data.validators['login'] = ['required'];
        data.filters['login'] = [];
        data.hasData = true;
        break;

      case 'resetPassword':
        data.action = '/reset_password';
        data.submitLabel = 'Reset';
        data = this.extractForm('Login');

        data.form.push({
          name: 'password',
          type: 'password',
          label: 'Password',
          autocomplete: 'off',
        });

        data.form.push({
          name: 'confirm_password',
          type: 'password',
          label: 'Password confirmation',
          autocomplete: 'off',
        });

        data.validators['password'] = ['required','password'];
        data.validators['confirm_password'] = ['match.password','required'];

        data.filters['login'] = [];
        data.hasData = true;
        break;

      case 'reset':
        data.action = '/reset';
        data.submitLabel = 'Reset account';
        data = this.extractForm('Login',/(pw)/);


        data.form.push({
          name: 'login',
          type: 'text',
          label: 'Login',
          autocomplete: 'off',
        });


        data.validators['login'] = ['required'];
        data.filters['login'] = [];
        data.hasData = true;
        break;
      default:
    }
    if(data.hasData)
      return data;
    return {};
  }

  private extractForm = (key:string, filter?: RegExp) => {
    let data:entitySpec| null = CMSModel.config(key);
    if(data){

      let formSpec:Array<formAttr> = [];
      let filters     = {};
      let validators  = {};
      let spec:any = {};

      for(let name in data){
        if(filter && filter.test(name)) continue;
        let field:entitySpec = data[name];
        if ( field.meta && field.meta.form){
          let form = field.meta.form;
          if(form.attributes) spec = form.attributes;

          //accumulate
          spec['name'] = name;
          spec['label'] = form.label;
          spec['type'] = form.type;

          validators[name]  = field.meta.form.validators;
          filters[name]     = field.meta.form.filters;

          //push the form spec
          // formSpec.push(field.meta.form);
          formSpec.push(spec);
        }

      }
      return {
        form: formSpec,
        filters: filters,
        validators: validators,
      };
    }
    return {
      form: [],
      filters: {},
      validators: {},
    };
  }



}
export default new FormActions();
