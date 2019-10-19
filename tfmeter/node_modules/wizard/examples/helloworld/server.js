var nconf = require('nconf'),
    http  = require("http");

//
// Pull app configuration out from config.json file
//
nconf.file({ file: __dirname + '/config/development.json' });

var port = nconf.get('port'),
    host = nconf.get('host');

//
// Start simple http server that pulls host, port, and a name from config.json
//
http.createServer(function(req, res){
  res.end('Welcome to ' + nconf.get('name'));
  //
  // Show settings form
  //
}).listen(port, host, function(){
  console.log('Server listening on', host, port);
});