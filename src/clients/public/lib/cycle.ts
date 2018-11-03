///<reference path="../interface/index.d.ts" />
import selectors from 'clients/public/lib/config/selections';

export class Cycle implements observer{

  private name = 'cycle';

  constructor(){
    console.log('starting Cycle');
    document.addEventListener('readystatechange', this.domStates);

    ['focus','blur','visibilitychange','freeze','resume','pagehide','beforeunload'].forEach( event => {
      document.addEventListener(event, this.docEvents);
    });
  }

  /**
   * instantiate handlers by selectors in DOM
   * @param  selectors
   * @return void
   * interates through all possible selectors and
   * instantiates with DOM elements that do not have any yet
   */
  public update = () => {

    for(let s in selectors){
      let script_s = selectors[s];
      let selects  = script_s.selector;
      let tag    = script_s.tag;
      for(let p in selects){
        let selector = selects[p];
        let query = `${selector}:not([data-${tag}])`;
        let select:HTMLElement | null = document.querySelector(query);
        if(select !== null){
          console.log('provide loading to cycle as main oberver');
          select.setAttribute('data-hashandler', tag);
          let lib = require(`./subjective/${s}`);
          let dex = s.charAt(0).toUpperCase() + s.substring(1);
          let instance = new lib[dex]({
            observer: this,
            selector: selector,
            selected: select});

          instance.attach(this);
        }
      }
    }
  }

  public notify = (subject:subject, state: any) => {

  }

  public getName = () => {
    return this.name;
  }

  /*
  [1] initial readyState:loading
  [2] readyState:interactive
  [2] DOMContentLoaded
  [3] iframe onload
  [4] readyState:complete
  [4] img onload
  [4] window onload
 */
  private domStates = (e) => {
    console.log('domState implements Cycle');
    console.log(e);
    console.log(document.readyState);
    switch(document.readyState){
      case 'loading':
      case 'interactive':
      break;
      case 'complete':
      break;
    }
  }

  private docEvents = (e) =>{
    console.log(`Document Events: ${e.type}`);
    console.log(e)
    let focused = document.hasFocus();
    switch(e.type){
      case 'visibilitychange':
      console.log(`document focus: ${document.hasFocus()}`);
      break;

    }
  }
}

export default new Cycle();
