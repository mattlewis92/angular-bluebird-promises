var open = require('open');
var karma = require('karma');
var webpackHelper = require('./webpackHelper');
var config = process.argv.indexOf('--min') > -1 ? webpackHelper.getMinConfig() : webpackHelper.getUnminConfig();
var isServer = process.env._.indexOf('webpack-dev-server') > -1;
if (isServer) {
  delete config.externals;
  open('http://localhost:' + 8000);
  karma.server.start({
    configFile: __dirname + '/karma.conf.js',
    autoWatch: true,
    singleRun: false
  });
}
module.exports = config;
