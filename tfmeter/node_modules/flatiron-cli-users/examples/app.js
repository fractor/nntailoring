var path = require('path'),
    flatiron = require('flatiron'),
    app = module.exports = flatiron.app;

//
// Configure the Application to be a CLI app with
// a JSON configuration file `test-config.json`
//
app.name = 'app.js';
app.config.file({ file: path.join(__dirname, 'test-config.json') });
app.use(flatiron.plugins.cli, {
  usage: 'A simple CLI app using flatiron-cli-users'
});

//
// Expose CLI commands using `flatiron-cli-users`
//
app.use(require('../lib/flatiron-cli-users'));

if (!module.parent) {
  //
  // Start the application
  //
  app.start();
}