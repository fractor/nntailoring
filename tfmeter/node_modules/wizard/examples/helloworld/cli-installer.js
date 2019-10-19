var wizard = require('../../lib/wizard'),
    fs = require('fs');


//
// Load schema object from config.schema file ( regular JSON-schema)
//
var schema = wizard.load(__dirname + '/config/schema.json');

//
// Run the CLI configuration wizard 
//
wizard.cli.run(schema, function(err, results){

  if(err){
    console.log(err);
  }

  //
  // After the wizard completes, write the results to the config.json file
  //

  fs.writeFileSync('./config.json', JSON.stringify(results));

  //
  // Now that the app is configured, see if user wants to start it!
  // 
  
  //
  // TODO: Cli prompt for starting
  //

});

