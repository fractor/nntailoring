
var assert = require('assert'),
    vows = require('vows');

vows.describe('flatiron-cli-config').addBatch({
  "When a flatiron plugin uses `flatiron-cli-config`": {
    topic: require('../examples/app'),
    "should correctly extend the object": function (app) {
      assert.isObject(app.commands);
      assert.isObject(app.commands.config);
      ['set', 'get', 'delete', 'list'].forEach(function (cmd) {
        assert.isFunction(app.commands.config[cmd]);
        assert.isArray(app.commands.config[cmd].usage);
      })
    }
  }
}).export(module);