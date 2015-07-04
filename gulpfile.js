var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackHelper = require('./webpackHelper');

gulp.task('watch', ['server'], function() {
  $.livereload.listen();
  gulp.watch('src/*.js', ['build:dev']);
  gulp.watch(['index.html', 'dist/angular-bluebird-promises.js']).on('change', $.livereload.changed);
});

gulp.task('server', function() {
  var PORT = 8000;
  var HOST = 'localhost';
  new WebpackDevServer(webpack(webpackHelper.getDevConfig())).listen(PORT, HOST);
  open('http://' + HOST + ':' + PORT);
});

function webpackCb(done) {
  return function(err, stats) {
    $.util.log('[webpack]', stats.toString());
    for (var file in stats.compilation.assets) {
      if (!stats.compilation.assets[file].emitted) {
        return done(new Error(file + ' was not build as there was an error!'));
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

gulp.task('default', ['watch']);
