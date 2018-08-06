import * as React from 'react';
import {connect} from 'react-redux';
import {domToReact} from 'html-react-parser';
import Comservices from 'clients/lib/com/Comservices';
import Types from 'clients/shop/data/types'
import Actions from 'clients/shop/data/actions'
import Tools from 'clients/lib/util/tools';

interface formLoader{
  state:{
    form?:{
      'data-hasHandler'?: string
    }
  }

}

interface validateResult{
  isValid: boolean,
  message: string
}

interface formData{
  message: string,
  validators:{
    [Identifier:string]: Array<string>
  },
  filters:{
    [Identifier:string]: Array<string>
  },
}

/**
 * A hybrid class to provide simple server based forms and validations
 * @extends React
 */
class FormLoader extends React.Component <any, any > {

  static defaultProps = {
    lang: {
      tab: 'Form'
    }
  }

  constructor(props:any){
    super(props);
    this.state = {
      open: false,
      active: false,
      type: null,
      form: null,
      filters: null,
      validators: null,
      values: {}
    }
  }

  toggle = (e:any) => {
    e.preventDefault();
    this.setState({
      open: this.state.open === false,
    });
  }

  inputs = () => {
    let form = this.state.form;
    let values = {}

    if(form){
      let fields = form.getElementsByClassName('field');
      for(let i=0; i < fields.length; i++){

        let input = fields[i].querySelector('input');
        let name  = input.name;

        values[name] = {}
        values[name]['value'] = null;

        if(input.value){
          values[name]['value'] = input.value;
        }
      }
    }
    return values;
  }

  getValidators = (name:string) => {
    let validators = this.state.validators;
    if(validators[name]){
      return validators[name];
    }
    return [];

  }

  validate = (e:any,field:HTMLElement) => {
    // let validators = this.state.validators;
    let input = e.target;
    let value = input.value;
    let name  = input.name;
    let fValidator = this.getValidators(name);

    this.clearErrors();

    if(fValidator){
      this.validateEach(name, value, field);
    }else{
      return {
        isValid: false,
        message: `Not Validator found for ${name}`
      }

    }

  }

  clearErrors = (oneField?:HTMLElement) => {
    let errors:any = document.getElementsByClassName('error');
    if(oneField){
      errors   = oneField.getElementsByClassName('error');
    }
    for(let i=0; i< errors.length; i++){
      let parent = errors[i].parentNode;
      if(parent) parent.removeChild(errors[i])
    }
  }

  attachError = (field:HTMLElement, msg: string) => {
    let el = document.createElement('span');
    let tn = document.createTextNode(msg);
    el.className = 'error';
    el.appendChild(tn);
    field.appendChild(el);
  }

  validateEach = (name:string, value:string, field:HTMLElement) => {
    let messages:Array<string> = [];
    let valid = false;

    this.getValidators(name).forEach((key:string)=>{
      let result:validateResult = Tools.validate(key, value, this.inputs());
      valid = result.isValid;
      if( result.isValid === false ){
        messages.push( result.message );
      }
    });

    if( ! valid ){
      messages.forEach((msg:string)=>{
        console.log(msg);
        if(msg && msg !==''){
          this.attachError(field,msg);
        }
      });
    }

    return valid;

  }

  submit = (e) => {
    e.preventDefault();
    let isValid = false;
    let inputs = this.inputs();
    let post:any = {type: this.state.type};


    this.clearErrors();

    for(let name in inputs){
      let input:HTMLElement|null = document.querySelector(`input[name=${name}]`);
      let field:any = input && input.parentNode ? input.parentNode : null;

      //take value from inputs and not element
      let value = inputs[name].value;
      isValid = this.validateEach(name, value===null ? '' : value, field);
      if(isValid) post[name] = value;
    }

    if(isValid){

      Comservices.action({
        type: 'POST',
        action: (Actions.form as Function),
        uri: 'post',
        data: post,
      });
    }
    console.log(`Post ${this.state.type}: ${isValid ? 'SENT' : 'CAN NOT BE SENT'} as ${isValid ? 'Valid' : 'it is NOT Valid'}`);
    console.log(this.inputs());
  }

  handlers = () => {
    if(this.state.form ){
      let form = this.state.form;
      let handled: string | null = this.state.form.getAttribute('data-hashandler')
      if( handled===null && handled!=='yes'){

        form.setAttribute('data-hashandler',true);
        let submit = form.querySelector('input[type=submit]');
        let fields = form.getElementsByClassName('field');

        submit.addEventListener('click', (e)=>{
          e.preventDefault();
          this.submit(e);
        });

        for(let i=0; i < fields.length; i++){
          let field = fields[i];
          let label = fields[i].querySelector('label');
          let input = fields[i].querySelector('input');
          label.addEventListener('click',(e)=>{
            input.focus();
            input.select();
          });
          input.addEventListener('focus',(e)=>{
            this.clearErrors(field);
            field.className += ' active';
          });
          input.addEventListener('blur',(e)=>{
            this.validate(e, field);
            this.clearActive(fields);
          });
        }
      }
    }
  }

  clearActive = (els:HTMLCollection) => {
    for(let i=0; i< els.length; i++){
      let input = els[i].querySelector('input');
      let hasValue = input && input.value !== '';
      if( ! hasValue){
        let classes = els[i].className;
        els[i].className = classes.replace(/(\sactive)/g,'');
      }
    }
  }

  attach = (form:formData) => {

    let string = form.message ? form.message : null;

    this.setState({
      filters: form.filters ? form.filters: null,
      validators: form.validators ? form.validators : null,
      open: false
    });

    if(typeof string === 'string'){

      let insert:HTMLElement | null  = document.getElementById('form_loader_insert');

      if(insert){

        //remove existing
        while(insert.firstChild){
          insert.removeChild(insert.firstChild);
        }

        insert.setAttribute('style','opacity:0;height:0;');
        insert.innerHTML = string;
        let form = insert.querySelector('form');
        setTimeout(()=>{
          if(insert) insert.removeAttribute('style');
          this.setState({open: true, form: form});
          this.handlers();
        },200);
      }
    }
    return null;
  }

  componentWillReceiveProps (form:any) {
    this.attach(form);
  }

  render() {

    let panelClass = ['form-loader col-md-12', this.state.open ? 'open' : 'close'];

    let tabClass    = ['down-tab offset-5', this.state.open  ? 'open' : 'close'];

    // let form      = this.state.form ? this.state.form : '';

    return (
      <div className={panelClass.join(' ')}>

        <div className="loader" id="form_loader_insert"></div>

        <div className={tabClass.join(' ')}>
          <button onClick= {e=>this.toggle(e)}>
            {this.props.lang.tab}
          </button>
        </div>
      </div>
    );
  }
}

let mapper = (data:any) => {
  let form  = data.shopping && data.shopping.form ? data.shopping.form : null;
  console.log('FORMLoader mapper ');
  console.log(data);
  if(form){
    return form;
  }
  return {}
}

export default connect(mapper,{})(FormLoader);
