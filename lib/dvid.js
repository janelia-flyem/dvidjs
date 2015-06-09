/*
 * DVID API
 * 
 *
 *
 */

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
  config = config || {};
  this.config.host = config.host || 'localhost';
  this.config.port = config.port || 80;
}

DVID.prototype.serverInfo = function(callback) {
  var url = this.createUrl('api/server/info');
  var req = create_request(url, callback);
  req.send();
}

DVID.prototype.createUrl = function(path) {
  return "http://" + this.config.host + ":" + this.config.port + "/" + path;
}

DVID.prototype.get = function(uuid, endpoint, opts, callback) {
  // ajax request to the end point
  // return success or failure?
  // execute a callback?
}

var dvid = new DVID();

module.exports = dvid;

function create_request(url, callback) {
  var xhr = new XMLHttpRequest();
  if (callback) {
    xhr.onload = function() {
      callback(JSON.parse(this.responseText));
    }
  }
  xhr.open('GET', url, false);
  return xhr;
}
