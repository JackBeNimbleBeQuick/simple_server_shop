import {Handle} from 'clients/public/lib/handlers/handle'

let selectors = {
  forms: ['form'],
  scrolling: ['.scrolling','form .list'],
}

/**
 * instantiate handlers by selectors in DOM
 * @param  selectors
 * @return void
 * interates through all possible selectors and
 * instantiates with DOM elements that do not have any yet
 */
for(let s in selectors){
  let script_s = selectors[s];
  // console.log(s);
  for(let p in script_s){
    let selector = script_s[p];
    let query = `${selector}:not([data-hasHandler])`;
    // console.log(query)
    let select:HTMLElement | null = document.querySelector(query);
    if(select !== null){
      select.setAttribute('data-hashandler','true');
      let lib = require(`./lib/handlers/${s}`);
      let dex = s.charAt(0).toUpperCase() + s.substring(1);
      let instance = new lib[dex]({
        selector: selector,
        selected: select});

      console.log(selector);
      console.log(select);
      console.log(instance);
    }
  }
}
