/**
 * angular-bluebird-promises - Replaces $q with bluebirds promise API
 * @version v0.3.6
 * @link https://github.com/mattlewis92/angular-bluebird-promises
 * @license MIT
 */
(function(angular, window) {

  'use strict';

  angular
    .module('mwl.bluebird', [])
    .constant('Bluebird', window.P.noConflict())
    .config(["$provide", "Bluebird", function($provide, Bluebird) {

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
          return Bluebird.props(promises);
        } else {
          return originalAll.call(Bluebird, promises);
        }

      };

      Bluebird.onPossiblyUnhandledRejection(angular.noop);

      $provide.decorator('$q', function() {
        return Bluebird;
      });

    }]).run(["$rootScope", "Bluebird", function($rootScope, Bluebird) {

      Bluebird.setScheduler(function(cb) {
        $rootScope.$evalAsync(cb);
      });

    }]);

}(angular, window));
