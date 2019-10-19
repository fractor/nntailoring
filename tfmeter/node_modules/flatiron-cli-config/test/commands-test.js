
var assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    cliEasy = require('cli-easy');

var examplesDir = path.join(__dirname, '..', 'examples'),
    appBin = path.join(examplesDir, 'app.js');

cliEasy.describe('flatiron-cli-config/commands')
  .discuss('When using the flatiron-cli-config plugin')
    .discuss('app config set testing 1234')
      .use('node').args([appBin, 'config', 'set', 'testing', '1234'])
      .expect('should update the config file', function () {
        var data = JSON.parse(fs.readFileSync(path.join(examplesDir, 'test-config.json'), 'utf8'));
        assert.equal(data.testing, 1234);
        return true;
      })
    .next()
    .discuss('app config get testing')
      .use('node').args([appBin, 'config', 'get', 'testing'])
      .expect('should update the config file', /1234/)
    .next()
    .discuss('app config list')
      .use('node').args([appBin, 'config', 'list'])
      .expect('should list the config correctly', /1234/)
    .next()
    .discuss('app config delete testing')
      .use('node').args([appBin, 'config', 'delete', 'testing'])
      .expect('should update the config file', function () {
        var data = JSON.parse(fs.readFileSync(path.join(examplesDir, 'test-config.json'), 'utf8'));
        assert.isTrue(!data.testing);
        return true;
      })
    .next()
    .discuss('app config get testing')
      .use('node').args([appBin, 'config', 'get', 'testing'])
      //
      // REMARK: This syntax is really ackward
      //
      .expect('should indicate the setting has been deleted', '', /error/)


  .export(module);