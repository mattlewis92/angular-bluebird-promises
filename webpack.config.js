var open = require('open');
var karma = require('karma');

var port = 8080;
process.argv.forEach(function(arg, index) {
  if (arg === '--port') {
    port = process.argv[index + 1];
  }
});
open('http://localhost:' + port);

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
