# Angular bluebird promises

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

## Development

### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM (should come with)
* Install global dev dependencies: `npm install -g gulp`
* Install local dev dependencies: `npm install` while current directory is this repo

### Build
Run `gulp` to build the project files in the dist folder

### Development server
Run `gulp watch` to start a development server with livereload on port 8000.

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
