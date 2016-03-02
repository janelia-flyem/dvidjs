var assert = require('assert');

var dvid = require('../lib/dvid');
var Connection = require('../lib/connection');
var pjson = require('../package.json');
var shmock = require('shmock');

before(function() {
  var server = shmock(5050);
  server.get('/api/server/info').reply(200, '{"Cores": 8}');
});

describe('dvid', function () {
  it('should describe itself', function() {
    assert.equal('This is the dvid api', dvid.about());
  });
  it('should return a connection object', function () {
    var new_connection = dvid.connect();
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
    assert.equal('www.example.com', conn.config.host);
  });

  it('should set undefined as default on creation with no arguments', function() {
    var conn = dvid.connect();
    assert.equal(undefined, conn.config.port);
    assert.equal(undefined, conn.config.host);
  });

  it('should create a valid url when given good data and no host', function() {
    var conn = dvid.connect();
    var url = conn.createUrl('bar/baz');
    assert.equal('/bar/baz', url);

    var url2 = conn.createUrl('/bar/baz');
    assert.equal('/bar/baz', url2);

    var url3 = conn.createUrl('http://foo.com/bar/baz');
    assert.equal('http://foo.com/bar/baz', url3);

  });

  it('should create a valid url when given good data and a host', function() {
    var conn = dvid.connect({host: 'wibble.com'});
    var url = conn.createUrl('bar/baz');
    assert.equal('http://wibble.com/bar/baz', url);
  });

  it('should use the correct protocol', function() {
    var conn = dvid.connect({host: 'https://www.foo.com'});
    var url = conn.createUrl('bar/baz');
    assert.equal("https://www.foo.com/bar/baz", url);

    var conn2 = dvid.connect({host: 'https://www.foo.com', port: '8000'});
    var url2 = conn2.createUrl('bar/baz');
    assert.equal("https://www.foo.com:8000/bar/baz", url2);

    var conn3 = dvid.connect({host: 'foo.com', port: '8000', protocol: 'https'});
    var url3 = conn3.createUrl('bar/baz');
    assert.equal("https://foo.com:8000/bar/baz", url3);

    var conn4 = dvid.connect({host: 'foo.com'});
    var url4 = conn4.createUrl('bar/baz');
    assert.equal("http://foo.com/bar/baz", url4);
  });

  it('should create valid iso image urls', function() {
    var conn = dvid.connect({host: 'https://www.foo.com'});
    var url = conn.isoImageUrl({
      uuid: '123',
      tileSource: 'test',
      axis: 'xy',
      size: '512',
      x: '12',
      y: '34',
      z: '56'
    });
    assert.equal("https://www.foo.com/api/node/123/test/isotropic/xy/512_512/12_34_56/jpg", url);
  });

  it('should return valid server info', function(done) {
    var conn = dvid.connect({host: 'localhost', port: '5050'});
    conn.serverInfo({
      callback: function(res) {
        assert.equal('8', res.Cores);
        done();
      }
    });
  });

});
