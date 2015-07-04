var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');
var bowerFiles = require('main-bower-files');
var series = require('stream-series');
var runSequence = require('run-sequence');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var ejs = require('ejs');

gulp.task('watch', ['server'], function() {
  $.livereload.listen();
  gulp.start('test:watch');
  gulp.watch('src/*.js', ['build:dev']);
  gulp.watch(['index.html', 'dist/angular-bluebird-promises.js']).on('change', $.livereload.changed);
});

gulp.task('server', function() {
  var PORT = 8000;
  var HOST = 'localhost';
  new WebpackDevServer(buildSource()).listen(PORT, HOST);
  open('http://' + HOST + ':' + PORT);
});

var pkg = require('./bower.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

function buildSource(production, done) {
  var bannerCompiled = ejs.render(banner, {pkg: pkg});
  var filename = production ? 'angular-bluebird-promises.min.js' : 'angular-bluebird-promises.js';

  var plugins = [];
  if (production) {
    plugins.push(new webpack.NoErrorsPlugin());
    plugins.push(new webpack.optimize.UglifyJsPlugin());
  }
  plugins.push(new webpack.BannerPlugin(bannerCompiled, {
    raw: true,
    entryOnly: true
  }));

  var callback;
  if (done) {
    callback = function(err, stats) {
      $.util.log('[webpack]', stats.toString());
      for (var file in stats.compilation.assets) {
        if (!stats.compilation.assets[file].emitted) {
          return done(new Error(file + ' was not build as there was an error!'));
        }
      }
      done(err);
    }
  }

  return webpack({
    cache: true,
    entry: __dirname + '/src/angular-bluebird-promises.js',
    output: {
      path: __dirname + '/dist',
      filename: filename
    },
    externals: {
      angular: 'angular',
      bluebird: 'Promise'
    },
    devtool: 'source-map',
    plugins: plugins,
    module: {
      preLoaders: [
        {test: /.*\.js$/, loaders: ['eslint'], exclude: /node_modules/}
      ],
      loaders: [
        {test: /.*\.js$/, loaders: ['ng-annotate'], exclude: /node_modules/}
      ]
    },
    eslint: {
      configFile: __dirname + '/.eslintrc'
    }
  }, callback);
}

gulp.task('build:dev', function(done) {
  buildSource(false, done);
});

gulp.task('build:prod', function(done) {
  buildSource(true, done);
});

gulp.task('default', ['build:prod']);

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

gulp.task('test:dev', ['build:dev'], function() {
  return runTests('run').on('error', function(err) {
    throw err;
  });
});

gulp.task('test:prod', function() {
  return runTests('run', true).on('error', function(err) {
    throw err;
  });
});

gulp.task('test:watch', function() {
  return runTests('watch');
});

gulp.task('ci', function(done) {
  runSequence('build:prod', 'test:prod', done);
});
