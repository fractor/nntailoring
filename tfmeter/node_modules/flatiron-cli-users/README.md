# flatiron-cli-users

Encapsulated commands for managing users in [flatiron][0] CLI apps

## Example
At its core [flatiron-cli-users][1] is a broadway-compatible plugin which can be used by any [flatiron][0] application:

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
    usage: 'A simple CLI app using flatiron-cli-users'
  });

  //
  // Expose CLI commands using `flatiron-cli-users`
  //
  app.use(require('flatiron-cli-users'));
  
  if (!module.parent) {
    //
    // Start the application
    //
    app.start();
  }
```

If you run the above script:

``` bash
  $ node app.js users create
```

The output will be:

``` bash
  help:   To signup, first you will need to provide a username
  prompt: username: foobar
  help:   Next, we will require your email address
  prompt: email: email@test.com
  help:   Finally, we will need a password for this account
  prompt: password: 
  prompt: confirm password: 
  info:   You account is now being created
  info:   Account creation successful!
```

And the contents of `test-config.json` will have the specified user information. 

## API Documentation

### Expected API endpoints

This `flatiron` plugin expects an API endpoint to be present on the application through `app.users`. You may implement this API endpoint however you wish. We would suggest using [resourceful][2] and [director][3], but you are free to use [express][4] or other node.js frameworks.

**app.users.auth(function (err, result))**

Responds with a valid indicating if the current user is authenticated.

**app.users.availabile(username, function (err, result))**

Responds with a valid indicating if the desired username is available.

**app.users.create(user, function (err, result))**

Creates a user with the specified properties.

**app.users.update(username, props, function (err, result))**

Updates the user with `username` with specified `props`.

**app.users.forgot(username, props, function (err, result))**

Attempts to reset the password for the `username` with the specified `props`

### Commands exposed

``` bash
  $ node examples/app.js help users
  help:   `app.js users *` commands allow you to work with new
  help:   or existing user accounts.
  help:   
  help:   app.js users available <username>
  help:   app.js users changepassword
  help:   app.js users confirm <username> <inviteCode>
  help:   app.js users create
  help:   app.js users forgot <username> <shake>
  help:   app.js users login
  help:   app.js users logout
  help:   app.js users whoami
  help:   
  help:   You will be prompted for additional user information
  help:   as required.
```

### Options

``` js
  {
    //
    // Set of functions which will execute after named commands: create, login, logout, etc.
    //
    after: { login: function () { ... } },

    //
    // Set of functions which will execute before named commands: create, login, logout, etc.
    //
    before: { login: function () { ... } }
  }
```

## Installation

### Installing npm (node package manager)

``` bash
  $ curl http://npmjs.org/install.sh | sh
```

### Installing flatiron-cli-users

``` bash
  $ [sudo] npm install flatiron-cli-users
```

## Run Tests
Tests are written in vows and give complete coverage of all APIs and storage engines.

``` bash
  $ npm test
```

#### Author: [Charlie Robbins](http://nodejitsu.com)
#### License: MIT

[0]: http://flatironjs.org
[1]: http://github.com/flatiron/flatiron-cli-users
[2]: http://github.com/flatiron/resourceful
[3]: http://github.com/flatiron/director
[4]: http://expressjs.org