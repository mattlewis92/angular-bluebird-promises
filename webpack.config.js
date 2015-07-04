var open = require('open');
var webpackHelper = require('./webpackHelper');
var config = process.argv.indexOf('--prod') > -1 ? webpackHelper.getProdConfig() : webpackHelper.getDevConfig();
var isServer = process.env._.indexOf('webpack-dev-server') > -1;
if (isServer) {
  delete config.externals;
  open('http://localhost:' + 8000);
}
module.exports = config;
