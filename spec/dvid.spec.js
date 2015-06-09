describe('dvid', function() {

  beforeEach(function() {
    this.dvid = dvid;
  });

  it("config should be undefined if connect hasn't been called", function() {
    expect(this.dvid.config.host).toBe(undefined);
    expect(this.dvid.config.port).toBe(undefined);
  });

  it("should have default values if connect is called without options", function() {
    this.dvid.connect();
    expect(this.dvid.config.host).toBe('localhost');
    expect(this.dvid.config.port).toBe(80);
  });

  it("connects to a server and fetches the info", function() {
    this.dvid.connect({host: 'emdata1', port: 8500});
    this.dvid.serverInfo(function(res){
      expect(res.Cores).toEqual('32');
    });
  });

});
