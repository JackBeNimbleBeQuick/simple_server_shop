
///<reference path="../../interface/index.d.ts" />
import Validation from 'clients/util/validation';
import {Comservices} from 'clients/lib/com/Comservices';
import * as PWStrength from 'zxcvbn';

import {Handle} from 'clients/public/lib/handlers/handle';


export class Forms extends Handle{

  // protected selector:HTMLElement;

  private connect: Comservices;

  private validators: Array<string>;

  private formstates: DOMStringMap| null;

  private action: string;

  protected selector:string;

  protected selected:HTMLElement;

  constructor(options:shellOptions){
    super(options);
    this.selector  = options.selector;
    this.selected  = options.selected;
    this.connect = new Comservices();
    this.formstates = {hashandler: 'false', validators: '' , result: ''};
    this.validators = [];
    this.action = '';
    this.state = {
      open: false,
      form: null,
    }
    this.attach();
  }

  private values = ():any => {
    let form = this.selected;
    let values = {}
    // values['_csrf'] = this.state.token;
    let names = this.validators ? Object.keys(this.validators) : [];
    names.push('_csrf');

    if(form){
      names.forEach((name)=>{
        let input:HTMLFormElement | null = form.querySelector(`[name=${name}]`);
        values[name] = input && input.value ? input.value : '';
      });
    }
    // console.log(values)
    return values;
  }

  private submit = (e:any) => {
    e.preventDefault();
    this.validate(this.validators, (isValid)=>{
      console.log(isValid);
      if(isValid){

        let post:postage = {
          url: this.action,
          type: 'POST',
          data: this.values(),
        }
        this.connect.post(post, this.serverSuccess, this.serverErrors );
      }

    });

    console.log(this.values());

  }

  private serverErrors = (errors:any) => {
    console.log(`ServerError:`)
    console.log(errors);
    let form = this.selected;
    for(let errKey in errors){
      let input:HTMLElement | null = form.querySelector(`[name=${errKey}]`);
      let field = input ? input.closest('.field') : null;

      if(field)
        this.attachErrors(field,errors[errKey])
    }

  }

  private serverSuccess = (resp:any) => {
    console.log(`ServerSuccess:`)
    console.log(resp);
    if(resp.type){
      this.append(resp);
    }else{
      document.location.href = (this.formstates && this.formstates.result)
        ? this.formstates.result
        : '';
    }

  }

  /**
   * inserts the error message into the data's form group
   * @param  {HTMLElement} field
   * @param  {string} msg
   * @return {void}  insert error to data items form group
   */
  private attachErrors = (field:Element, msgs: Array<string>) => {
    let els:HTMLElement = document.createElement('span');
    els.className = 'errors';

    els.addEventListener('click', (e)=>{
      let parent = els.parentNode;
      if(parent) parent.removeChild(els);
    });

    for(let i=0; i<msgs.length; i++){
      let el = document.createElement('span');
      let tn = document.createTextNode(msgs[i]);
      el.appendChild(tn);
      el.className = 'error';
      els.appendChild(el)
      field.appendChild(els);
    }
  }

  /**
   * Clear the active class when there is no value
   * for the input element within a given form group
   * @param  {HTMLCollection} els
   * @return {void}
   */
  private clearActive = (els:HTMLCollection) => {
    for(let i=0; i< els.length; i++){
      let input = els[i].querySelector('input');
      let hasValue = input && input.value !== '';
      if( ! hasValue){
        let classes = els[i].className;
        els[i].className = classes.replace(/(\sactive)/g,'');
      }
    }
  }

  private clearByClass = (className:string) => {
    let errors = document.getElementsByClassName(className);
    // console.log(errors);
    if(errors){
      for(let i=0; i< errors.length; i++){
        let parent = errors[i].parentNode;
        if(parent) parent.removeChild(errors[i])
      }
    }
  }

