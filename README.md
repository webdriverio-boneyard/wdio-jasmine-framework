WDIO Jasmine [![Build Status](https://travis-ci.org/webdriverio/wdio-jasmine-framework.svg?branch=master)](https://travis-ci.org/webdriverio/wdio-jasmine-framework) [![Code Climate](https://codeclimate.com/github/webdriverio/wdio-jasmine-framework/badges/gpa.svg)](https://codeclimate.com/github/webdriverio/wdio-jasmine-framework) [![Test Coverage](https://codeclimate.com/github/webdriverio/wdio-jasmine-framework/badges/coverage.svg)](https://codeclimate.com/github/webdriverio/wdio-jasmine-framework/coverage)
============

> A WebdriverIO plugin. Adapter for Jasmine testing framework.

## Installation

The easiest way is to keep `wdio-jasmine-framework` as a devDependency in your `package.json`.

```json
{
  "devDependencies": {
    "wdio-jasmine-framework": "~0.2.3"
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
Option to selectively select it/describe cases to run from spec files.

Type: `String[]`<br>
Default: []

## invertGrep
Inverts 'grep' matches

Type: `String[]`<br>
Default: []

----

For more information on WebdriverIO see the [homepage](http://webdriver.io).
