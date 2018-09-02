killall node node-sass

nodemon server/server.ts & cpx server/utils/validation.ts clients/util/ -w & node-sass ./bin/main/sass/main.scss -o server/public/css -w & node-sass ./bin/shop/sass/main.scss -o server/clients/shop/css -w & webpack --env dev -w & open -a Google\ Chrome\ Canary https://localhost:6040/shop --args --disable-web-security -user-data-dir --ignore-certificate-errors --unsafely-treainsecure-origin-as-secure=https://localhost:6040

