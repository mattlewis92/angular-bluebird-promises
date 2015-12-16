# Angular bluebird promises

[![Build Status](https://travis-ci.org/mattlewis92/angular-bluebird-promises.svg?branch=master)](https://travis-ci.org/mattlewis92/angular-bluebird-promises)
[![Bower version](https://badge.fury.io/bo/angular-bluebird-promises.svg)](http://badge.fury.io/bo/angular-bluebird-promises)
[![npm version](https://badge.fury.io/js/angular-bluebird-promises.svg)](http://badge.fury.io/js/angular-bluebird-promises)
[![devDependency Status](https://david-dm.org/mattlewis92/angular-bluebird-promises/dev-status.svg)](https://david-dm.org/mattlewis92/angular-bluebird-promises#info=devDependencies)
[![Codacy Badge](https://www.codacy.com/project/badge/b62fc2d7f4cb486d9a9a81945d236843)](https://www.codacy.com/app/matt-lewis-private/angular-bluebird-promises)

This is a drop in replacement for $q that makes the bluebird API compatible with angulars subset of $q then simply swaps it out.

With this module you can use all of bluebirds additional promise methods on the $q service, the full list can be found here:

http://bluebirdjs.com/docs/api-reference.html

## Installation

The library depends on angularJS and Bluebird.

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
angular.module('myApp', ['mwl.bluebird']);
```

Alternatively you can install through npm:
```
npm install --save angular-bluebird-promises
```

Then add as a dependency to your app:

```javascript
angular.module('myApp', [require('angular-bluebird-promises')]);
```

By default the value of onPossiblyUnhandledRejection is set to angular.noop. You **can and should** override this with your own handler in order to catch uncaught errors. For example:

```javascript
angular.module('mwl.bluebird').run(function($q, $log) {
  $q.onPossiblyUnhandledRejection(function(err) {
    $log.warn('Unhandled rejection', err);
  });
});
```

If using the [ui-router](https://github.com/angular-ui/ui-router) this will produce some noise. To get around this you can do something like:
```javascript
$q.onPossiblyUnhandledRejection(function(exception) {
  if (exception.message.match(/transition (superseded|prevented|aborted|failed)/)) {
    return;
  }
  // Handle exception
});
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

## Development

### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM (should come with)
* Install local dev dependencies: `npm install` while current directory is this repo

### Build
Run `npm run build` to build the project files in the dist folder

### Development server
Run `npm start` to start a development server with auto reload that will also run unit tests

## License

The MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
