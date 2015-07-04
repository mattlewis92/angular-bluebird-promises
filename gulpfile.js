var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');
var bowerFiles = require('main-bower-files');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var ejs = require('ejs');
var karma = require('karma').server;

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

gulp.task('default', ['watch']);

function runTests(config, onDistCode, done) {
  config.configFile = __dirname + '/karma.conf.js';
  config.files = bowerFiles({includeDev: true});
  if (onDistCode) {
    config.files.push('dist/angular-bluebird-promises.min.js');
  } else {
    config.files.push('dist/angular-bluebird-promises.js');
  }
  config.files.push('test/angular-bluebird-promises.spec.js');

  karma.start(config, done);
}

gulp.task('test:dev', ['build:dev'], function(done) {
  runTests({}, false, done);
});

gulp.task('test:prod', ['build:prod'], function(done) {
  runTests({}, true, done);
});

gulp.task('test:watch', function(done) {
  runTests({autoWatch: true, singleRun: false}, false, done);
});

gulp.task('ci', ['test:prod']);
