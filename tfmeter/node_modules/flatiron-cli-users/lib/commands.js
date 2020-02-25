/*
 * commands.js: CLI Commands related to managing users.
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */

var cliUsers = require('./flatiron-cli-users'),
    common = require('flatiron').common,
    async = common.async;

exports.usage = [
  '`<app> users *` commands allow you to work with new',
  'or existing user accounts',
  '',
  '<app> users available <username>',
  '<app> users changepassword',
  '<app> users create',
  '<app> users forgot <username> <shake>',
  '<app> users login',
  '<app> users logout',
  '<app> users whoami',
  '',
  'You will be prompted for additional user information',
  'as required.'
];

//
// ### function available (username, callback)
// #### @username {string} Desired username to check
// #### @callback {function} Continuation to pass control to when complete.
// Checks the availability of the specified `username`.
//
exports.available = function (username, callback) {
  if (!username) {
    return callback(new Error('Username is required'), true);
  }

  var app = cliUsers.app;

  app.log.info('Checking availability for ' + username.magenta);
  app.users.available(username, function (err, result) {
    if (err) {
      return callback(err);
    }

    var msg = 'Username ' + username.magenta + ' is ';
    msg += result.available ? 'available'.green : 'not available'.red;
    app.log.info(msg);

    //
    // Callback with results, so that can be tested.
    //
    callback(null, result);
  });
};

//
// Usage for `<app> users available`.
//
exports.available.usage = [
  'Checks the availability of the desired username',
  '',
  '<app> users available <username>'
];

//
// ### function create (username, callback)
// #### @username {string} Desired username to create
// #### @callback {function} Continuation to pass control to when complete.
// Attempts to create a user account with the specified `username`.
// Prompts the user for additional `email` and `password` information.
//
exports.create = function (username, callback) {
  var app = cliUsers.app,
      password,
      email;

  //
  // Helper function to create the user and respond.
  //
  function createUser(details) {
    app.users.create(details, function (err, result) {
      if (err) {
        app.log.error('There was an error creating your account');
        app.log.error(err.message);
        return callback(err, true, true);
      }

      app.log.info('Account creation successful!');

      if (cliUsers.after.create) {
        cliUsers.after.create(details);
      }

      callback(null, result);
    });
  }

  //
  // Helper function to prompt the user for password.
  //
  function addPassword() {
    getPassword(function (err, password) {
      if (err) {
        return callback(err);
      }

      app.log.info('You account is now being created');
      return createUser({
        username: username,
        email: email,
        password: password
      });
    });
  }

  //
  // Helper function to prompt the user for email.
  //
  function addEmail() {
    app.prompt.get('email', function (err, result) {
      if (err) {
        return callback(err);
      }

      //
      // Email must be provided.
      //
      email = result.email;
      if (!email) {
        app.log.error('Please provide an email address');
        return addEmail();
      }

      //
      // Check if the email is already registered.
      //
      app.users.emailTaken(email, function (err, res) {
        if (err) {
          return callback(err);
        }
        else if (res.taken) {
          app.log.error('This email is already registered. Please, use a unique email address');
          return addEmail();
        }

        app.log.help('Finally, we will need a password for this account');
        addPassword();
      });
    });
  }

  //
  // Helper function to prompt the user for username.
  //
  function addUsername() {
    app.prompt.get('username', function (err, result) {
      //
      // Disallow falsy usernames like: undefined, false, etc.
      //
      if (!result.username) {
        app.log.error('Please provide a valid username');
        return addUsername();
      }

      app.users.available(result.username, function (err, res) {
        if (err) {
          return callback(err);
        }
        else if (res.available === false) {
          app.log.error('Username was already taken');
          return addUsername();
        }

        username = result.username;
        app.log.help('Next, we will require your email address');

        addEmail();
      });
    });
  }

  app.log.help('To signup, first you will need to provide a username');

  return !username
    ? addUsername()
    : addEmail();
};

//
// Usage for `<app> users create`.
//
exports.create.usage = [
  'Creates a new user account. You will be prompted to provide',
  'additional `email` and `password` information.',
  '',
  '<app> users create',
  '<app> users create <username>',
  '<app> signup',
  '<app> signup <username>'
];

