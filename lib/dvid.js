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
  this.config.port = config.port || 80;
}

DVID.prototype.serverInfo = function(callback) {
  var url = this.createUrl('api/server/info');
  var req = create_request({url: url, callback: callback});
  req.send();
}

DVID.prototype.reposInfo = function(callback) {
  var url = this.createUrl('api/repos/info');
  var req = create_request({url: url, callback: callback});
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

DVID.prototype.isoImageUrl = function(opts) {
  var path = 'api/node/' + opts.uuid + '/' + opts.tileSource + '/isotropic/' + opts.axis + '/' + opts.size + '_' + opts.size + '/' + opts.x + '_' + opts.y + '_' + opts.z + '/jpg';

  if (this.config.host && this.config.port) {
    return "http://" + this.config.host + ":" + this.config.port + "/" + path;
  }
  else {
    return "/" + path;
  }
}

DVID.prototype.get = function(opts) {
  var url = this.createUrl('api/repo/' + opts.uuid + '/' + opts.endpoint);
  var req = create_request({url: url, callback: opts.callback});
  req.send();
}

DVID.prototype.node = function(opts) {
  var url = this.createUrl('api/node/' + opts.uuid + '/' + opts.endpoint);
  var req = create_request({url: url, callback: opts.callback, data: opts.data});
  req.send();
}

var dvid = new DVID();

module.exports = dvid;

function create_request(opts) {
  var xhr = new XMLHttpRequest();
  if (opts.data) {
    xhr.responseType = "arraybuffer";
  }

  if (opts.callback) {
    if (opts.data) {
      xhr.onload = function() {
        opts.callback.call(this);
      }
    } else {
      xhr.onload = function() {
        opts.callback(JSON.parse(this.responseText));
      }
    }
  }
  xhr.open('GET', opts.url, true);
  return xhr;
}
