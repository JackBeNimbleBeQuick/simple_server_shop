import {DBRunner} from './db_runner';

let runner = new DBRunner();


runner.build();
runner.grabMedia();
runner.renameMediaRefs();
runner.createCacheFile(); //inserts local cache files into show_sw.js


//runner.exportJson(); //proof of concept for the ../shop/data GET//
