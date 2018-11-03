
///<reference path="../../interface/index.d.ts" />
import Dom from 'clients/public/lib/actions/dom';
import Validation from 'clients/util/validation';
import * as PWStrength from 'zxcvbn';

import {Subject} from 'clients/public/lib/subject';


export class Forms extends Subject{

  // protected selector:HTMLElement;

  private validators: any;

  private formstates: DOMStringMap| null;

  private action: string;

  protected selector:string;

  protected selected:HTMLElement;

  protected name:string = 'forms';

  constructor(options:shellOptions){
    super(options);
    this.selector  = options.selector;
    this.selected  = options.selected;
    this.formstates = {hashandler: 'false', validators: '' , result: ''};
    this.validators = {};
    this.action = '';
    this.state = {
      open: false,
      form: null,
    }
    this.handlers();
  }

  private submit = (e:any) => {
    e.preventDefault();
    Dom.validatedFormValues(this.selected, this.validators, (result)=>{
      console.log(result.isValid);
      if(result.isValid){
        let post:postage = {
          url: this.action,
          type: 'POST',
          data: result.data,
        }
        this.connect.post(post, this.serverSuccess);
      }

    });
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

  private append = (resp:any) => {
    let html = resp.message ? resp.message : null;
    let form = this.selected;
    let insert:HTMLElement | null  = <HTMLElement> form.parentNode;
    Dom.fill(insert, html, (el:HTMLElement)=>{
      this.setState({open: true, form: form});
      this.handlers();
    });
  }

  public getName = () => {
    return this.name;
  }

  public handlers = () => {

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
          field = e.target.closest('.field');
          Dom.addClassToEl(field,'active');
        });

        input.addEventListener('blur',(e)=>{
          let named = e.target.name;

          Dom.removeByClass('errors');

          Dom.clearInputActiveClass('active');

          let toValidate =  this.validators[named]
            ? {[named]:this.validators[named]}
            : this.validators;

          Dom.validatedFormValues(this.selected, toValidate, (result)=>{
            console.log(result);
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

      let query = `button.toggle.show:not([data-show_toggle])`;
      let form = this.selected;
      let toggle:HTMLElement | null = form.querySelector(query);
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
        toggle.setAttribute('data-show_toggle','active_toggle');
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
