'use strict';

const open = require('open');
const karma = require('karma');

const PORT = 8000;
open('http://localhost:' + PORT);

const server = new karma.Server({
  configFile: __dirname + '/karma.conf.js',
  autoWatch: true,
  singleRun: false
});

server.start();

module.exports = {
  entry: __dirname + '/src/angular-bluebird-promises.js',
  devtool: 'source-map',
  output: {
    filename: 'angular-bluebird-promises.js'
  },
  module: {
    preLoaders: [{
      test: /.*\.js$/,
      loader: 'eslint',
      exclude: /node_modules/
    }],
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }]
  },
  devServer: {
    port: PORT,
    inline: true
  }
};
