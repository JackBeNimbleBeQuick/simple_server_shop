import {DBRunner} from './db_runner';
import * as Promise from 'promise';

let runner = new DBRunner();

new Promise((resolve:Function, reject:any)=>{
  runner.build();
  resolve()
}).then(()=>{
  return runner.grabMedia();
}).then(()=>{
  return runner.renameMediaRefs();
}).then(()=>{
  //inserts local cache files into show_sw.js
  return runner.createCacheFile();
}).then(()=>{
  //runner.exportJson(); //proof of concept for the ../shop/data GET//
});
