
///<reference path="../../interface/index.d.ts" />
import {Handle} from 'clients/public/lib/handlers/handle';

export class Scrolling extends Handle{

  protected selector:string;
  protected selected:HTMLElement;

  constructor(options:shellOptions){
    super(options);
    this.selector  = options.selector;
    this.selected  = options.selected;
  }
}

let options = {

}
