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
  try {
    req.send();
  }
  catch (e) {
    if (opts.hasOwnProperty('error')) {
      opts.error(e);
    }
    else {
     throw e;
    }
  }
}

Connection.prototype.serverTypes = function(opts) {
  opts = opts || {};
  opts.url = this.createUrl('api/server/types');
  var req = create_request(opts);
  try {
    req.send();
  }
  catch (e) {
    if (opts.hasOwnProperty('error')) {
      opts.error(e);
    }
    else {
     throw e;
    }
  }
}

Connection.prototype.load = function(opts) {
  opts = opts || {};
  opts.url = this.createUrl('api/load');
  var req = create_request(opts);
  try {
    req.send();
  }
  catch (e) {
    if (opts.hasOwnProperty('error')) {
      opts.error(e);
    }
    else {
     throw e;
    }
  }
}

Connection.prototype.reposInfo = function(opts) {
  opts = opts || {};
  opts.url = this.createUrl('api/repos/info');
  var req = create_request(opts);
  try {
    req.send();
  }
  catch (e) {
    if (opts.hasOwnProperty('error')) {
      opts.error(e);
    }
    else {
     throw e;
    }
  }
}

Connection.prototype.get = function(opts) {
  console.log('The Connection.get() method has been deprecated. Please use the repo method instead.');
  this.repo(opts);
}

Connection.prototype.repo = function(opts) {
  opts = opts || {};
  opts.url = this.createUrl('api/repo/' + opts.uuid + '/' + opts.endpoint);
  var req = create_request(opts);
  try {
    req.send(opts.payload);
  }
  catch (e) {
    if (opts.hasOwnProperty('error')) {
      opts.error(e);
    }
    else {
     throw e;
    }
  }
}

Connection.prototype.node = function(opts) {
  opts = opts || {};
  opts.url = this.createUrl('api/node/' + opts.uuid + '/' + opts.endpoint);
  var req = create_request(opts);
  try {
    req.send(opts.payload);
  }
  catch (e) {
    if (opts.hasOwnProperty('error')) {
      opts.error(e);
    }
    else {
     throw e;
    }
  }
}

/**********
 * 
 * Create a new repo on the dvid server. Here is an example:
 *
 * con1.createRepo({
 *   alias: 'Test Repo',
 *   description: 'A test repo created via the web api again',
 *   callback: function(res){
 *     console.log(res);
 *   },
 *   error: function(err) {
 *     console.log(err);
 *   }
 * });
 *
 **********/


Connection.prototype.createRepo = function(opts) {
  opts = opts || {};
  opts.url = this.createUrl('api/repos');
  opts.method = 'POST';

  if (!opts.hasOwnProperty('alias')) {
    var e = new Error('alias required to create data repository');
    if (opts.hasOwnProperty('error')) {
      opts.error(e);
      return;
    }
    else {
     throw e;
    }
  }

  if (!opts.hasOwnProperty('description')) {
    var e = new Error('description required to create data repository');
    if (opts.hasOwnProperty('error')) {
      opts.error(e);
      return;
    }
    else {
     throw e;
    }
  }

  var req = create_request(opts);

  req.setRequestHeader('Content-Type', 'text/plain');

  try {
    req.send('{"alias": "' + opts.alias + '", "description": "' + opts.description + '"}');
  }
  catch (e) {
    if (opts.hasOwnProperty('error')) {
      opts.error(e);
    }
    else {
     throw e;
    }
  }
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
  var xhr = new XMLHttpRequest(),
    method = 'GET';

  if (opts.hasOwnProperty('method')) {
    method = opts.method;
  }


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
          if (this.responseText) {
            opts.callback(JSON.parse(this.responseText));
          }
          else {
            opts.callback();
          }
        }
      } else {

        var error = new Error('Server responded with an error: (' + xhr.status + ') ' + xhr.responseText );
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

  xhr.open(method, opts.url, true);
  return xhr;
}

module.exports = Connection;
