import Tools from 'clients/lib/util/tools';

/**
 * Accepts data packets and iterates for all media that is not
 * currently stash within the offline scope / processes
 */

//@TODO move to com.interfaces
interface loader{
  [key:number]: mediaref
}
interface mediaref{
  mediaref: string,
  protocal: string,
  completed: boolean
}

export class Fetch{

  constructor(){
  }

  public scan = (packet:any ) =>{
    packet = Tools.isJson(packet) ? JSON.parse(packet) : packet;

    return this.scanner(packet);

  }

  private scanner = (data:Object, remainder?:any, parsed?:Array<string>) => {
    //get object keys or us

  }

  /**
   * @TODO provide cached data mechanism for marking the data
   * with loading state...
   */
  private load = (loader:loader) => {

  }

}
