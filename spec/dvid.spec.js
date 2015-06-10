describe('dvid', function() {

  beforeEach(function() {
    this.dvid = dvid;
  });

  it("config should be undefined if connect hasn't been called", function() {
    expect(this.dvid.config.host).toBe(undefined);
    expect(this.dvid.config.port).toBe(undefined);
  });

  it("config defaults should be used if connect is called without options", function() {
    this.dvid.connect();
    expect(this.dvid.config.host).toBe(undefined);
    expect(this.dvid.config.port).toBe(80);
  });

  it("connects to a server and fetches the server info", function(done) {
    this.dvid.connect({host: 'emdata1', port: 8500});
    expect(this.dvid.config.host).toBe('emdata1');
    expect(this.dvid.config.port).toBe(8500);

    this.dvid.serverInfo(function(res){
      expect(res.Cores).toBe('32');
      done();
    });
  });

  it("connects to a server and fetches the repos info", function(done) {
    this.dvid.connect({host: 'emdata1', port: 8500});
    expect(this.dvid.config.host).toBe('emdata1');
    expect(this.dvid.config.port).toBe(8500);

    this.dvid.reposInfo(function(res){
      expect(res['0c8bc973dba74729880dd1bdfd8d0c5e'].Alias).toBe('AL-7');
      done();
    });
  });

  it("connects to a server and fetches info for a single repo", function(done) {
    this.dvid.connect({host: 'emdata1', port: 8500});
    this.dvid.get('36645473972544e39c6ed90c4643c8a9', 'info', {}, function(res){
      expect(res.Alias).toEqual('MB-6');
      done();
    });
  });

  it("connects to a server and fetches datatype info for a node", function(done) {
    this.dvid.connect({host: 'emdata1', port: 8500});
    this.dvid.node('36645473972544e39c6ed90c4643c8a9', 'grayscale/info', {}, function(res){
      expect(res.Base.TypeName).toEqual('uint8blk');
      done();
    });
  });

});
