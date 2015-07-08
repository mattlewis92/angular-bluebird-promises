/**
 * angular-bluebird-promises - Replaces $q with bluebirds promise API
 * @version v0.5.2
 * @link https://github.com/mattlewis92/angular-bluebird-promises
 * @license MIT
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"), require("bluebird"));
	else if(typeof define === 'function' && define.amd)
		define(["angular", "bluebird"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("angular"), require("bluebird")) : factory(root["angular"], root["Promise"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(1);
	var bluebird = __webpack_require__(2);
	var MODULE_NAME = 'mwl.bluebird';

	angular
	  .module(MODULE_NAME, [])
	  .constant('Bluebird', bluebird)
	  .config(["$provide", "Bluebird", function($provide, Bluebird) {

	    //Make bluebird API compatible with angular's subset of Q
	    //Adapted from: https://gist.github.com/petkaantonov/8363789 and https://github.com/petkaantonov/bluebird-q

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

	    var originalFinally = Bluebird.prototype.finally;
	    Bluebird.prototype.finally = function(finallyCallback, progressCallback) {
	      this.progressed(progressCallback);
	      return originalFinally.call(this, finallyCallback);
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

	module.exports = MODULE_NAME;


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }
/******/ ])
});
;