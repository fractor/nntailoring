var Logs = exports.Logs = require('./client/logs').Logs;

//
// ### function createClient(options)
// #### @options {Object} options for the clients
// Generates a new API client.
//
exports.createClient = function createClient(options) {
  var client = {};

  client.logs = new Logs(options);

  if (options.debug) {
    client.logs.on('debug::request', debug);
    client.logs.on('debug::response', debug);
  }

  function debug(args) {
    console.log(args);
  }

  return client;
};
