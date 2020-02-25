'use strict';

/*
 * client.js: Client base for the Nodejitsu API clients.
 *
 * (C) 2013, Nodejitsu Inc.
 *
 */

var fs = require('fs'),
    util = require('util'),
    request = require('request'),
    primus = require('primus'),
    Socket = primus.createSocket({ transformer: 'websockets', parser: 'JSON'}),
    EventEmitter = require('events').EventEmitter;

//
// ### function Client (options)
// #### @options {Object} Options for this instance
// Constructor function for the Client base responsible
// for communicating with Nodejitsu's API
//
var Client = exports.Client = function (options) {
  this.options = options;
  this._request = request;

  if (typeof this.options.get !== 'function') {
    this.options.get = function (key) {
      return this[key];
    };
  }
};

util.inherits(Client, EventEmitter);

//
// ### function defaultUser (appName)
// #### @data {String} App name, user/app, or user/database.
//
// A helper to prepend a default username.
// needs 'this' to be able to options.get('username').
//
Client.prototype.defaultUser = function (data) {
  if (!~data.indexOf('/')) {
    data = this.options.get('username').toLowerCase() + '/' + data;
  }

  return data;
};

//
// ### @private function getSocket (options, callback)
// #### @options {Object} Configuration
// #### @callback {function} Continuation to call if errors occur.
// Creates a web socket connection using primus.
//
// Options:
// - channel {String}: Web Sockets channel to subscribe
//
//
Client.prototype.getSocket = function (options, callback) {
  options = options || {};

  if (!this.options.get('logs') || !this.options.get('logs').host) {
    return callback(new Error('Invalid options, must provide a logs service host'));
  }

  var password = this.options.get('password') || this.options.get('apiToken'),
      channel = options.channel,
      self = this,
      url = util.format("%s://%s:%s@%s:%s?subscribe=%s",
                              this.options.get('logs').protocol || 'http',
                              this.options.get('username').toLowerCase(),
                              password,
                              this.options.get('logs').host,
                              this.options.get('logs').port || "80",
                              channel);

  callback(null, new Socket(url));
};

//
// ### @private function request (options, callback)
// #### @options {Object} Configuration
// #### @callback {function} Continuation to call if errors occur.
// Makes a request to the remoteUri + uri using the HTTP and any body if
// supplied.
//
// Options:
// - method {String}: HTTP method to use
// - uri {Array}: Locator for the remote resource
// - remoteUri {String}: Location of the remote API
// - timeout {Number}: Request timeout
// - body {Array|Object}: JSON request body
// - headers {Object}: Headers you want to set
//
Client.prototype.request = function (options, callback) {
  options = options || {};

  if (!this.options.get('logs') || !this.options.get('logs').host) {
    return callback(new Error('Invalid options, must provide a logs service host'));
  }

  var password = this.options.get('password') || this.options.get('apiToken'),
      auth = new Buffer(this.options.get('username').toLowerCase() + ':' + password).toString('base64'),
      proxy = this.options.get('proxy'),
      self = this,
      opts = {},
      remoteUri = util.format("%s://%s:%s/%s",
                              this.options.get('logs').protocol || 'http',
                              this.options.get('logs').host,
                              this.options.get('logs').port || "80",
                              options.uri.join('/'));

  opts = {
    method: options.method || 'GET',
    uri: options.remoteUri || remoteUri,
    headers: {
      'Authorization': 'Basic ' + auth,
      'Content-Type': 'application/json'
    },
    timeout: options.timeout || this.options.get('timeout') || 8 * 60 * 1000,
    rejectUnauthorized: this.options.get('rejectUnauthorized')
  };

  if (options.body) {
    try { opts.body = JSON.stringify(options.body); }
    catch (e) { return callback(e); }
  } else if (opts.method !== 'GET' && options.body !== false) {
    opts.body = '{}';
  }

  if (options.headers) Object.keys(options.headers).forEach(function each(field) {
    opts.headers[field] = options.headers[field];
  });

  if (proxy) opts.proxy = proxy;

  this.emit('debug::request', opts);

  return this._request(opts, function requesting(err, res, body) {
    if (err) return callback(err);

    var poweredBy = res.headers['x-powered-by'],
        result, statusCode, error;

    try {
      statusCode = res.statusCode;
      result = JSON.parse(body);
    } catch (e) {}

    self.emit('debug::response', { statusCode: statusCode, result: result });

    // Only add the response argument when people ask for it
    if (callback.length === 3) return callback(error, result, res);
    callback(error, result);
  });
};

var failCodes = {
  400: 'Bad Request',
  401: 'Not Authorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Item not found',
  405: 'Method not Allowed',
  409: 'Conflict',
  500: 'Internal Server Error',
  503: 'Service Unavailable'
};
