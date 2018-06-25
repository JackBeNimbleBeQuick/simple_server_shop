import * as mongoose from 'mongoose';

let Schema = mongoose.schema;

export default {
  login: new Schema ({
    login: {
      type:String,
      required: 'Login required'
    },
    pw: {
      type:String,
      required: 'Password required'
    },
  }),
}
