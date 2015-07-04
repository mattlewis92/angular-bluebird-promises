var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');
var bowerFiles = require('main-bower-files');
var series = require('stream-series');
var runSequence = require('run-sequence');
var webpack = require('webpack');
var ejs = require('ejs');

gulp.task('watch', ['server'], function() {
  $.livereload.listen();
  gulp.start('test:watch');
  gulp.watch('src/*.js', ['eslint', 'webpack']);
  gulp.watch(['index.html', 'dist/angular-bluebird-promises.js']).on('change', $.livereload.changed);
});

gulp.task('server', function() {
  $.connect.server({
    root: ['./'],
    port: 8000,
    livereload: false
  });

  open('http://localhost:8000');
});

var pkg = require('./bower.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('webpack', function(done) {
  var bannerCompiled = ejs.render(banner, {pkg: pkg});

  webpack({
    entry: './src/angular-bluebird-promises.js',
    output: {
      path: './dist',
      filename: 'angular-bluebird-promises.js'
    },
    externals: {
      angular: 'angular',
      bluebird: 'Promise'
    },
    devtool: 'source-map',
    plugins: [
      new webpack.BannerPlugin(bannerCompiled, {
        raw: true,
        entryOnly: true
      })
    ],
    module: {
      loaders: [
        {test: /.*\.js$/, loaders: ['ng-annotate']}
      ]
    }
  }, done);
});

gulp.task('build', ['webpack'], function() {

  return gulp.src('dist/angular-bluebird-promises.js')
    .pipe($.sourcemaps.init({
      loadMaps: true
    }))
    .pipe($.rename('angular-bluebird-promises.min.js'))
    .pipe($.uglify())
    .pipe($.header(banner, { pkg : pkg } ))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));

});

gulp.task('default', ['build']);

function runTests(action, onDistCode) {
  var vendorJs = gulp.src(bowerFiles({includeDev: true}));
  if (onDistCode) {
    var appJs = gulp.src('dist/angular-bluebird-promises.min.js');
  } else {
    var appJs = gulp.src('dist/angular-bluebird-promises.js');
  }
  var test = gulp.src('test/angular-bluebird-promises.spec.js');

  return series(vendorJs, appJs, test)
    .pipe($.karma({
      configFile: 'karma.conf.js',
      action: action
    }));
}

gulp.task('test:src', ['webpack'], function() {
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

function eslint(failOnError) {
  var stream = gulp.src(['src/*.js'])
    .pipe($.eslint())
    .pipe($.eslint.format());

  if (failOnError) {
    return stream.pipe($.eslint.failOnError());
  } else {
    return stream;
  }
}

gulp.task('eslint', function() {
  return eslint();
});

gulp.task('ci:eslint', function() {
  return eslint(true);
});

gulp.task('ci', function(done) {
  runSequence('ci:eslint', 'build', 'test:dist', done);
});
