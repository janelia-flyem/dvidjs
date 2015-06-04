function DVID() {
  this.config = {
    host: undefined,
    port: undefined
  };
}

DVID.prototype.about = function () {
  console.log("this is the dvid api");
}

DVID.prototype.connect = function(config) {
  this.config.host = config.host || 'localhost';
  this.config.port = config.port || '80';
}

DVID.prototype.load = function() {

}

DVID.prototype.serverInfo = function() {

}

DVID.prototype.get = function(uuid, endpoint, opts) {
  // ajax request to the end point
  // return success or failure?
  // execute a callback?
}

var dvid = new DVID();

module.exports = dvid;
