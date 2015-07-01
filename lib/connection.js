function Connection(options) {
  options = options || {};
  this.config = {
    host: options.host,
    port: options.port || 80
  };
}

Connection.prototype.serverInfo = function(opts) {
  opts = opts || {};
  opts.url = this.createUrl('api/server/info');
  var req = create_request(opts);
  req.send();
}

Connection.prototype.load = function(opts) {
  opts = opts || {};
  opts.url = this.createUrl('api/load');
  var req = create_request(opts);
  req.send();
}

Connection.prototype.reposInfo = function(opts) {
  opts = opts || {};
  opts.url = this.createUrl('api/repos/info');
  var req = create_request(opts);
  req.send();
}

Connection.prototype.get = function(opts) {
  opts = opts || {};
  opts.url = this.createUrl('api/repo/' + opts.uuid + '/' + opts.endpoint);
  var req = create_request(opts);
  req.send();
}

Connection.prototype.node = function(opts) {
  opts = opts || {};
  opts.url = this.createUrl('api/node/' + opts.uuid + '/' + opts.endpoint);
  var req = create_request(opts);
  req.send();
}

Connection.prototype.createUrl = function(path) {
  if (this.config.host && this.config.port) {
    return "http://" + this.config.host + ":" + this.config.port + "/" + path;
  }
  else {
    return "/" + path;
  }
}

Connection.prototype.isoImageUrl = function(opts) {
  var path = 'api/node/' + opts.uuid + '/' + opts.tileSource + '/isotropic/' + opts.axis + '/' + opts.size + '_' + opts.size + '/' + opts.x + '_' + opts.y + '_' + opts.z + '/jpg';

  if (this.config.host && this.config.port) {
    return "http://" + this.config.host + ":" + this.config.port + "/" + path;
  }
  else {
    return "/" + path;
  }
}

function create_request(opts) {
  opts = opts || {};
  var xhr = new XMLHttpRequest();

  // make sure we get back the correct data object.
  if (opts.data) {
    xhr.responseType = "arraybuffer";
  }

  if (opts.hasOwnProperty('callback')) {
    xhr.onload = function() {
      if (xhr.status === 200) {

        /* if we are expecting an array buffer, then we don't want to
         * try and parse it into a JSON object. */
        if (xhr.responseType === "arraybuffer") {
          opts.callback.call(this);
        } else {
          opts.callback(JSON.parse(this.responseText));
        }

      } else {

        var error = new Error('Server responded with an error: ' + xhr.status);
        if (opts.hasOwnProperty('error')) {
          opts.error(error);
        }
        else {
          throw new Error('Server responded with an error: ' + xhr.status + ' and no callback set.');
        }

      }
    }
  } else {
    throw new Error('Callback not set to handle response');
  }

  // set up error handling if the server cant be reached.
  if (opts.error) {
    xhr.onerror = function(err) {
      opts.error(new Error('Failed to connect to the server'));
    }
  }
  else {
    xhr.onerror = function(err) {
      throw new Error('Failed to connect to the server and no error callback set.');
    }
  }

  xhr.open('GET', opts.url, true);
  return xhr;
}

module.exports = Connection;
