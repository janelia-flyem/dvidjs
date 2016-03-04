describe('dvid', function() {

  beforeEach(function() {
    this.dvid = dvid;
  });

  it("config defaults should be used if connect is called without options", function() {
    var con1 = this.dvid.connect();
    expect(con1.config.host).toBe(undefined);
    expect(con1.config.port).toBe(undefined);
  });

  it("connects to a server and fetches the server info", function(done) {
    var con1 = this.dvid.connect({host: 'emdata1', port: 8500});
    expect(con1.config.host).toBe('emdata1');
    expect(con1.config.port).toBe(8500);

    con1.serverInfo({
      callback: function(res){
        expect(res.Cores).toBe('32');
        done();
      }
    });
  });

  it("connects to a server and fetches the repos info", function(done) {
    var con1 = this.dvid.connect({host: 'emdata1', port: 8500});
    expect(con1.config.host).toBe('emdata1');
    expect(con1.config.port).toBe(8500);

    con1.reposInfo({
      callback: function(res){
        expect(res['0c8bc973dba74729880dd1bdfd8d0c5e'].Alias).toBe('AL-7');
        done();
      }
    });
  });

  it("connects to a server and fetches info for a single repo", function(done) {
    var con1 = this.dvid.connect({host: 'emdata1', port: 8500});
    con1.repo({
      uuid: '36645473972544e39c6ed90c4643c8a9',
      endpoint: 'info',
      callback: function(res){
        expect(res.Alias).toEqual('MB-6');
        done();
      }
    });
  });

  it("connects to a server and fetches datatype info for a node", function(done) {
    var con1 = this.dvid.connect({host: 'emdata1', port: 8500});
    con1.node({
      uuid: '36645473972544e39c6ed90c4643c8a9',
      endpoint: 'grayscale/info',
      callback: function(res){
        expect(res.Base.TypeName).toEqual('uint8blk');
        done();
      }
    });
  });

  it("creates the correct isotropic image urls", function() {
    var con1 = this.dvid.connect({host: 'emdata1', port: 8500});
    var url = con1.isoImageUrl({
      uuid: '12345',
      tileSource: 'grayscale',
      axis: 'xy',
      size: 512,
      x: 2300,
      y: 2300,
      z: 3000
    });
    expect(url).toBe('http://emdata1:8500/api/node/12345/grayscale/isotropic/xy/512_512/2300_2300_3000/jpg');
  });

  it("connects to multiple servers with different objects", function() {
    var con1 = this.dvid.connect({host: 'emdata1', port: 8500});
    var con2 = this.dvid.connect({host: 'emdata2', port: 8500});
    expect(con1.config.host).toBe('emdata1');
    expect(con2.config.host).toBe('emdata2');
  });

  it("fails gracefully when connecting to a server that doesn't exist.", function(done) {
    var con1 = this.dvid.connect({host: 'emdata1', port: 2});
    con1.reposInfo({
      callback: function(res){
        done();
      },
      error: function(err) {
        expect(err.message).toBe('Failed to connect to the server');
        done();
      }
    });
  });

  it("throws an error when a callback is not set to handle the response", function() {
    var con1 = this.dvid.connect({host: 'emdata1', port: 8500});
    expect( function() {con1.reposInfo() }).toThrow(new Error("Callback not set to handle response"));
  });

  it("fails gracefully when connecting to a bad url", function(done) {
    var con1 = this.dvid.connect({host: 'emdata1', port: 8500});
    con1.node({
      uuid: '36645473972544e39c6ed90c4643c8a9',
      endpoint: 'gray/info',
      callback: function(res){
        done();
      },
      error: function(err) {
        expect(err.message).toBe("Server responded with an error: (400) invalid data instance name (/api/node/36645473972544e39c6ed90c4643c8a9/gray/info).\n");
        done();
      }
    });
  });

  it("fails gracefully when connecting to a bad port", function(done) {
    var con1 = this.dvid.connect({host: 'emdata1', port: 85001});
    con1.reposInfo({
      callback: function(res){
        done();
      },
      error: function(err) {
        expect(err.message).toBe('Failed to connect to the server');
        done();
      }
    });
  });
/*
  it("it creates a new repo", function(done) {
    var con1 = this.dvid.connect({host: 'localhost', port: 4000});
    con1.createRepo({
      alias: 'Test Repo',
      description: 'A test repo created via the web api again',
      callback: function(res){
        expect(res).toBe('a valid uuid');
        done();
      },
      error: function(err) {
        console.log(err);
        expect(err).toBe('failure');
        done();
      }
    });
  });
*/
});
