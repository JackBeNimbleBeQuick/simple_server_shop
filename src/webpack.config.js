const rxPaths = require('rxjs/_esm5/path-mapping');
const path    = require('path');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = [
  //thin none client page js layer
  function(env, argv){

    console.log(env);

    return {

      entry: './clients/public/shell.ts',
      mode: env && env=='dev' ?'development' : 'production',
      devtool: 'inline-source-map',
      watch: false,
      module: {
        rules: [
          { test: /\.tsx?$/, loader: "ts-loader"}
        ]
      },
      resolve: {
        modules:[
          path.resolve('./clients'),
          path.resolve('./node_modules'),
        ],
        extensions: [ '.js', '.ts', '.tsx'],
        alias: {
          clients: path.resolve(__dirname,'clients/')
        },
      },
      output: {
        devtoolLineToLine: true,
        filename: 'app.js',
        path: path.resolve(__dirname, 'server/public/js')
      },
    }
  },
  //shop service worker based app
  function(env, argv){

    console.log(env);

    return {

      entry: './clients/shop/main.tsx',
      mode: env && env=='dev' ?'development' : 'production',
      devtool: 'inline-source-map',
      watch: false,
      module: {
        rules: [
          { test: /\.tsx?$/, loader: "ts-loader"}
        ]
      },
      resolve: {
        // plugins: [new TsconfigPathsPlugin({configFile:'./tsconfig.json'})],
        modules:[
          path.resolve('./clients'),
          path.resolve('./node_modules'),
        ],
        extensions: [ '.tsx','.ts','.js'],
        alias: {
          server: path.resolve(__dirname,'clients/'),
          clients: path.resolve(__dirname,'clients/'),
        }
      },
      output: {
        devtoolLineToLine: true,
        filename: 'app.js',
        path: path.resolve(__dirname, 'server/clients/shop')
      },
    }
  }

];
