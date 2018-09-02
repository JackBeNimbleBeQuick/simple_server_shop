cp server/config/*.pem dist/server/config/
cp -R server/templates dist/server/
cp server/public/favicon.ico dist/server/public/
cp -R server/public dist/server/
cp -R server/clients/shop/css dist/server/clients/shop/
tsc & node dist/server/server.js
