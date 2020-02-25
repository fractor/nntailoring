
var assert = require('assert'),
    vows = require('vows');
    
vows.describe('flatiron-cli-users').addBatch({
  "When a flatiron plugin uses `flatiron-cli-users`": {
    topic: require('../examples/app'),
    "should correctly extend the object": function (app) {
      assert.isObject(app.commands);
      assert.isObject(app.commands.users);
      ['available', 'changepassword', 'create', 'forgot', 'login', 'logout', 'whoami'].forEach(function (cmd) {
        assert.isFunction(app.commands.users[cmd]);
        assert.isArray(app.commands.users[cmd].usage);
      })
    }
  }
}).export(module);