  private validate = (validators: Array<string>, validated: Function) => {
    let validate = new Validation({},{})
    let form = this.selected;
    validate.batch(validators, this.values(), (results) => {

      let failed  = results.failed;

      for(let name in failed){
        let input:HTMLFormElement | null = form.querySelector(`[name=${name}]`);
        let field:Element| null = input ? input.closest('.field') : null;
        let messages:any = failed[name];

        if(field && messages)
          this.attachErrors(field, messages);

      }
      return validated(results.isValid);
    });
  }

  private append = (resp:any) => {
    let html = resp.message ? resp.message : null;
    let form = this.selected;
    let insert:HTMLElement | null  = <HTMLElement> form.parentNode;

    if(insert){

      //remove existing
      while(insert.firstChild){
        insert.removeChild(insert.firstChild);
      }

      this.selected = insert;

      insert.setAttribute('style','opacity:0;height:0;');
      insert.innerHTML = html;

      //base animations need a moment for browser to respond for
      //new elements in DOM
      setTimeout(()=>{
        if(insert) insert.removeAttribute('style');
        this.setState({open: true, form: form});
        this.attach();
      },200);
    }

  }

  public attach = () => {

    let form = this.selected;

    this.formstates = form.dataset;
    // console.log('Forms Attach method called');
    // console.log(this.formstates);

    let submit:HTMLElement | null = form.querySelector('input[type=submit]');
    let fields:any = form.getElementsByClassName('field');
    let password:any = form.querySelector('input[name=password]');
    let resetCaptcha = form.querySelector('.captcha button.reset');
    let captchObj:any = document.querySelector('.captcha.field object');

    let action = form.getAttribute('action');
    if(action){
      this.action = action;
    }

    let validators = form.getAttribute('data-validators');
    if(validators){
      this.validators = JSON.parse(validators);
    }

    if(submit){
      submit.addEventListener('click', (e:any) =>{
        e.preventDefault();
        this.submit(e);
      });
    }

    //loop thru fields in the DOM for this form
    for(let i=0; i < fields.length; i++){
      let field = fields[i];
      let label = fields[i].querySelector('label');
      let input = fields[i].querySelector('input');
      if(input !== null && label){
        label.addEventListener('click',(e)=>{
          if(input) input.focus();
          if(input) input.select();
        });
      }
      if(input){
        input.addEventListener('focus',(e)=>{
          field.className += ' active';
        });
        input.addEventListener('blur',(e)=>{
          this.clearByClass('errors');
          this.validate( this.validators, (result) =>{
            this.clearActive(fields);
          });
        });
      }
    }

    if(captchObj && resetCaptcha){
      resetCaptcha.addEventListener('click', (e)=>{
        e.preventDefault();
        fetch(captchObj.data)
          .then((response)=>{
            captchObj.data = response.url
          })
          .catch((err)=>{
          })
      });
    }

    if(password !==null){

      let form = this.selected;
      let toggle:HTMLElement | null = form.querySelector('button.toggle.show');
      let confirm:any  = form.querySelector('input[name=confirm_password]');
      let status:HTMLElement | null = form.querySelector('.meter .status');

      password.addEventListener('input', (e) => {
        let colors = {0:'red',1:'yellow',2:'orange',3:'slateblue',4:'green'}
        let word   = password.value;
        let rating = PWStrength(word);
        let width  = word.length < 5 ? `2%` : `${ ( (rating.score+1) / 5 ) * 100  }%`;
        let color  = colors[rating.score];
        if(status) status.setAttribute('style', `width:${width};background-color:${color}`);
        // console.log(rating);

      });

      // console.log('Does this have a toggle for password?');
      // console.log(toggle);
      if(toggle !== null){
        toggle.addEventListener('click', (e)=>{
          e.preventDefault();
          let state = toggle? toggle.innerHTML : '';
          // console.log(state);
          if(toggle && state=='show'){
            toggle.innerHTML = 'hide';
            password.type = 'text'
            confirm.type = 'text'
          }else if(toggle){
            toggle.innerHTML = 'show'
            password.type = 'password'
            confirm.type = 'password'
          }
        });
      }
    }
  }

}
