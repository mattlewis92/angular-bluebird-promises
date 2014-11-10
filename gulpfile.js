var gulp = require('gulp');
var gp = require('gulp-load-plugins')();
var open = require("open");

gulp.task('watch', ['server'], function() {
  gp.livereload.listen();
  gulp.watch(['./index.html', './docs/**', './src/**']).on('change', gp.livereload.changed);
});

gulp.task('server', function() {
  gp.connect.server({
    root: ['./'],
    port: 8000,
    livereload: false
  });

  open('http://localhost:8000');
});

gulp.task('build', function() {

  return gulp.src('src/*.js')
    .pipe(gp.ngAnnotate())
    .pipe(gp.sourcemaps.init())
    .pipe(gp.concat('angular-bluebird-promises.min.js'))
    .pipe(gp.uglify())
    .pipe(gp.sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));

});

gulp.task('default', ['build'], function() {});