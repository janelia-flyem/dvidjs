var assert = require('assert');

var dvid = require('../lib/dvid');
var Connection = require('../lib/connection');
var pjson = require('../package.json');

describe('dvid', function () {
  it('should describe itself', function() {
    assert.equal('This is the dvid api', dvid.about());
  });
  it('should return a connection object', function () {
    var new_connection = dvid.connect({host: 'foo'});
    assert.ok(new_connection instanceof Connection);
  });
  it('should report the correct version number', function() {
    assert.equal(pjson.version, dvid.version());
  });
});

describe('connection', function() {
  it('should accept a configuration on creation', function() {
    var conn = dvid.connect({host: 'http://www.example.com', port: '1234'});
    assert.equal('1234', conn.config.port);
    assert.equal('http://www.example.com', conn.config.host);
  });

  it('should set a default port on creation', function() {
    var conn = dvid.connect({host: 'foo'});
    assert.equal('80', conn.config.port);
    assert.equal('foo', conn.config.host);
  });

  it('should throw an error with bad configuration values', function() {
    try {
      var conn = dvid.connect();
    } catch (e) {
      assert.ok(e instanceof Error);
      assert.equal("A 'host' value must be provided to the connection on creation.", e.message);
    }
  });
});
