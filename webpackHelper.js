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

function getDevPlugins() {
  var plugins = [];
  plugins.push(new webpack.BannerPlugin(getBanner(), {
    raw: true,
    entryOnly: true
  }));
  return plugins;
}

function getProdPlugins() {
  var plugins = [];
  plugins.push(new webpack.NoErrorsPlugin());
  plugins.push(new webpack.optimize.UglifyJsPlugin());
  plugins = plugins.concat(getDevPlugins());
  return plugins;
}

function getKarmaConfig(prod) {
  var config = getBaseConfig();
  config.devtool = 'inline-source-map';
  if (prod) {
    config.module.loaders = [{
      test: /.*src.*\.js$/,
      loaders: ['uglify'],
      exclude: /node_modules/
    }].concat(config.module.loaders);
  }
  return config;
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

function getDevConfig() {
  var config = getBaseBuildConfig();
  config.output.filename = 'angular-bluebird-promises.js';
  config.plugins = getDevPlugins();
  return config;
}

function getProdConfig() {
  var config = getBaseBuildConfig();
  config.output.filename = 'angular-bluebird-promises.min.js';
  config.plugins = getProdPlugins();
  return config;
}

module.exports.getKarmaConfig = getKarmaConfig;
module.exports.getDevConfig = getDevConfig;
module.exports.getProdConfig = getProdConfig;
