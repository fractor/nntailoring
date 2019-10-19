/*
 * env.js: Tests for commands exposed by `flatiron-cli-users`.
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */
 
var assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    flatiron = require('flatiron'),
    nock = require('nock'),
    vows = require('vows'),
    app = require('../examples/app'),
    macros = require('./helpers/macros'),
    api = require('nodejitsu-api');

var shouldRunCommand = macros.shouldRunCommand;

var elvis = {
  username: 'elvis',
  email: 'e@mailinator.com',
  password: '12345'
};

var jimmy = { 
  username: "jimmy",
  email: "j@mailinator.com",
  password: "98765"
};

//
// Use the `nodejitsu-api` for testing since it
// conforms to the API endpoint requirements.
//
app.users = new api.Users({ remoteUri: 'http://api.flatiron-users.com' });

vows.describe('flatiron-cli-users/commands').addBatch({
  'users create elvis': shouldRunCommand(function setup() {
    app.prompt.override = flatiron.common.clone(elvis);
    app.prompt.override['confirm password'] = elvis.password;
    
    nock('http://api.flatiron-users.com')
      .post('/users/elvis', elvis)
      .reply(200, '', { 'x-powered-by': 'Nodejitsu' })
  })
}).addBatch({
  'users create elvis': shouldRunCommand(
    'should respond with a 400 error',
    function assertion (ign, err) {
      err = ign;
      assert.equal(err.statusCode, '400');
    },
    function setup() {
      app.prompt.override = flatiron.common.clone(elvis);
      app.prompt.override['confirm password'] = elvis.password;

      nock('http://api.flatiron-users.com')
        .post('/users/elvis', elvis)
        .reply(400, '', { 'x-powered-by': 'Nodejitsu' })
    })
}).addBatch({
  'users create elvis': shouldRunCommand(
    'should respond with a 500 error',
    function assertion (ign, err) {
      err = ign;
      assert.equal(err.statusCode, '500');
    },
    function setup() {
      app.prompt.override = flatiron.common.clone(elvis);
      app.prompt.override['confirm password'] = elvis.password;

      nock('http://api.flatiron-users.com')
        .post('/users/elvis', elvis)
        .reply(500, '', { 'x-powered-by': 'Nodejitsu' })
    })
}).addBatch({
  'users create jimmy': shouldRunCommand(function setup() {
    app.prompt.override = flatiron.common.clone(jimmy);
    app.prompt.override['confirm password'] = jimmy.password;
    
    nock('http://api.flatiron-users.com')
      .post('/users/jimmy', jimmy)
      .reply(200, '', { 'x-powered-by': 'Nodejitsu' })
  })
}).addBatch({
  'users available jimmy': shouldRunCommand(function setup() {
    nock('http://api.flatiron-users.com')
      .get('/users/jimmy/available')
      .reply(200, { available: true }, { 'x-powered-by': 'Nodejitsu' })
  })
}).addBatch({
  'users forgot jimmy': shouldRunCommand(function setup() {
    app.config.stores.file.file = path.join(__dirname, 'fixtures', 'dot-appconf');
    app.config.stores.file.loadSync();
    
    nock('http://api.flatiron-users.com')
      .post('/users/jimmy/forgot', { shake: null, 'new-password': '98765' })
      .reply(200, '', { 'x-powered-by': 'Nodejitsu' })
  })
}).addBatch({
  'users delete jimmy': shouldRunCommand(function setup() {
    nock('http://api.flatiron-users.com')
      .delete('/users/jimmy', {})
      .reply(200, '', { 'x-powered-by': 'Nodejitsu' });
  })
}).export(module);
