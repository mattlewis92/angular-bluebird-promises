var open = require('open');
var karma = require('karma');

open('http://localhost:' + 8000);
karma.server.start({
  configFile: __dirname + '/karma.conf.js',
  autoWatch: true,
  singleRun: false
});

module.exports = {
  entry: __dirname + '/src/angular-bluebird-promises.js',
  devtool: 'source-map',
  output: {
    filename: 'angular-bluebird-promises.js'
  },
  module: {
    preLoaders: [{
      test: /.*\.js$/,
      loaders: ['eslint'],
      exclude: /node_modules/
    }]
  },
  eslint: {
    configFile: __dirname + '/.eslintrc'
  }
};
