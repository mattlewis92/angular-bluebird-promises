(function(angular, Promise) {

  angular
    .module('mwl.bluebird', [])
    .constant('Bluebird', Promise)
    .config(function($provide, Bluebird) {

      //Make bluebird API compatible with angular's subset of $q
      //Adapted from: http://bit.ly/1zffMKH
      function bind(fn, ctx) {
        return function() {
          return fn.apply(ctx, arguments);
        };
      }

      Bluebird.defer = function() {
        var b = Bluebird.pending();
        b.resolve = bind(b.fulfill, b);
        b.reject = bind(b.reject, b);
        b.notify = bind(b.progress, b);
        return b;
      };

      Bluebird.reject = Bluebird.rejected;

      Bluebird.when = function(a) {
        return Bluebird.cast(a);
      };

      Bluebird.onPossiblyUnhandledRejection(angular.noop);

      $provide.decorator('$q', function() {
        return Bluebird;
      });

    }).run(function($rootScope, Bluebird) {

      Bluebird.setScheduler(function(cb) {
        $rootScope.$evalAsync(cb);
      });

    });

})(angular, Promise);