import 'babel-polyfill';
import angular from 'angular';
import 'angular-mocks';
import './../src/angular-bluebird-promises.js';

beforeEach(angular.mock.module('mwl.bluebird'));

describe('$q', function() {

  let $q, $rootScope;

  beforeEach(inject(function(_$q_, _$rootScope_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('defer', function() {

    it('should have the resolve, reject and notify methods', function() {
      const deferred = $q.defer();
      assert.isFunction(deferred.resolve);
      assert.isFunction(deferred.reject);
      assert.isFunction(deferred.notify);
    });

    it('should resolve the promise', function() {
      const deferred = $q.defer();
      const promise = deferred.promise;
      let resolvedValue;
      promise.then(function(value) {
        resolvedValue = value;
      });
      deferred.resolve('Success');
      $rootScope.$apply();
      expect(resolvedValue).to.equal('Success');
    });

    it('should reject the promise', function() {
      const deferred = $q.defer();
      const promise = deferred.promise;
      let rejectedValue;
      promise.catch(function(value) {
        rejectedValue = value;
      });
      const rejectWith = new Error('Fail');
      deferred.reject(rejectWith);
      $rootScope.$apply();
      expect(rejectedValue).to.equal(rejectWith);
    });

    it('should call finally if the promise resolves', function() {
      const deferred = $q.defer();
      const promise = deferred.promise;
      const finallyCb = sinon.spy();
      promise.finally(finallyCb);
      deferred.resolve();
      $rootScope.$apply();
      expect(finallyCb).to.have.been.calledOnce;
    });

    it('should call finally if the promise rejects', function() {
      const deferred = $q.defer();
      const promise = deferred.promise;
      const finallyCb = sinon.spy();
      promise.finally(finallyCb);
      deferred.reject(new Error());
      $rootScope.$apply();
      expect(finallyCb).to.have.been.calledOnce;
    });

    it('should allow then to be passed a rejection callback', function() {

      const deferred = $q.defer();
      const promise = deferred.promise;
      let rejectedValue;
      promise.then(angular.noop, function(value) {
        rejectedValue = value;
      });
      const rejectWith = new Error('Fail');
      deferred.reject(rejectWith);
      $rootScope.$apply();
      expect(rejectedValue).to.equal(rejectWith);
    });

    it('should allow then to be passed a notify callback', function() {

      const deferred = $q.defer();
      const promise = deferred.promise;
      let progressValue;
      promise.then(angular.noop, angular.noop, function(progress) {
        progressValue = progress;
      });
      deferred.notify('Progress');
      $rootScope.$apply();
      expect(progressValue).to.equal('Progress');
    });

    it('should notify the promise on progress', function() {
      const deferred = $q.defer();
      const promise = deferred.promise;
      const notifyValues = [];
      promise.finally(angular.noop, function(progress) {
        notifyValues.push(progress);
      });
      deferred.notify('Progress');
      $rootScope.$apply();
      expect(notifyValues).to.eql(['Progress']);
      deferred.notify('Progress2');
      $rootScope.$apply();
      expect(notifyValues).to.eql(['Progress', 'Progress2']);
    });

    it('should have a promise property which is a promise', function() {
      const deferred = $q.defer();
      assert.isFunction(deferred.promise.then);
      assert.isFunction(deferred.promise.catch);
      assert.isFunction(deferred.promise.finally);
    });

  });

  describe('constructor', function() {

    it('should function as a promise constructor', function() {

      let resolve, reject;
      const promise = $q(function(_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
      });

      assert.isFunction(resolve);
      assert.isFunction(reject);
      assert.isFunction(promise.then);
      assert.isFunction(promise.catch);
      assert.isFunction(promise.finally);

    });

    it('should give a resolve value that resolves the promise', function() {

      let resolve, resolvedValue;
      const promise = $q(function(_resolve) {
        resolve = _resolve;
      });

      promise.then(function(_resolvedValue) {
        resolvedValue = _resolvedValue;
      });

      resolve('Resolve');

      $rootScope.$apply();
      expect(resolvedValue).to.equal('Resolve');

    });

    it('should give a reject value that rejects the promise', function() {

      let reject, rejectedValue;
      const promise = $q(function(_resolve, _reject) {
        reject = _reject;
      });

      promise.catch(function(_rejectedValue) {
        rejectedValue = _rejectedValue;
      });

      const rejectWith = new Error('Reject');

      reject(rejectWith);

      $rootScope.$apply();
      expect(rejectedValue).to.equal(rejectWith);

    });

  });

  describe('reject', function() {

    it('should wrap a value as a promise which rejects', function() {

      const rejectWith = new Error('Reject');
      let rejectedPromise = $q.reject(rejectWith), rejectedValue;
      rejectedPromise.catch(function(_rejectedValue) {
        rejectedValue = _rejectedValue;
      });
      $rootScope.$apply();
      expect(rejectedValue).to.equal(rejectWith);

    });

  });

  describe('when', function() {

    it('should wrap a value as a promise which resolves', function() {

      let rejectedPromise = $q.resolve('Resolve'), resolvedValue;
      rejectedPromise.then(function(_resolvedValue) {
        resolvedValue = _resolvedValue;
      });

      $rootScope.$apply();
      expect(resolvedValue).to.equal('Resolve');

    });

  });

  describe('all', function() {

    it('should return an array of results when passed an array', function() {

      let results;
      $q.all([
        $q.resolve(1),
        $q.resolve(2)
      ]).then(function(_results) {
        results = _results;
      });

      $rootScope.$apply();

      expect(results).to.eql([1, 2]);

    });

    it('should return an object of results when passed an object of promises', function() {

      let results;
      $q.all({
        item1: $q.resolve(1),
        item2: $q.resolve(2)
      }).then(function(_results) {
        results = _results;
      });

      $rootScope.$apply();

      expect(results).to.eql({item1: 1, item2: 2});

    });

  });

  describe('angular integration', function() {

    it('should only resolve promises after a digest', function() {
      const deferred = $q.defer();
      const promise = deferred.promise;
      let resolvedValue;
      promise.then(function(value) {
        resolvedValue = value;
      });
      expect(resolvedValue).to.be.undefined;
      deferred.resolve('Success');
      expect(resolvedValue).to.be.undefined;
      $rootScope.$apply();
      expect(resolvedValue).to.equal('Success');

    });

  });

  describe('Bluebird methods', function() {

    it('should add the spread method to promise', function() {
      const deferred = $q.when();
      assert.isFunction(deferred.spread);
    });

  });

});
