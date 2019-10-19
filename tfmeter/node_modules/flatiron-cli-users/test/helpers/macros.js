
var assert = require('assert'),
    path = require('path'),
    util = require('util'),
    base64 = require('flatiron').common.base64,
    app = require('../../examples/app');

exports.shouldRunCommand = function () {
  var args = Array.prototype.slice.call(arguments),
      assertion = "should respond with no error",
      assertFn,
      setupFn;
      
  args.forEach(function (a) {
    if (typeof a === 'function' && a.name === 'setup') {
      setupFn = a;
    }
    else if (typeof a === 'function') {
      assertFn = a;
    }
    else if (typeof a === 'string') {
      assertion = a;
    }
  });
  
  var context = {
    topic: function () {
      
      var that = this,
          argv;
          
      app.argv._ = this.context.name.split(' ')

      // Pad the output slightly
      console.log('');
      
      //
      // If there is a setup function then call it
      //
      if (setupFn) {
        setupFn();
      }
      
      //
      // Execute the target command and assert that no error
      // was returned.
      //
      app.start(function () {
        // Pad the output slightly
        console.log('');
        that.callback.apply(that, arguments);
      });
    }
  };

  context[assertion] = assertFn 
    ? assertFn 
    : function (err, _) { assert.isTrue(!err) };
  
  return context;
};
