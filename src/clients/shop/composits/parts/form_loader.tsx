import * as React from 'react';
import {connect} from 'react-redux';
import {domToReact} from 'html-react-parser';
import Comservices from 'clients/lib/com/Comservices';
import Types from 'clients/shop/data/types'
import Tracker from 'clients/shop/data/tracker'
import Actions from 'clients/shop/data/actions'
import Validation from 'clients/lib/util/validation';
import * as PWStrength from 'zxcvbn';

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

//provides room for additional form state attributes
//that may need to be extracted
interface inputs{
  [Indentifier:string]: {
      value: string
  }
}

interface values{
  [Indentifier:string]:string
}

interface formData{
  message: string,
  token: string,
  action: string,
  validators:{
    [Identifier:string]: Array<string>
  },
  filters:{
    [Identifier:string]: Array<string>
  },
}

/**
 * A hybrid class to provide simple server based forms and validations
 * this an intentional anti pattern to React so as to provide server driven
 * forms from one source of data modeling, business logic, work flows ... et al.
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
      active: false,
      action: null,
      filters: null,
      form: null,
      open: false,
      token: null,
      type: null,
      validators: null,
      values: {}
    }
  }

  /**
   * toggle the form tray
   * @param  {HTMLEvent} e
   * @return {void} results in display / hide
   * based on last state of tray
   */
  toggle = (e:any) => {
    e.preventDefault();
    this.setState({
      open: this.state.open === false,
    });
  }

  /**
   * extract all form data
   * @return {Object}
   */
  values = ():values => {
    let form = this.state.form;
    let values = {}

    if(form){
      for(let name in this.state.validators){
        // console.log(`[name]=${name}`)
        let input = form.querySelector(`[name=${name}]`);
        values[name] = input.value ? input.value : '';
      }
    }
    console.log(values)
    return values;
  }

  getValidators = (name:string) => {
    let validators = this.state.validators;
    if(validators[name]){
      return {[name]:validators[name]};
    }
    return [];

  }

  /**
   * clear all interface errors if no element is provided
   * when form group field is provided only that error is cleared
   * @param  {HTMLElement | null} oneField
   * @return {void}
   */
  clearErrors = () => {
    let errors = document.getElementsByClassName('errors');
    console.log(errors);
    if(errors){
      for(let i=0; i< errors.length; i++){
        let parent = errors[i].parentNode;
        if(parent) parent.removeChild(errors[i])
      }
    }
  }

  /**
   * inserts the error message into the data's form group
   * @param  {HTMLElement} field
   * @param  {string} msg
   * @return {void}  insert error to data items form group
   */
  attachErrors = (field:HTMLElement, msgs: Array<string>) => {
    let els = document.createElement('span');
    els.className = 'errors';

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
   * Apply validators of each input data point
   * @param  {string} name
   * @param  {string} value
   * @param  {HTMLEvent} field form group of data point
   * @return {boolean} validateResult from validator
   * results in isValid booean and interface error states
   */
  validateEach = (validators) => {
    console.log('Validators received');
    console.log(validators);

    let results = Validation.batchValidate(validators,this.values());
    let failed  = results.failed;
    console.log(results);

    for(let name in failed){
      let input = this.state.form.querySelector(`[name=${name}]`);
      let field = input.closest('.field');
      let messages:any = failed[name];

      if(field && messages)
        this.attachErrors(field, messages);
    }

    return results.isValid;
  }

  /**
   * Run all validators and apply filters before
   * data submissions:
    .provides client feedbacks that are consitent with server implementations
    .provides separation of client feedback and server data submissions from same
    model data
    .i.e. server side changes to enhance or transform data / business logic / workflows do not
    require additional changes client side and they are immediately made available
   * @param  {formEvent} e
   * @return {POST | Interface Errors}
   */
  submit = (e) => {
    e.preventDefault();
    let values= this.values();
    let post:any = this.values();

    //clear errors in the interface
    this.clearErrors();

    let isValid = this.validateEach(this.state.validators);

    console.log(isValid);

    if(isValid){

      post['_csrf'] = this.state.token;

      Comservices.action({
        type: 'POST',
        action: (Actions.form as Function),
        uri: this.state.action,
        data: post,
      });
    }
    console.log(`Post ${this.state.type}: ${isValid ? 'SENT' : 'CAN NOT BE SENT'} as ${isValid ? 'Valid' : 'it is NOT Valid'}`);
    console.log(this.state.token);
    console.log(post);
  }

  /**
   * Attach base handlers and markup from server side data driven form generator
   * @return {void} [description]
   */
  handlers = () => {
    if(this.state.form ){
      let form:any = this.state.form;
      let handled: string | null = this.state.form.getAttribute('data-hashandler')

      if( handled===null && handled!=='yes'){

        //@TODO add this under conditional
        form.setAttribute('data-hashandler',true);
        let submit:HTMLElement = form.querySelector('input[type=submit]');
        let fields = form.getElementsByClassName('field');
        let password:any = form.querySelector('input[name=password]');
        let resetCaptcha = form.querySelector('.captcha button.reset');
        let captchObj:any = document.querySelector('.captcha.field object');
        let formlist:HTMLElement = form.querySelector('.list');
        let f_comp:any = getComputedStyle(formlist);
        let f_height:number = parseFloat(f_comp.height) + 115;
        let w_height:number = window.outerHeight;

        if(submit !==null){
          submit.addEventListener('click', (e)=>{
            e.preventDefault();
            this.submit(e);
          });
        }

        let resize = () => {
          w_height= window.outerHeight;
          console.log(`wh: ${w_height} fh: ${f_height} trigger: ${f_height>w_height}`);
          if(f_height>w_height){
            let height = w_height - (.4 * w_height);
            console.log(`window h: ${height}`);
            form.setAttribute('style', `height: ${height}pt;overflow:auto;`);
            form.className = 'scrolling';
          }else{
            form.setAttribute('style', ``);
            form.className = '';
          }
        }

        resize();
        window.removeEventListener('resize',resize);
        window.addEventListener('resize',resize);

        console.log(fields)

        for(let i=0; i < fields.length; i++){
          let field = fields[i];
          let label = fields[i].querySelector('label');
          let input = fields[i].querySelector('input');
          if(label){
            label.addEventListener('click',(e)=>{
              input.focus();
              input.select();
            });
          }
            if(input){
              input.addEventListener('focus',(e)=>{
                field.className += ' active';
              });
            input.addEventListener('blur',(e)=>{
              this.clearErrors();
              this.validateEach(this.getValidators(e.target.name));
              this.clearActive(fields);
            });
          }
        }

        if(captchObj){
          resetCaptcha.addEventListener('click', (e)=>{
            e.preventDefault();
            fetch(captchObj.data)
              .then((response)=>{
                console.log(response);
                captchObj.data = response.url
              })
              .catch((err)=>{
                console.log(err)
              })
          });
        }

        if(password !==null){
          let toggle:HTMLElement = form.querySelector('button.toggle');
          let confirm:any  = form.querySelector('input[name=confirm_password]');
          let status:HTMLElement = form.querySelector('.meter .status');

          password.addEventListener('input', (e) => {
            let colors = {0:'red',1:'yellow',2:'orange',3:'slateblue',4:'green'}
            let word   = password.value;
            let rating = PWStrength(word);
            let width  = word.length < 5 ? `2%` : `${ ( (rating.score+1) / 5 ) * 100  }%`;
            let color  = colors[rating.score];
            status.setAttribute('style', `width:${width};background-color:${color}`);
            console.log(rating);

          });

          if(toggle !==null){
            toggle.addEventListener('click', (e)=>{
              e.preventDefault();
              let state = toggle.innerHTML
              console.log(state);
              if(state=='show'){
                toggle.innerHTML = 'hide';
                password.type = 'text'
                confirm.type = 'text'
              }else{
                toggle.innerHTML = 'show'
                password.type = 'password'
                confirm.type = 'password'
              }

            });
          }
        }
      }
    }
  }

  /**
   * Clear the active class when there is no value
   * for the input element within a given form group
   * @param  {HTMLCollection} els
   * @return {void}
   */
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

  /**
   * attach server generated markup and update state
   * @param  {formData} form
   * @return {void} inserts server markup and
   * updates with server driven form params
   */
  attach = (form:formData) => {

    let string = form.message ? form.message : null;

    this.setState({
      action: form.action,
      token: form.token,
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

        //base animations need a moment for browser to respond for
        //new elements in DOM
        setTimeout(()=>{
          if(insert) insert.removeAttribute('style');
          this.setState({open: true, form: form});
          this.handlers();
          Tracker.trays({trayid: 'form_loader', state: 'open'});
        },200);
      }
    }
    return null;
  }

  componentWillReceiveProps (data:any) {
    if(data.form)
      this.attach(data.form);

    if(data.tray && data.tray.lastin !== 'form_loader'){
      this.setState({open: false});
    }
  }

  render() {
    let closeState = this.state.form === null ? 'no-data' : 'close';

    let panelClass = ['form-loader col-md-12', this.state.open ? 'open' : closeState];

    let tabClass   = ['down-tab offset-5', this.state.open  ? 'open' : 'close'];

    // let form    = this.state.form ? this.state.form : '';

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
  let tray  = data.shopping && data.shopping.trayState ? data.shopping.trayState: null;
  console.log('FORMLoader mapper ');
  console.log(data);
  if(tray){
    return {tray: tray};
  }
  if(form){
    return {form: form};
  }
  return {}
}

export default connect(mapper,{})(FormLoader);
