'use strict';

var angular = require('angular');
var Promise = require('bluebird');

// In regards to: https://github.com/petkaantonov/bluebird#for-library-authors
// My reasoning behind not doing this is to prevent bundling bluebird code with this library

function $qBluebird(resolve, reject) {
  return new Promise(resolve, reject);
}

$qBluebird.prototype = Promise.prototype;

angular.extend($qBluebird, Promise);

//Make bluebird API compatible with angular's subset of Q
//Adapted from: https://gist.github.com/petkaantonov/8363789 and https://github.com/petkaantonov/bluebird-q

$qBluebird.defer = function() {
  var b = $qBluebird.pending();
  b.resolve = angular.bind(b, b.fulfill);
  b.reject = angular.bind(b, b.reject);
  b.notify = angular.bind(b, b.progress);
  return b;
};

$qBluebird.reject = $qBluebird.rejected;
$qBluebird.when = $qBluebird.cast;

var originalAll = $qBluebird.all;
$qBluebird.all = function(promises) {

  if (angular.isObject(promises) && !angular.isArray(promises)) {
    return $qBluebird.props(promises);
  } else {
    return originalAll.call($qBluebird, promises);
  }

};

var originalFinally = $qBluebird.prototype.finally;
$qBluebird.prototype.finally = function(finallyCallback, progressCallback) {
  this.progressed(progressCallback);
  return originalFinally.call(this, finallyCallback);
};

$qBluebird.onPossiblyUnhandledRejection(angular.noop);

var ngModule = angular
  .module('mwl.bluebird', [])
  .constant('Bluebird', $qBluebird)
  .config(function($provide, Bluebird) {

    $provide.decorator('$q', function() {
      return Bluebird;
    });

  })
  .run(function($rootScope, Bluebird) {

    Bluebird.setScheduler(function(cb) {
      $rootScope.$evalAsync(cb);
    });

  });

module.exports = ngModule.name;
