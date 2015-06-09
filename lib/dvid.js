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
  this.config.host = config.host;
  this.config.port = config.port;
}

DVID.prototype.serverInfo = function(callback) {
  var url = this.createUrl('api/server/info');
  var req = create_request(url, callback);
  req.send();
}

DVID.prototype.createUrl = function(path) {
  if (this.config.host && this.config.port) {
    return "http://" + this.config.host + ":" + this.config.port + "/" + path;
  }
  else {
    return "/" + path;
  }
}

DVID.prototype.get = function(uuid, endpoint, opts, callback) {
  var url = this.createUrl('api/repo/' + uuid + '/' + endpoint);
  var req = create_request(url, callback);
  req.send();
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
