var gulp = require('gulp');
var open = require('open');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackHelper = require('./webpackHelper');

gulp.task('server', function() {
  var PORT = 8000;
  var HOST = 'localhost';
  var config = webpackHelper.getDevConfig();
  delete config.externals;
  new WebpackDevServer(webpack(config)).listen(PORT, HOST);
  open('http://' + HOST + ':' + PORT);
});

function webpackCb(done) {
  return function(err, stats) {
    console.log('[webpack]', stats.toString());
    for (var file in stats.compilation.assets) {
      if (!stats.compilation.assets[file].emitted) {
        return done(new Error(file + ' was not built as there was an error!'));
      }
    }
  }
}

gulp.task('build:dev', function(done) {
  webpack(webpackHelper.getDevConfig(), webpackCb(done));
});

gulp.task('build:prod', function(done) {
  webpack(webpackHelper.getProdConfig(), webpackCb(done));
});

gulp.task('default', ['server']);
