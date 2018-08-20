
import * as mongoose from 'mongoose'
/* START VALIDATIONS*/

interface validTasker{
  tasker_id: number,
  validators: Object,
  response: Function,
  size: number,
  processed: number,
  state:{
    failed: Object,
    isValid: boolean
  }
}

interface validatedBatch{
  failed: {
    [Identifier:string]:[
      {message: string}
    ]
  },
  isValid: boolean
}

interface validations{
  [Identifier:string]: Array<string>
}

interface validateResult{
  field: string,
  isValid: boolean,
  message: string,
}

interface uniquePost{
  entity: string,
  field: string,
  value: string,
}

interface validResponse{
  tasker: validTasker,
  task: number,
  field: string,
  key: string,
  isValid: boolean,
  message: string
}

interface validQuery{
  tasker: validTasker,
  task: number,
  validation: string,
  key: string,
  field: string,
  value: string,
  values: Object,
}
/* END VALIDATIONS*/

/* START REPO */
interface connect{
  sessionStart():void
}

interface connectedModel{
  find(Object,cb:Function):any,
  findOne(Object,cb:Function):any,
  any:any
}

interface repo{
  getModel(string): mongoose.ModelProperties,
  repo(string): mongoose.ModelProperties,
  isUnique(uniquePost, Function): connectedModel
}

interface account{
  logins: Array<string>,
  active: boolean,
  reset: boolean,
  attempts: number,
  fname: string,
  lname: string,
  mname: string
}

interface registration{
  fname: string,
  lname: string,
  mname: string,
  email: string,
  login: string
  password: string,
}

interface person{
  _id: mongoose.Types.ObjectId,
  fname:string,
  lname:string,
  mname:string,
  logins: Array<string>,
  reset: boolean,
  active: boolean,
  resetKey: string,
}

interface login{
  _id: mongoose.Types.ObjectId,
  login: string,
  email: string,
  owner: mongoose.Types.ObjectId,
  pw: string,
}

interface loginPerson{
  person: person,
  login: login
}

interface resetKeyResponse{
  person: person,
  login: login,
  resetKey:string
}

interface entity{
  _id: mongoose.Types.ObjectId,
  create: Function,
  retrieve: Function,
  update: Function,
  delete: Function,
  findById: Function,
  findByKeyValue: Function,
  findOne: Function,
  find: Function,
}

/* END REPO */
