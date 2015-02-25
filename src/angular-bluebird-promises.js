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

      var originalAll = Bluebird.all;
      Bluebird.all = function(promises) {

        if (angular.isObject(promises) && !angular.isArray(promises)) {

          var promiseArray = [], promiseKeysArray = [];
          angular.forEach(promises, function(promise, key) {

            promiseKeysArray.push(key);
            promiseArray.push(promise);

          });

          return originalAll(promiseArray).then(function(results) {

            var objectResult = {};
            angular.forEach(results, function(result, index) {
              objectResult[promiseKeysArray[index]] = result;
            });
            return objectResult;

          });

        } else {
          return originalAll(promises);
        }

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