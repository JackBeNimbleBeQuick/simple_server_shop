killall node node-sass
node-sass ./bin/main/sass/main.scss -o server/public/css -w & node-sass ./bin/shop/sass/main.scss -o server/clients/shop/css -w & webpack -w
