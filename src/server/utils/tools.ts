import * as fs from 'fs';


export class Tools{

  public isFile = (path:string,callback:Function) =>{
    fs.stat(path, (err, stat) => {
        if(err == null) {
          console.log('File exists');
          return callback(true);
        }
        return callback(false);
    });
  }

}
export default new Tools();
