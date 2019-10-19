var cli    = exports,
    prompt = require('prompt');

//
// Runs through a CLI prompting wizard based on incoming JSON-schema
//
cli.run = function (schema, callback) {

  //
  // Slight formatting hack for prompt library / JSON-schema
  //
  // See: https://github.com/flatiron/prompt/issues/29
  var promptProperties = [];
  Object.keys(schema.properties).forEach(function(prop){
    schema.properties[prop].name = prop;
    promptProperties.push(schema.properties[prop]);
  });

  //
  // Search for any specially defined getters, attach methods
  //

  prompt.start();

  //
  // Get two properties from the user: email, password
  //
  prompt.get(promptProperties,callback);

};