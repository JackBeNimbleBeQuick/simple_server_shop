
///<reference path="../../interface/index.d.ts" />
import {Subject} from 'clients/public/lib/subject';

export class Scrolling extends Subject{

  protected selector:string;
  protected selected:HTMLElement;
  protected name:string = 'scrolling';

  constructor(options:shellOptions){
    super(options);
    this.selector  = options.selector;
    this.selected  = options.selected;
  }

  public getName = () => {
    return this.name;
  }

}
