# flatiron-cli-config

Encapsulated commands for managing configuration in flatiron CLI apps

## Example
At its core `flatiron-cli-config` is a broadway-compatible plugin which can be used by any `flatiron` application:

``` js
  var flatiron = require('flatiron'),
      app = flatiron.app;

  //
  // Configure the Application to be a CLI app with
  // a JSON configuration file `test-config.json`
  //
  app.name = 'app.js';
  app.config.file({ file: 'test-config.json' });
  app.use(flatiron.plugins.cli, {
    usage: 'A simple CLI app using flatiron-cli-config'
  });

  //
  // Expose CLI commands using `flatiron-cli-config`
  //
  app.use(require('flatiron-cli-config'));

  if (!module.parent) {
    //
    // Start the application
    //
    app.start();
  }
```

If you run the above script:

``` bash
  $ node app.js config set foo bar
  $ node app.js config get foo
```

The output will be:

```
  data: foo bar
```

And the contents of `test-config.json` will be:

```
  { "foo": "bar" }
```

## API Documentation

### Commands exposed

``` bash
  $ node examples/app.js help config
  help:   `app.js config *` commands allow you to edit your
  help:   local app.js configuration file. Valid commands are:
  help:
  help:   app.js config list
  help:   app.js config set    <key> <value>
  help:   app.js config get    <key>
  help:   app.js config delete <key>
```

### Options

``` js
  {
    //
    // Name of the store in `app.config` to use for `config list`. [Default: all config]
    //
    store: 'file'

    //
    // Set of properties which cannot be deleted using `config delete <key>`
    //
    restricted: ['foo', 'bar'],

    //
    // Set of functions which will execute before named commands: get, set, list, delete
    //
    before: { list: function () { ... } }
  }
```

## Installation

### Installing npm (node package manager)
```
  curl http://npmjs.org/install.sh | sh
```

### Installing flatiron-cli-config
```
  [sudo] npm install flatiron-cli-config
```

## Run Tests
Tests are written in vows and give complete coverage of all APIs and storage engines.

``` bash
  $ npm test
```

#### Author: [Charlie Robbins](http://nodejitsu.com)
#### License: MIT