//
// ### function login (username, callback)
// #### @username {string} Optional. Will automatically populate the username
// field with a default value.
// #### @password {string} Optional. Will automatically populate the password
// field with a default value.
// #### @callback {function} Continuation to pass control to when complete.
// Attempts to login the user with the prompted credentials. Makes three
// prompt attempts and then offers to reset the password.
//
exports.login = function () {
  var app = cliUsers.app,
      args = common.args(arguments),
      username = args[0] || app.config.get('username'),
      password = args[1],
      callback = args.callback,
      tries = 0,
      schema = {
        properties: {
          username: {
            type: 'string',
            default: username,
            required: true
          },
          password: {
            type: 'string',
            default: password,
            hidden: true,
            required: true
          }
        }
      };

  if (cliUsers.before.setup) {
    cliUsers.before.setup({ username: app.config.get('username') });
  }

  //
  // Login workflow including async hooks
  //
  async.series([
    //
    // Before login hook
    //
    function before (next) {
      if (cliUsers.before.login) {
        cliUsers.before.login({ username: app.config.get('username') }, next);
      } else {
        next();
      }
    },
    //
    // Login
    //
    setupAuth,
    //
    // After login hook
    //
    function after (next) {
      if (cliUsers.after.login) {
        cliUsers.after.login({ username: app.config.get('username') }, next);
      } else {
        next();
      }
    }
  ],
  //
  // Workflow end
  //
  function (err, result) {
    return err ? callback(err) : callback();
  });

  //
  // Helper function to offer a password reset to the user.
  //
  function offerReset(username) {
    app.prompt.get(['reset'], function (err, res) {
      if (err) {
        return callback(err);
      }
      if (/^y[es]+/i.test(res['request password reset'])) {
        return app.commands.users.forgot(username, null, callback);
      }

      callback(new Error('Invalid username / password.'));
    });
  }

  //
  // Helper function with prompts the user for username and password.
  //
  function setupAuth(next) {
    app.prompt.get(schema, function(err, result) {
      if (err) {
        return callback(err);
      }

      app.config.set('username', result.username);
      app.config.set('password', result.password);

      return app.setup
        ? app.setup(function () {
          tryAuth(next);
        })
        : tryAuth(next);
    });
  }

  //
  // Helper function to attempt to authenticate as the current user.
  //
  function tryAuth(next) {
    var username = app.config.get('username');

    app.auth(function (err) {
      //
      // Attempt to get the password three times.
      // Increment the auth attempts
      //
      tries += 1;

      if (err) {
        if (tries >= 3) {
          app.log.error('Three failed login attempts');
          app.log.info('Would you like to reset your password?');
          return offerReset(username);
        }

        return setupAuth(next);
      }

      app.config.save(function (err) {
        return err ? next(err) : next();
      });
    });
  }

};

//
// Usage for `<app> login`
//
exports.login.usage = [
  'Allows the user to login',
  '',
  '<app> users login',
  '<app> login'
];

//
// ### function logout (callback)
// #### @callback {function} Continuation to pass control to when complete.
// Attempts to logout current user by removing the name from application config.
//
exports.logout = function (callback) {
  var app = cliUsers.app,
      username = app.config.get('username');

  async.series([
      //
      // Before hook
      //
      function before (next) {
        if (cliUsers.before.logout) {
          cliUsers.before.logout({ username: username }, next);
        } else {
          next();
        }
      },
      function logout (next) {
        app.config.clear('username');
        app.config.clear('password');
        next();
      },
      //
      // After hook
      //
      function after (next) {
        if (cliUsers.after.logout) {
          cliUsers.after.logout({ username: username }, next);
        } else {
          next();
        }
      }
    ],
  //
  // End workflow
  //
  function(err, details) {
    app.config.save(function (err) {
      if (err) {
        return callback(err, true);
      }

      app.log.info('User has been logged out');
      callback();
    });
  });
};

//
// Usage for `<app> logout`
//
exports.logout.usage = [
  'Logs out the current user',
  '',
  '<app> logout',
  '<app> users logout'
];

