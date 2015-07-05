var webpack = require('webpack');
var ejs = require('ejs');

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

module.exports = {
  entry: __dirname + '/src/angular-bluebird-promises.js',
  output: {
    path: __dirname + '/dist',
    filename: process.argv.indexOf('-p') > -1 ? 'angular-bluebird-promises.min.js' : 'angular-bluebird-promises.js'
  },
  externals: {
    angular: 'angular',
    bluebird: 'Promise'
  },
  devtool: 'source-map',
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
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.BannerPlugin(getBanner(), {
      raw: true,
      entryOnly: true
    })
  ]
};
