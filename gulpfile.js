var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');
var bowerFiles = require('main-bower-files');
var series = require('stream-series');

gulp.task('watch', ['server'], function() {
  $.livereload.listen();
  gulp.watch(['./index.html', './docs/**', './src/**']).on('change', $.livereload.changed);
});

gulp.task('server', function() {
  $.connect.server({
    root: ['./'],
    port: 8000,
    livereload: false
  });

  open('http://localhost:8000');
});

gulp.task('build', function() {

  return gulp.src('src/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.ngAnnotate())
    .pipe($.concat('angular-bluebird-promises.min.js'))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));

});

gulp.task('default', ['build']);

function runTests(action, onDistCode) {
  var vendorJs = gulp.src(bowerFiles({includeDev: true}));
  if (onDistCode) {
    var appJs = gulp.src('dist/angular-bluebird-promises.min.js');
  } else {
    var appJs = gulp.src('src/angular-bluebird-promises.js');
  }
  var test = gulp.src('test/angular-bluebird-promises.spec.js');

  return series(vendorJs, appJs, test)
    .pipe($.karma({
      configFile: 'karma.conf.js',
      action: action
    }));
}

gulp.task('test:src', function() {
  return runTests('run').on('error', function(err) {
    throw err;
  });
});

gulp.task('test:dist', function() {
  return runTests('run', true).on('error', function(err) {
    throw err;
  });
});

gulp.task('test:watch', function() {
  return runTests('watch');
});
