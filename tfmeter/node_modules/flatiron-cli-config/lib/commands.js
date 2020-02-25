/*
 * commands.js: CLI Commands related to app configuration
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */

var cliConfig = require('./flatiron-cli-config');

exports.usage = [
  '`<app> config *` commands allow you to edit your',
  'local <app> configuration file. Valid commands are:',
  '',
  '<app> config list',
  '<app> config set    <key> <value>',
  '<app> config get    <key>',
  '<app> config delete <key>'
];

//
// ### function set (key, value, callback)
// #### @key {string} Key to set in <app> config.
// #### @value {string} Value to set the key to.
// #### @callback {function} Continuation to pass control to when complete
// Sets the specified `key` in <app> config to `value`.
//
exports.set = function (key, value, callback) {
  var args = Array.prototype.slice.call(arguments);
  callback = args.pop();

  if (args.indexOf(null) == 0 || args.indexOf(null) == 1){
    cliConfig.app.log.error('You must pass both <key> and <value>');
    return callback(true, true);
  }
  else if (cliConfig.before.set && !cliConfig.before.set(key, value)) {
    return callback();
  }

  //
  // This should allow users to set booleans.
  //
  if (value === "true") {
    value = true;
  }
  if (value === "false") {
    value = false;
  }

  cliConfig.app.config.set(key, value);
  cliConfig.app.config.save(callback);
};

//
// Usage for `<app> config set <key> <value>`
//
exports.set.usage = [
  'Sets the specified <key> <value> pair in the app configuration',
  '',
  '<app> config set <key> <value>'
];

//
// ### function get (key, callback)
// #### @key {string} Key to get in app config.
// #### @callback {function} Continuation to pass control to when complete
// Gets the specified `key` in app config.
//
exports.get = function (key, callback) {
  if (!callback) {
    callback = key;
    cliConfig.app.log.error('No configuration for ' + 'undefined'.yellow);
    return callback(new Error(), true, true);
  }
  else if (cliConfig.before.get && !cliConfig.before.get(key)) {
    return callback();
  }

  var value = cliConfig.app.config.get(key);
  if (!value) {
    cliConfig.app.log.error('No configuration value for ' + key.yellow);
    return callback(new Error(), true, true);
  }
  else if (typeof value === 'object') {
    cliConfig.app.log.data(key.yellow);
    cliConfig.app.inspect.putObject(value);
    return callback();
  }

  cliConfig.app.log.data([key.yellow, (value+'').magenta].join(' '));
  callback();
};

//
// Usage for `<app> config get <key>`
//
exports.get.usage = [
  'Gets the value for the specified <key>',
  'in the app configuration',
  '',
  '<app> config get <key>'
];

//
// ### function delete (key, callback)
// #### @key {string} Key to delete, in <app> config.
// #### @callback {function} Continuation to pass control to when complete
// Deletes the specified `key` in app config.
//
exports.delete = function (key, callback) {
  if (!callback) {
    callback = key;
    cliConfig.app.log.warn('No configuration for ' + 'undefined'.magenta);
    return callback();
  }
  else if (cliConfig.before.delete && !cliConfig.before.delete(key)) {
    return callback();
  }

  var value = cliConfig.app.config.get(key);
  if (!value) {
    cliConfig.app.log.warn('No configuration value for ' + key.yellow);
    return callback();
  }
  else if (cliConfig.restricted.indexOf(key) !== -1) {
    cliConfig.app.log.warn('Cannot delete reserved setting ' + key.yellow);
    cliConfig.app.log.help('Use ' + (cliConfig.app.name || '<app>') + ' config set <key> <value>');
    return callback();
  }

  cliConfig.app.config.clear(key);
  cliConfig.app.config.save(callback);
};

//
// Usage for `<app> config delete <key>`
//
exports.delete.usage = [
  'Deletes the specified <key> in the <app> configuration',
  '',
  '<app> config delete <key>'
];

//
// ### function list (callback)
// #### @callback {function} Continuation to pass control to when complete
// Lists all the key-value pairs in jitsu config.
//
exports.list = function (callback) {
  var data = cliConfig.store
    ? cliConfig.app.config.stores[cliConfig.store].store
    : cliConfig.app.config.load();

  if (cliConfig.before.list && !cliConfig.before.list()) {
    return callback();
  }

  cliConfig.app.inspect.putObject(data, {
    password: function (line) {
      var password = line.match(/password.*\:\s(.*)$/)[1];
      return line.replace(password, "'********'");
    }
  }, 2);

  callback();
};

//
// Usage for `<app> config list`
//
exports.list.usage = [
  'Lists all configuration values currently',
  'set in the .jitsuconf file',
  '',
  '<app> config list'
];
