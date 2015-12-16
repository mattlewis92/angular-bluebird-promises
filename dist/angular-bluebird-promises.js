/**
 * angular-bluebird-promises - Replaces $q with bluebirds promise API
 * @version v1.0.1
 * @link https://github.com/mattlewis92/angular-bluebird-promises
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"), require("bluebird"));
	else if(typeof define === 'function' && define.amd)
		define(["angular", "bluebird"], factory);
	else if(typeof exports === 'object')
		exports["angularBluebirdPromisesModuleName"] = factory(require("angular"), require("bluebird"));
	else
		root["angularBluebirdPromisesModuleName"] = factory(root["angular"], root["Promise"]);
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

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _angular = __webpack_require__(1);

	var _angular2 = _interopRequireDefault(_angular);

	var _bluebird = __webpack_require__(2);

	var _bluebird2 = _interopRequireDefault(_bluebird);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	// In regards to: https://github.com/petkaantonov/bluebird#for-library-authors
	// My reasoning behind not doing this is to prevent bundling bluebird code with this library

	function $qBluebird(resolve, reject) {
	  return new _bluebird2.default(resolve, reject);
	}

	$qBluebird.prototype = _bluebird2.default.prototype;

	_angular2.default.extend($qBluebird, _bluebird2.default);

	//Make bluebird API compatible with angular's subset of Q
	//Adapted from: https://gist.github.com/petkaantonov/8363789 and https://github.com/petkaantonov/bluebird-q

	$qBluebird.defer = function () {
	  var deferred = {};
	  deferred.promise = $qBluebird(function (resolve, reject) {
	    deferred.resolve = resolve;
	    deferred.reject = reject;
	  });
	  deferred.promise.progressCallbacks = [];
	  deferred.notify = function (progressValue) {
	    deferred.promise.progressCallbacks.forEach(function (cb) {
	      return typeof cb === 'function' && cb(progressValue);
	    });
	  };
	  return deferred;
	};

	$qBluebird.reject = $qBluebird.rejected;
	$qBluebird.when = $qBluebird.cast;

	var originalAll = $qBluebird.all;
	$qBluebird.all = function (promises) {

	  if ((typeof promises === 'undefined' ? 'undefined' : _typeof(promises)) === 'object' && !Array.isArray(promises)) {
	    return $qBluebird.props(promises);
	  } else {
	    return originalAll(promises);
	  }
	};

	var originalThen = $qBluebird.prototype.then;
	$qBluebird.prototype.then = function (fulfilledHandler, rejectedHandler, progressHandler) {
	  if (this.progressCallbacks) {
	    this.progressCallbacks.push(progressHandler);
	  }
	  return originalThen.call(this, fulfilledHandler, rejectedHandler, progressHandler);
	};

	var originalFinally = $qBluebird.prototype.finally;
	$qBluebird.prototype.finally = function (finallyHandler, progressHandler) {
	  if (this.progressCallbacks) {
	    this.progressCallbacks.push(progressHandler);
	  }
	  return originalFinally.call(this, finallyHandler);
	};

	$qBluebird.onPossiblyUnhandledRejection(_angular2.default.noop);

	var ngModule = _angular2.default.module('mwl.bluebird', []).constant('Bluebird', $qBluebird).config(["$provide", "Bluebird", function ($provide, Bluebird) {

	  $provide.decorator('$q', function () {
	    return Bluebird;
	  });
	}]).run(["$rootScope", "Bluebird", function ($rootScope, Bluebird) {

	  Bluebird.setScheduler(function (cb) {
	    return $rootScope.$evalAsync(cb);
	  });
	}]);

	exports.default = ngModule.name;
	module.exports = exports['default'];

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