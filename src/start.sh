killall node
open -a Google\ Chrome https://localhost:4040 --args --disable-web-security -user-data-dir --ignore-certificate-errors --unsafely-treainsecure-origin-as-secure=https://localhost:4040 & webpack & cpx 'server/**/*.{pug,html,png,pem,css}' dist/server/ -w & tsc & nodemon dist/server/server.js


