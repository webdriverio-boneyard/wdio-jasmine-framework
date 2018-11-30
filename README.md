WDIO Jasmine Framework Adapter
==============================

[![Build Status](https://travis-ci.org/webdriverio/wdio-jasmine-framework.svg?branch=master)](https://travis-ci.org/webdriverio/wdio-jasmine-framework) [![Test Coverage](https://codeclimate.com/github/webdriverio/wdio-jasmine-framework/badges/coverage.svg)](https://codeclimate.com/github/webdriverio/wdio-jasmine-framework/coverage) [![dependencies Status](https://david-dm.org/webdriverio/wdio-jasmine-framework/status.svg)](https://david-dm.org/webdriverio/wdio-jasmine-framework)

***

> A WebdriverIO plugin. Adapter for Jasmine testing framework.

## Installation

The easiest way is to keep `wdio-jasmine-framework` as a devDependency in your `package.json`.

```json
{
  "devDependencies": {
    "wdio-jasmine-framework": "~0.2.20"
  }
}
```

You can simple do it by:

```bash
npm install wdio-jasmine-framework --save-dev
```

Instructions on how to install `WebdriverIO` can be found [here.](http://webdriver.io/guide/getstarted/install.html)

## Configuration

Following code shows the default wdio test runner configuration...

```js
// wdio.conf.js
module.exports = {
  // ...
  framework: 'jasmine'
  jasmineNodeOpts: {
    defaultTimeoutInterval: 10000
  }
  // ...
};
```

## `jasmineNodeOpts` Options

### defaultTimeoutInterval
Timeout until specs will be marked as failed.

Type: `Number`<br>
Default: 10000

### expectationResultHandler
The Jasmine framework allows it to intercept each assertion in order to log the state of the application
or website depending on the result. For example it is pretty handy to take a screenshot every time
an assertion fails.

Type: `Function`<br>
Default: null

### grep
Optional pattern to selectively select it/describe cases to run from spec files.

Type: `RegExp | string`<br>
Default: undefined

### invertGrep
Inverts 'grep' matches

Type: `Boolean`<br>
Default: false

### cleanStack
Cleans up stack trace and removes all traces of node module packages

Type: `Boolean`<br>
Default: true  

### random  
Run specs in semi-random order  

Type: `Boolean`<br>
Default: `false`

### stopOnSpecFailure
Stops spec execution on first fail (other specs continue running)

Type: `Boolean`<br>
Default: `false`

## Development

All commands can be found in the package.json. The most important are:

Watch changes:

```sh
$ npm run watch
```

Run tests:

```sh
$ npm test

# run test with coverage report:
$ npm run test:cover
```

Build package:

```sh
$ npm build
```

----

For more information on WebdriverIO see the [homepage](http://webdriver.io).