///<reference path="../interface/class.d.ts" />

/**
 * Class to act as agregator of Subjects and Observers
 * does not try to assert directionality in data flows
 * as in this libs context the only valid data originates from live server
 * connections
 * @return [description]
 */
export class Subject implements subject{

  construtor(){}

  public getState = () => {
  }

  public setState = (state:any) => {
  }

}

export default new Subject();
