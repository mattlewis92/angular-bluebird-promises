(function(angular, P) {

  'use strict';

  angular
    .module('mwl.bluebird', [])
    .constant('Bluebird', P.noConflict())
    .config(function($provide, Bluebird) {

      //Make bluebird API compatible with angular's subset of $q
      //Adapted from: https://gist.github.com/petkaantonov/8363789

      Bluebird.defer = function() {
        var b = Bluebird.pending();
        b.resolve = angular.bind(b, b.fulfill);
        b.reject = angular.bind(b, b.reject);
        b.notify = angular.bind(b, b.progress);
        return b;
      };

      Bluebird.reject = Bluebird.rejected;
      Bluebird.when = Bluebird.cast;

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

}(angular, P));
