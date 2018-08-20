import * as mongoose from 'mongoose';
export let Schema = mongoose.Schema;
export let ObjectId = mongoose.Schema.Types.ObjectId;
export let Mixed = mongoose.Schema.Types.Mixed;

export class Repository{

  private _model:mongoose.Model<mongoose.Document>;

  constructor(model:mongoose.Model<mongoose.Document>){
    this._model = model;
  }

  public create = (item:any , callback: (error: any, result:any ) => void) => {
    this._model.create(item, callback);
  }

  public retrieve = (callback: (error: any, result: any) => void) => {
    return this._model.find({}, callback);
  }

  //@NOTE needed to relax as mongoose.Types.ObjectId is problematic
  public update = (_id: Object, item: any, callback: (error: any, result: any) => void) => {
    this._model.update({ _id: _id }, item, callback);
  }

  public delete = (_id: string, callback: (error: any, result: any) => void) => {
    this._model.remove({ _id: this.toObjectId(_id) }, (err) => callback(err, null));
  }

  public findById = (_id: string, callback: (error: any, result: any) => void) => {
    return this._model.findById(_id, callback);
  }

  public findByKeyValue = (key:string, value: any, callback?: Function):any => {
    return this._model.find({[key]:value}, callback);
  }

  public findOne = (cond?: Object, callback?: (err: any, res: any) => void): any => {
    return  this._model.findOne(cond, callback);
  }

  public find = (cond: Object, callback?: (err: any, res: Array<any>) => void): any => {
    return  this._model.find(cond, callback);
  }

  private toObjectId = (_id: string): mongoose.Types.ObjectId => {
    return mongoose.Types.ObjectId.createFromHexString(_id);
  }

}
