/*
 * flatiron-cli-config.js: Top-level include for the `flatiron-cli-config` module.
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */

var common = require('flatiron').common;

var cliConfig = exports;

//
// Expose commands and name this plugin
//
cliConfig.commands = require('./commands');
cliConfig.name = 'cli-config';

//
// ### function attach (options)
// #### @options {Object} Options to use when attaching
// Attaches the `flatiron-cli-config` behavior to the application.
//
cliConfig.attach = function (options) {
  var app = this;
  options = options || {};

  if (!app.plugins.cli) {
    throw new Error('`cli` plugin is required to use `flatiron-cli-config`');
  }
  else if (!app.config) {
    throw new Error('`app.config` must be set to use `flatiron-cli-config`');
  }

  app.config.remove('literal');
  cliConfig.app = app;
  cliConfig.store = options.store || null;
  cliConfig.restricted = options.restricted || [];
  cliConfig.before = options.before || {};
  common.templateUsage(app, cliConfig.commands);

  app.commands['config'] = app.commands['config'] || {};
  app.commands['config'] = common.mixin(app.commands['config'], cliConfig.commands);
  app.alias('conf', { resource: 'config', command: 'list' });
};

//
// ### function detach ()
// Detaches this plugin from the application.
//
cliConfig.detach = function () {
  var app = this;

  Object.keys(app.commands['config']).forEach(function (method) {
    if (cliConfig.commands[method]) {
      delete app.commands['config'][method];
    }

    cliConfig.commands.app = null;
  });
};