'use strict';

var angular = require('angular');
var bluebird = require('bluebird');
var MODULE_NAME = 'mwl.bluebird';

angular
  .module(MODULE_NAME, [])
  .constant('Bluebird', bluebird)
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
        return Bluebird.props(promises);
      } else {
        return originalAll.call(Bluebird, promises);
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

module.exports = MODULE_NAME;
