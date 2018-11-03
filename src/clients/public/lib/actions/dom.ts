
import Validation from 'clients/util/validation';

export class Dom {

  constructor(){}

  /**
   * returns single level array with unque values
   * @param  values Array<string>
   * @param  remove string : optional value to remove from result
   * @return Array<string>
   */
  public unique = (values:Array<any>, remove?:string):Array<string> => {
    let sive = (value, index, self) => {
      let notRemove = remove && remove != value;
      let indexed = self.indexOf(value) === index;
      return notRemove && indexed;
    }
    return values.filter(sive);
  }

  public hasClass = (el:HTMLElement, name:string) => {
    let ecn   = el.getAttribute('class');
    let m = new RegExp( name , 'g');
    if(ecn && ecn.match(m) !==null ) return true;
    return false;
  }

  /**
   * Form field sets can be refernced from top level or by input element
   * @return HTMLFormElement
   * may require hasInput validations
   */
  public getValueEl = (el:HTMLElement):HTMLInputElement| null => {
    let type  = el.tagName.toLowerCase();
    let input = type ==='input' || type === 'textarea' || type === 'option' || type === 'select'
      ? el
      : el.querySelector('input');

    return <HTMLInputElement> input;
  }

  public formValues = (form:HTMLElement | null) => {
    let values = {};
    let inputs = form ? form.getElementsByTagName('input'): {};

    if(inputs){
      let arr = [].slice.call(inputs);
      for(let i=0; i< arr.length; i++ ){
        let input = arr[i];
        let name = input.name;

        values[name] = input.value;
      }
    }
    return values;
  }

  /**
   * inserts the error message into the data's form group
   * @param  {HTMLElement} field
   * @param  {string} msg
   * @return {void}  insert error to data items form group
   */
  public attachErrors = ( msgs: Array<string>) => {
    let els:HTMLElement = document.createElement('span');
    els.className = 'errors';

    els.addEventListener('click', (e)=>{
      let parent = els.parentNode;
      if(parent) parent.removeChild(els);
    });

    for(let i in msgs){

      let errs = msgs[i];

      for(let er=0; er<errs.length; er++){
        let el = document.createElement('span');
        let tn = document.createTextNode(errs[er]);
        let input = document.querySelector(`[name=${i}]`);
        let field = input ? input.closest('.field') : null;
        if(field){
          el.appendChild(tn);
          el.className = 'error';
          els.appendChild(el)
          field.appendChild(els);
        }
      }
    }
  }

  public fill = (selected:HTMLElement, content: string|HTMLElement, cb?:Function) => {

    if(selected){
      selected.setAttribute('style','transition:0.5s all ease-in-out;');

      //remove existing
      while(selected.firstChild){
        selected.removeChild(selected.firstChild);
      }

      selected.setAttribute('style','opacity:0;height:0;');
      if(typeof content == 'string'){
        selected.innerHTML = content;
      }else{
        selected.appendChild(content);
      }

      //base animations need a moment for browser to respond for
      //new elements in DOM
      setTimeout(()=>{
        if(selected) selected.removeAttribute('style');
        if(cb) cb(selected);
      },200);
    }

  }

  /**
   * return values after attaching any
   * @param  form: HTMLElement
   * @param  valiators: validators
   * @param  func: Function
   * @return
   */
  public validatedFormValues = (form:HTMLElement | null, validators:validators, func: Function ):any => {
    let validate = new Validation();
    let values   = this.formValues(form);
    validate.batch(validators, values, (results) => {

      this.attachErrors(results.failed);

      return func({
        isValid: results.isValid,
        data: values
      });
    });
  }

  /**
   * For the active class on form group
   * .when empty we want the class to toggle
   * .when values exist in the groups input field DO NOT remove class
   * @
   * @param  el: HTMLElement
   * @param  name: string
   * @return {void}
   */
  public clearInputActiveClass = (name:string) => {
    let match = document.getElementsByClassName(name);
    if(match){
      for(let i=0; i < match.length ; i++){
        let ce  = <HTMLElement> match[i];
        let cn  = ce.getAttribute('class');
        let cns = cn ? cn.split(' ') : cn;
        let ve  = <HTMLInputElement> this.getValueEl(ce);
        let value = ve.value ? ve.value : '';

        console.log(`clearActive for ${ve.name} = ${value ? value : 'no value' }`);
        console.log(cns);
        console.log(`should we clear: ${ve.name} ${value===''}`)

        if(cns && cns.length && value === ''){
          let cNames:any = this.unique(<Array<any>>cns, name);
          console.log(cNames);
          ce.setAttribute('class', cNames.join(' '));
        }
      }
    }
  }

  public addClassToEl = (el:HTMLElement, name:string) => {
    let cn = el ? el.getAttribute('class') : null;
    if(cn){
      let cns :any = this.unique(cn.split(' '), name);
      cns.push(name);
      name = cns.join(' ');
    }
    el.setAttribute('class', name);
  }

public removeClassFromEl = (el:HTMLElement, name:string) => {
    let cn = el ? el.getAttribute('class') : null;
    if(cn){
      let cns :any = this.unique(cn.split(' '), name);
      let i = cn.indexOf(name);
      if(i>-1) cn.slice(i,1);
      name = cns.join(' ');
    }
    el.setAttribute('class', name);
  }

  public removeByClass = (className:string) => {
    let match = document.getElementsByClassName(className);
    // console.log(errors);
    if(match){
      for(let i=0; i< match.length; i++){
        let parent = match[i].parentNode;
        if(parent) parent.removeChild(match[i])
      }
    }
  }

  /**
   * provide elipsis of content in a DOM bounded Box
   * @return {string}
   */
  public ellipsis = (el:HTMLElement):string => {
      let copy = <HTMLElement> el.cloneNode(true);
      let chars = el.textContent;
      let container = el.parentNode;

      if(container && chars && chars.length){

        let count = chars.length;
        copy.setAttribute('class', 'sizer');

        copy.setAttribute('style', this.styleString({
          position: 'absolute',
          width:'auto',
          whiteSpace: 'nowrap',
          height: 'auto',
          visibility: 'hidden',

        }));

        let width = el.offsetWidth;
        let height = el.offsetHeight;
        let vol = width*height;

        container.appendChild(copy);

        //ac = average copy; w: width h: height v: volume
        let acw = copy.offsetWidth/count;
        let ach = copy.offsetHeight;
        let acv  = acw*ach;

        //cr = character replacements
        let cr = 3;

        let ctf = Math.floor(vol/acv) - cr;

        return chars.substring(0,ctf) + '...';
      }

      return '';
  }

  public styleString = ( attribs: Object) => {
    let atrs:Array<string> = [];
    for(let attr in attribs){
      atrs.push(`${attr}: ${attribs[attr]}`);
    }
    return atrs.join(';');
  }


}

export default new Dom();
