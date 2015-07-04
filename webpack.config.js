var open = require('open');
var karma = require('karma');
var webpackHelper = require('./webpackHelper');
var config = webpackHelper.getUnminConfig();
delete config.externals;
open('http://localhost:' + 8000);
karma.server.start({
  configFile: __dirname + '/karma.conf.js',
  autoWatch: true,
  singleRun: false
});
module.exports = config;
