
///<reference path="../interface/index.d.ts" />

/**
 * Class to act as agregator of Subjects and Observers
 * does not try to assert directionality in data flows
 * as in this libs context the only valid data originates from live server
 * connections
 * @return [description]
 */
export class Observer implements observer{

  private name: string;

  constructor(name:string){
    this.name = name;
  }

  public update = (subject:subject, state:any) =>{
  }

  public getName = () => {
    return this.name;
  }

}
