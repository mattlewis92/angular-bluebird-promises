# Angular bluebird promises
=========================

## About

This is a drop in replacement for $q that makes the bluebird API compatible with angulars subset of $q then simply swaps it out.

With this module you can use all of bluebirds additional promise methods on the $q service, the full list can be found here:

https://github.com/petkaantonov/bluebird/blob/master/API.md

## Installation

The library obviously depends on angularJS and Bluebird.

It is recommended that you install the library and its dependencies through bower:

```
bower install --save angular-bluebird-promises
```

You will then need to include the JS files for the plugin:

```
<script src="bower_components/bluebird/js/browser/bluebird.js"></script>
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/angular-bluebird-promises/dist/angular-bluebird-promises.min.js">
```

And finally add the module dependency in your AngularJS app:

```javascript
angular.module('myModule', ['mwl.bluebird']);
```

## Usage

Simply use $q as you normally would. It will function exactly as before, however you will now have bluebirds additional API methods available as well on all promises throughout your angular app.

## Example

```javascript
angular.module('mwl.example', ['mwl.bluebird']).run(function($q, $http) {

    var promises = [
        $http.get('test/angular.json'),
        $http.get('test/bluebird.json')
    ];

    //Note the use of spread which isn't available normally on $q
    $q.all(promises).spread(function(angular, bluebird) {

        console.info('\\m/ It worked! \\m/', angular.data.name, bluebird.data.name);

    }).catch(console.error);

});
```
