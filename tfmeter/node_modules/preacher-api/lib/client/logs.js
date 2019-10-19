'use strict';

/*
 * logs.js: Client for the Nodejitsu logs API.
 *
 * (C) 2013, Nodejitsu Inc.
 *
 */

var util = require('util'),
    Client = require('./client').Client;

//
// ### function Logs (options)
// #### @options {Object} Options for this instance
// Constructor function for the Logs resource
// with Nodejitsu's Preacher API
//
var Logs = exports.Logs = function (options) {
  Client.call(this, options);
};

// Inherit from Client base object
util.inherits(Logs, Client);

//
// ### function byApp (appName, amount, callback)
// #### @appName {string} Name of the application to retrieve
// #### @amount {number} the number of lines to retrieve
// #### @callback {function} Continuation to pass control to when complete.
// It retrieves the specified amount of logs for the application
//
Logs.prototype.byApp = function (appName, amount, callback) {
  appName = this.defaultUser(appName);
  var argv = ['logs'].concat(appName.split('/'));

  if (amount) {
    argv.push(amount);
  }

  this.request({ method: 'GET', uri: argv }, callback);
};

//
// ### function live (appName, callback)
// #### @appName {string} Name of the application to retrieve
// #### @callback {function} Continuation to pass control when complete.
// It retrieves the ws socket for live streaming support
//
Logs.prototype.live = function (appName, callback) {
  appName = this.defaultUser(appName);

  this.getSocket({ channel: 'logs/' + appName }, callback);
};
//
// ### function byUser (amount, callback)
// #### @username {string} Name of user whose logs we wish to retrieve
// #### @amount {number} the number of lines to retrieve
// #### @callback {function} Continuation to pass control to when complete.
// It retrieves the specified amount of logs for all the applications for the user
// #### @deprecated
//
Logs.prototype.byUser = function (username, amount, callback) {
  callback(new Error('Deprecated'));
};
