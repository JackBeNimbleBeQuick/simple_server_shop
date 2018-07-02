killall node
cpx 'server/**/*.{pug,html,png,pem,css}' dist/server/ -w & tsc & nodemon dist/server/server.js

