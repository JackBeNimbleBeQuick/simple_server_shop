
///<reference path="../../interface/index.d.ts" />
// import { fromEvent} from 'rxjs';

/**
 * Lite weight for handling elements that are inserted into the DOM
 * attach versus render is the main entry point of this life cycle
 */
export class Handle{

  private observable: any; //find rxjs type
  private hasChanges:boolean = false;
  protected state:any;
  protected selector:string;
  protected selected:HTMLElement;
  protected filter = /\b(state|filter|selector)\b/;

  constructor (options:shellOptions) {
    Handle.prototype.state = {}

    this.selector = options.selector;
    this.selected = options.selected;

    for(let o in options){
      if(this.filter.test(o)) this[o] = options[o];
    }
  }

  //set only states claimed by instance of Handlers
  public setState = (state:Object, changes ?: boolean) => {
    if(changes) this.hasChanges = changes;
    let keys =  Object.keys(state);
    if(keys.length == 0 ) return;

    //consumes each state
    if(keys.length){
      //pull first
      let key = keys[0];
      console.log(`key: ${key}`)
      console.log(this.state[key])
      //delete from Object
      if(this.state[key]){
        console.log(`Setting ${key}`);
        this.state  = state[key];
        this.hasChanges = true;
      }
      delete state[key];
      this.setState(state);
    }
  }

  //array of selectors are used to iterate DOM
  /*
  . if attrib hasHandler not set attach handlers
   */
  public observe = (element:HTMLElement, action:string, response:Function) => {
    let handled: string | null = element.getAttribute('data-hashandler')
    if(!handled || handled !=='yes'){
      element.setAttribute('data-hashandler', 'yes');
      console.log('Handle Observe');
      console.log(element);
      // // fromEvent(element,action)
      // // .subscribe((e)=>{
      //   console.log('Handle subscribe');
      //   // console.log(e);
        response();
      // });
    }
  }

}
