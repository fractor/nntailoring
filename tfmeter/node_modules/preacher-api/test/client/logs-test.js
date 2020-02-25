var vows = require('vows'),
    assert = require('assert'),
    nock = require('nock'),
    makeApiCall = require('../macros').makeApiCall;

vows.describe('logs').addBatch(makeApiCall(
  'logs byApp myApp 50',
  function setup () {
    nock('https://logs.mockjitsu.com')
      .get('/logs/tester/myApp')
      .reply(200, {}, { 'x-powered-by': 'Nodejitsu' })
  }
)).export(module);
