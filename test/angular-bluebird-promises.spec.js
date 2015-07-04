beforeEach(module('mwl.bluebird'));

describe('$q', function() {

  var $q, $rootScope;

  beforeEach(inject(function(_$q_, _$rootScope_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('defer', function() {

    it('should have the resolve, reject and notify methods', function() {
      var deferred = $q.defer();
      assert.isFunction(deferred.resolve);
      assert.isFunction(deferred.reject);
      assert.isFunction(deferred.notify);
    });

    it('should resolve the promise', function() {
      var deferred = $q.defer();
      var promise = deferred.promise;
      var resolvedValue;
      promise.then(function(value) {
        resolvedValue = value;
      });
      deferred.resolve('Success');
      $rootScope.$apply();
      expect(resolvedValue).to.equal('Success');
    });

    it('should reject the promise', function() {
      var deferred = $q.defer();
      var promise = deferred.promise;
      var rejectedValue;
      promise.catch(function(value) {
        rejectedValue = value;
      });
      deferred.reject('Fail');
      $rootScope.$apply();
      expect(rejectedValue).to.equal('Fail');
    });

    it('should call finally if the promise resolves', function() {
      var deferred = $q.defer();
      var promise = deferred.promise;
      var finallyCb = sinon.spy();
      promise.finally(finallyCb);
      deferred.resolve();
      $rootScope.$apply();
      expect(finallyCb).to.have.been.calledOnce;
    });

    it('should call finally if the promise rejects', function() {
      var deferred = $q.defer();
      var promise = deferred.promise;
      var finallyCb = sinon.spy();
      promise.finally(finallyCb);
      deferred.reject();
      $rootScope.$apply();
      expect(finallyCb).to.have.been.calledOnce;
    });

    it('should allow then to be passed a rejection callback', function() {

      var deferred = $q.defer();
      var promise = deferred.promise;
      var rejectedValue;
      promise.then(angular.noop, function(value) {
        rejectedValue = value;
      });
      deferred.reject('Fail');
      $rootScope.$apply();
      expect(rejectedValue).to.equal('Fail');
    });

    it('should allow then to be passed a notify callback', function() {

      var deferred = $q.defer();
      var promise = deferred.promise;
      var progressValue;
      promise.then(angular.noop, angular.noop, function(progress) {
        progressValue = progress;
      });
      deferred.notify('Progress');
      $rootScope.$apply();
      expect(progressValue).to.equal('Progress');
    });

    it('should notify the promise on progress', function() {
      var deferred = $q.defer();
      var promise = deferred.promise;
      var notifyValues = [];
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
      var deferred = $q.defer();
      assert.isFunction(deferred.promise.then);
      assert.isFunction(deferred.promise.catch);
      assert.isFunction(deferred.promise.finally);
    });

  });

  describe('constructor', function() {

    it('should function as a promise constructor', function() {

      var resolve, reject;
      new $q(function(_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
      });

      assert.isFunction(resolve);
      assert.isFunction(reject);

    });

    it('should give a resolve value that resolves the promise', function() {

      var resolve, reject, resolvedValue;
      var promise = new $q(function(_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
      });

      promise.then(function(_resolvedValue) {
        resolvedValue = _resolvedValue;
      });

      resolve('Resolve');

      $rootScope.$apply();
      expect(resolvedValue).to.equal('Resolve');

    });

    it('should give a reject value that rejects the promise', function() {

      var resolve, reject, rejectedValue;
      var promise = new $q(function(_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
      });

      promise.catch(function(_rejectedValue) {
        rejectedValue = _rejectedValue;
      });

      reject('Reject');

      $rootScope.$apply();
      expect(rejectedValue).to.equal('Reject');

    });

  });

  describe('reject', function() {

    it('should wrap a value as a promise which rejects', function() {

      var rejectedPromise = $q.reject('Reject'), rejectedValue;
      rejectedPromise.catch(function(_rejectedValue) {
        rejectedValue = _rejectedValue;
      });
      $rootScope.$apply();
      expect(rejectedValue).to.equal('Reject');

    });

  });

  describe('when', function() {

    it('should wrap a value as a promise which resolves', function() {

      var rejectedPromise = $q.resolve('Resolve'), resolvedValue;
      rejectedPromise.then(function(_resolvedValue) {
        resolvedValue = _resolvedValue;
      });

      $rootScope.$apply();
      expect(resolvedValue).to.equal('Resolve');

    });

  });

  describe('all', function() {

    it('should return an array of results when passed an array', function() {

      var results;
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

      var results;
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
      var deferred = $q.defer();
      var promise = deferred.promise;
      var resolvedValue;
      promise.then(function(value) {
        resolvedValue = value;
      });
      expect(resolvedValue).to.be.undefined;
      deferred.resolve('Success');
      expect(resolvedValue).to.be.undefined;
      $rootScope.$apply();
      expect(resolvedValue).to.equal('Success');

    });

    it('$q should be bluebird', function() {
      expect($q).to.eql(Promise);
    });

  });

  describe('Bluebird methods', function() {

    it('should add the spread method to promise', function() {
      var deferred = $q.when();
      assert.isFunction(deferred.spread);
    });

  });


});
