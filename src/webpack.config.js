const path    = require('path');
const webpack = require('webpack');
// const {GenerateSW, InjectManifest}= require('workbox-webpack-plugin');

module.exports = {
  entry: './clients/shop/app.ts',
  mode: 'development',
  devtool: 'inline-source-map',
  watch: false,
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  },
  resolve: {
    modules:[
      // path.resolve('./ts'),
      path.resolve('./node_modules'),
    ],
    extensions: [ '.tsx','.ts','.js'],
  },
  devServer: {
    contentBase: path.join(__dirname, '../public/'),
    port: 8093
  },
  output: {
    // devtoolLineToLine: true,
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist/server/public/js/shop')
  }//,
  // plugins:[
  //   new GenerateSW({
  //     clientsClaim: true,
  //     skipWaiting: true,
  //   })
  // ],
};
