killall node
webpack & tsc & cpx 'dist/client/**/sw.js' dist/server/public/js/ -w & cpx 'server/**/*.{pug,html,png,pem,css}' dist/server/ -w & nodemon dist/server/server.js & open -a Google\ Chrome\ Canary https://localhost:4040 --args --disable-web-security -user-data-dir --ignore-certificate-errors --unsafely-treainsecure-origin-as-secure=https://localhost:4040
