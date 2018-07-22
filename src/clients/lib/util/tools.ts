

export class Tools{

  isJson = (packet:any) => {
    if (typeof packet === 'string'){
      try{

        let convert = JSON.parse(packet);
        let notEmpty= /(number|boolean)/.test(typeof convert);

        if(typeof convert === 'object' && notEmpty && convert !== null) return true;

      }catch(e){}
    }
    return false;
  }

}
export default new Tools();
