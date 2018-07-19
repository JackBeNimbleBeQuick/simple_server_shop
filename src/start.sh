killall node
killall node-sass
node-sass ./bin/shop/sass/main.scss -o server/public/css -w & webpack -w & ts-node-dev --respawn server/server.ts & cpx 'clients/**/{sw.js,index.html}' server/public/js/ -w & open -a Google\ Chrome\ Canary https://localhost:4040 --args --disable-web-security -user-data-dir --ignore-certificate-errors --unsafely-treainsecure-origin-as-secure=https://localhost:4040
