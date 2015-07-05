var webpack = require('webpack');
var ejs = require('ejs');

function getBaseConfig() {
  return {
    module: {
      preLoaders: [{
        test: /.*\.js$/,
        loaders: ['eslint'],
        exclude: /node_modules/
      }],
      loaders: [{
        test: /.*\.js$/,
        loaders: ['ng-annotate'],
        exclude: /node_modules/
      }]
    },
    eslint: {
      configFile: __dirname + '/.eslintrc'
    }
  };
}

function getBanner() {
  var pkg = require('./bower.json');
  var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');
  return ejs.render(banner, {pkg: pkg});
}

function getUnminPlugins() {
  var plugins = [];
  plugins.push(new webpack.BannerPlugin(getBanner(), {
    raw: true,
    entryOnly: true
  }));
  return plugins;
}

function getMinPlugins() {
  var plugins = [];
  plugins.push(new webpack.NoErrorsPlugin());
  plugins.push(new webpack.optimize.UglifyJsPlugin());
  plugins = plugins.concat(getUnminPlugins());
  return plugins;
}

function getBaseBuildConfig() {
  var config = getBaseConfig();
  config.entry = __dirname + '/src/angular-bluebird-promises.js';
  config.output = {
    path: __dirname + '/dist'
  };
  config.externals = {
    angular: 'angular',
    bluebird: 'Promise'
  };
  config.devtool = 'source-map';
  return config;
}

function getUnminConfig() {
  var config = getBaseBuildConfig();
  config.output.filename = 'angular-bluebird-promises.js';
  config.plugins = getUnminPlugins();
  return config;
}

function getMinConfig() {
  var config = getBaseBuildConfig();
  config.output.filename = 'angular-bluebird-promises.min.js';
  config.plugins = getMinPlugins();
  return config;
}

module.exports.getUnminConfig = getUnminConfig;
module.exports.getMinConfig = getMinConfig;
