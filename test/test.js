var assert = require('assert');

var dvid = require('../lib/dvid');
var Connection = require('../lib/connection');
var pjson = require('../package.json');
var shmock = require('shmock');
var fs = require('fs');
require('mocha-sinon');



var test_host = 'localhost';
var test_port = '5050';
var bad_port = '5051';
var uuid = '24e6ace57d834383bb24ea2b6d38392a';
var new_uuid = 'e6ace57d834383bb24ea2b6d38392a24';

before(function() {
  var server = shmock(test_port);
  server.get('/api/server/info').reply(200, '{"Cores": "8","DVID Version": "b4e2d955-dirty", "Datastore Version": "0.9.2", "Maximum Cores": "8", "Server time": "2016-03-02 09:25:30.344637802 -0500 EST", "Server uptime": "17h55m21.263146348s", "Storage backend": "basholeveldb" }');
  server.get('/api/server/types').reply(200, '{"imagetile": "github.com/janelia-flyem/dvid/datatype/imagetile", "labelvol": "github.com/janelia-flyem/dvid/datatype/labelvol", "uint8blk": "github.com/janelia-flyem/dvid/datatype/imageblk/uint8.go"}');
  server.get('/api/server/compiled-types').reply(200, '{"annotation": "github.com/janelia-flyem/dvid/datatype/annotation", "googlevoxels": "github.com/janelia-flyem/dvid/datatype/googlevoxels", "imagetile": "github.com/janelia-flyem/dvid/datatype/imagetile", "keyvalue": "github.com/janelia-flyem/dvid/datatype/keyvalue", "labelblk": "github.com/janelia-flyem/dvid/datatype/labelblk", "labelgraph": "github.com/janelia-flyem/dvid/datatype/labelgraph", "labelvol": "github.com/janelia-flyem/dvid/datatype/labelvol", "multichan16": "github.com/janelia-flyem/dvid/datatype/multichan16", "rgba8blk": "github.com/janelia-flyem/dvid/datatype/imageblk/rgba8.go", "roi": "github.com/janelia-flyem/dvid/datatype/roi", "synapse": "github.com/janelia-flyem/dvid/datatype/synapse", "uint8blk": "github.com/janelia-flyem/dvid/datatype/imageblk/uint8.go"}');
  server.get('/api/load').reply(200, '{"GET requests": 0, "PUT requests": 0, "active CGo routines": 0, "file bytes read": 0, "file bytes written": 0, "goroutines": 15, "handlers active": 0, "key bytes read": 0, "key bytes written": 0, "value bytes read": 0, "value bytes written": 0}');
  server.get('/api/repo/1234/info').reply(200, '{}');

  fs.readFile(__dirname + '/data/repo_log.json', function(err, data) {
    server.get('/api/repo/' + uuid + '/log').reply(200, data);
  });

  fs.readFile(__dirname + '/data/repo_info.json', function(err, data) {
    server.get('/api/repo/' + uuid + '/info').reply(200, data);
  });

  fs.readFile(__dirname + '/data/repos_info.json', function(err, data) {
    server.get('/api/repos/info').reply(200, data);
  });

  server.post('/api/repo/' + uuid + '/instance').reply(200, '{"result": "Added labels [labelvol] to node '+ uuid +'"}');
  server.post('/api/repo/' + uuid + '/log').reply(200);

  server.post('/api/repos').reply(200, '{"root": "' + new_uuid + '"}');

  var bad_server = shmock(bad_port);

  bad_server.get('/api/repos/info').reply(200, 'not json');


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

describe('connection functions', function() {
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

});

describe('a missing server', function() {
  var conn = dvid.connect({host: 'localhost', port: 6500});

  it('should throw an error when the server is unreachable', function(done) {
    conn.serverInfo({
      'callback': function() {},
      'error': function(e) {
        assert.ok(e instanceof Error);
        assert.ok(/^Failed to connect/.test(e.message));
        done();
      }
    });
  });
});

describe('api requests', function() {
  var conn = dvid.connect({host: test_host, port: test_port});
  var bad_conn = dvid.connect({host: test_host, port: bad_port});

  beforeEach(function() {
    this.sinon.stub(console, 'warn');
  });

  it('should return valid server info', function(done) {
    conn.serverInfo({
      callback: function(res) {
        assert.equal('8', res.Cores);
        assert.equal('0.9.2', res["Datastore Version"]);
        done();
      }
    });
  });

  it('should fail to return serverInfo when no callback is assigned', function(done) {
    try {
      conn.serverInfo();
    } catch(e) {
      assert.ok(e instanceof Error);
      done();
    }
  });


  it('should return valid data types', function(done) {
    conn.serverTypes({
      callback: function(res) {
        assert.equal(3, Object.keys(res).length);
        done();
      }
    });
  });

  it('should return compiled data types', function(done) {
    conn.serverCompiledTypes({
      callback: function(res) {
        assert.equal(12, Object.keys(res).length);
        done();
      }
    });
  });

  it('should be able to get load information', function(done) {
    conn.load({
      callback: function(res) {
        assert.equal(11, Object.keys(res).length);
        assert.equal(15, res.goroutines);
        done();
      }
    });
  });

  it('should be able to get repository meta information', function(done) {
    conn.reposInfo({
      callback: function(res) {
        assert.equal(27, Object.keys(res).length);
        assert.equal('benchmarking', res['075daf87fc0041958b1e4141a1f8cbce'].Alias);
        done();
      }
    });
  });


  it('should warn when server response was not parsable JSON', function(done) {
    bad_conn.reposInfo({
      'callback': function(res) {
        assert.ok(console.warn.calledOnce);
        assert.ok(console.warn.calledWith("Couldn't parse response as JSON: SyntaxError: Unexpected token o"));
        done();
      },
    });
  });


});

describe('single repository requests', function() {
  var conn = dvid.connect({host: test_host, port: test_port});

  it('should get meta information from a single repository', function(done) {
    conn.repo({
      'uuid': uuid,
      'endpoint': 'info',
      'callback': function(data) {
        assert.equal(9, Object.keys(data).length);
        assert.equal(uuid, data.Root);
        assert.equal("node test", data.Alias);
        done();
      }
    });
  });

  it('should get log information', function(done) {
    conn.repo({
      'uuid': uuid,
      'endpoint': 'log',
      'callback': function(data) {
        assert.equal(1, Object.keys(data).length);
        assert.equal("2015-09-14T13:54:24-04:00  123", data.log[0]);
        done();
      }
    });
  });

  it('should create a new log entry', function(done) {
    conn.repo({
      'uuid': uuid,
      'method': 'POST',
      'endpoint': 'log',
      'payload': '{ "log": [ "test entry 1" ] }',
      'callback': function(data) {
        // response from log post should be empty
        assert.equal(undefined, data);
        done();
      },
      'error': function(err) {
        console.log(err);
      }
    });

  });

  it('should create a new data instance', function(done) {
    conn.repo({
      'uuid': uuid,
      'method': 'POST',
      'endpoint': 'instance',
      'payload': '{"typename": "labelvol", "dataname": "labels", "versioned": 0 }',
      'callback': function(data) {
        assert.equal(1, Object.keys(data).length);
        done();
      },
      'error': function(err) {
        console.log(err);
      }
    });

  });


});

describe('creating a repository', function() {
  var conn = dvid.connect({host: test_host, port: test_port});
  it('should return meta info for the new repository', function(done) {
    conn.createRepo({
      'alias': "repo1",
      "description": "test repo",
      'callback': function(data) {
        assert.equal(new_uuid, data.root);
        done();
      },
      'error': function(err) {
        console.log(err);
      }
    });

  });

  it('should throw an error when alias is missing', function(done) {
    try {
      conn.createRepo();
    } catch(e) {
      assert.ok(e instanceof Error);
      done();
    }
  });

  it('should throw an error when description is missing', function(done) {
    try {
      conn.createRepo({"alias": "repo alias"});
    } catch(e) {
      assert.ok(e instanceof Error);
      done();
    }
  });
});

describe('deprecated requests', function() {
  var conn = dvid.connect({host: test_host, port: test_port});

  //http://stackoverflow.com/questions/30625404/how-to-unit-test-console-output-with-mocha-on-nodejs
  beforeEach(function() {
    this.sinon.stub(console, 'warn');
  });

  it('should warn that a deprecated method is being called', function(done) {
    conn.get({
      'uuid': '1234',
      'endpoint': 'info',
      'callback': function(data) {

        done();
      }
    });
    assert.ok(console.warn.calledOnce);
    assert.ok(console.warn.calledWith('The Connection.get() method has been deprecated. Please use the repo method instead.'));

  });


});
