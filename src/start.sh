killall node node-sass
node-sass ./bin/shop/sass/main.scss -o server/public/clients/shop/css -w& webpack -w& ts-node-dev --respawn server/server.ts& open -a Google\ Chrome\ Canary https://localhost:6040 --args --disable-web-security -user-data-dir --ignore-certificate-errors --unsafely-treainsecure-origin-as-secure=https://localhost:6040