//
// ### function forgot (username, callback)
// #### @username {string} Desired username request password reset.
// #### @callback {function} Continuation to pass control to when complete.
// Sends the password reset email to the user with the specified `username`.
//
exports.forgot = function (username, shake, callback) {
  var app = cliUsers.app;

  //
  // Helper for prompting the user for information required for
  // resetting password.
  //
  function resetPassword() {
    app.config.set('username', username);
    getPassword(function (err, password) {
      if (err) {
        return callback(err);
      }

      app.users.forgot(username, {
        shake: shake,
        'new-password': password
      }, function (err, res) {
        if (err) {
          app.log.error('Unable to set new password for ' + username.magenta);
          app.log.error(err.message);
          return callback(err);
        }

        app.config.set('password', password);
        app.config.save(callback);
      });
    });
  }

  //
  // call app.users.forgot(username) and display reset info to user
  //
  function displayPasswordReset(username) {
    app.users.forgot(username, {}, function (err, result) {
      if (err) {
       return callback(err);
      }
      app.log.info('Request password reset for: ' + username.magenta);
      app.log.info('Check your email for instructions on resetting your password.');
      callback();
    });
  }

  //
  // Helper function to prompt for username and send password reset
  // defaults to config.get('username')
  //
  function promptUsername() {
    app.prompt.get([{name: 'username', default: app.config.get('username')}
    ], function (err, result) {
      username = result.username
      displayPasswordReset(username)
      if (!username) {
        callback(new Error('Username is required'), true);
      }
    });
  }

  if (!username) {
    return promptUsername()
  }

  if (typeof shake === 'string') {
    //
    // They are providing a shake so lets reset the password
    //
    return resetPassword();
  }

  displayPasswordReset(username);
};


//
// Usage for `<app> users forgot`.
//
exports.forgot.usage = [
  'Sends the password reset email to the user with the specified `username`.',
  '',
  '<app> users forgot <username>',
  '',
  'After you have recieved the email, you can run:',
  '<app> users forgot <username> <shake>'
];

//
// ### function changepassword (username, callback)
// #### @callback {function} Continuation to pass control to when complete.
// Change the password for the current user.
//
exports.changepassword = function (callback) {
  var app = cliUsers.app;

  getPassword(function (err, password) {
    app.users.update(app.config.get('username'), { password: password }, function (err) {
      if (err) {
        return callback(err)
      }

      app.config.set('password', password);
      app.config.save(callback);
    });
  });
};

//
// Usage for `<app> users changepassword`.
//
exports.changepassword.usage = [
  'Used to change the user password',
  '',
  '<app> users changepassword',
];

//
// ### function whoami (callback)
// #### @callback {function} Continuation to pass control to when complete.
// Retrieves the name of the current logged in user
//
exports.whoami = function (callback) {
  var app = cliUsers.app,
      username = app.config.get('username') || 'not logged in';

  app.log.info('You are: ' + username.magenta);
  callback();
};

//
// Usage for `<app> whoami`.
//
exports.whoami.usage = [
  'Displays the current logged in user',
  '',
  '<app> whoami',
  '<app> users whoami'
];


//
// ### function delete (username, callback)
// #### @username {string} User to delete.
// #### @callback {function} Continuation to pass control to when complete.
//
exports.delete = function (username, callback) {
  var app = cliUsers.app;

  username = username || app.config.get('username');

  [
    username.magenta + ', you are attempting to delete your account. This is irreversible.',
    'Sad to see you go!',
    'Please type in your username in order to confirm.'
  ].forEach(app.log.warn.bind(app.log));

  app.prompt.get(['username'], function (err, result) {
    if (err) {
      return callback(err);
    }

    if (result.username !== username) {
      return callback(new Error('Usernames don\'t match.'), true);
    }

    app.users.destroy(username, function (err) {
      if (err) {
        return callback(err);
      }

      app.log.info('User ' + username.magenta + ' successfully deleted.');
      callback();
    });
  });
};

exports.delete.usage = [
  'Deletes user account',
  'Will prompt for confirmation',
  '',
  '<app> users delete'
];

//
// Helper function to prompt user for a password and
// ensure that the two passwords match.
//
function getPassword(callback) {
  var app = cliUsers.app;

  if (app.argv.password) {
    return callback(null, app.argv.password);
  }

  app.prompt.get(['password', 'confirm password'], function (err, result) {
    if (result['password'] === '') {
      app.log.error('You password must have characters in it');
      return getPassword(callback);
    }
    else if (result['password'] !== result['confirm password']) {
      app.log.error('The entered passwords do not match');
      return getPassword(callback);
    }

    callback(null, result.password);
  });
}
