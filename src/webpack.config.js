const path    = require('path');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
module.exports = function(env, argv){

  var defaults = {

  }

  console.log(env);



  return {

    entry: './clients/shop/main.tsx',
    mode: env && env=='dev' ?'development' : 'production',
    devtool: 'inline-source-map',
    watch: false,
    module: {
      rules: [
        { test: /\.tsx?$/, loader: "ts-loader" }
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
        'clients': path.resolve(__dirname,'clients/'),
      }
    },
    devServer: {
      contentBase: path.join(__dirname, '../clients/'),
      port: 8093
    },
    output: {
      devtoolLineToLine: true,
      filename: 'app.js',
      path: path.resolve(__dirname, 'server/clients/shop')
    }
  }
};
