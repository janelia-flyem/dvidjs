/**
 * @module dvid
 */

var url = require('url');

var XHR = undefined

if (typeof window === 'undefined') {
  XHR = require("xmlhttprequest").XMLHttpRequest;
}
else {
  XHR = window.XMLHttpRequest;
}

/**
 * Connection object
 * @constructor
 * @param {Object} options - Connection configuration options
 * @param {string} options.host - The hostname to connect to, eg: www.example.com
 * @param {string} options.port - The port the DVID server is listening on. eg: 8500
 * @param {string} options.protocol - choose either http or https
 */
function Connection(options) {
  options = options || {};
  var match = /(https?):\/\/(.*)/.exec(options.host);
  if (match) {
    options.host = match[2];
    options.protocol = match[1]
  }
  this.config = {
    host: options.host,
    port: options.port,
    protocol: options.protocol || "http"
  };
}

/**
 * Gather meta data from the dvid server - /api/server/info
 * @param {Object} options
 * @param {function} options.error
 * @param {function} options.callback
 */

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

/**
 * Get a list of data types currently in use on the server - /api/server/types
 * @param {Object} options
 * @param {function} options.error
 * @param {function} options.callback
 */

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
/**
 * Fetch the list of data types the server provides - /api/server/compiled-types
 * @param {Object} opts
 * @param {function} opts.error
 * @param {function} opts.callback
 */
Connection.prototype.serverCompiledTypes = function(opts) {
  opts = opts || {};
  opts.url = this.createUrl('api/server/compiled-types');
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

/**
 * Provides current server load information
 * @param {Object} opts
 * @param {function} opts.error
 * @param {function} opts.callback
 */
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

/**
 * Meta information about all the repositories stored on the server.
 * @param {Object} opts
 * @param {function} opts.error
 * @param {function} opts.callback
 */
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

/**
 * Get information from a single repository end point.
 * @param {Object} opts
 * @deprecated
 */
Connection.prototype.get = function(opts) {
  console.warn('The Connection.get() method has been deprecated. Please use the repo method instead.');
  this.repo(opts);
}

/**
 * Get information from a single repository end point.
 * @param {Object} opts
 * @param {function} opts.error
 * @param {function} opts.callback
 */
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

/**
 * Get information from a single node end point.
 * @param {Object} opts
 * @param {function} opts.error
 * @param {function} opts.callback
 */
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

/**
 * Create a new repo on the dvid server. Here is an example:
 * @param {Object} opts
 * @param {string} opts.alias - A short plain english name for the repository
 * @param {string} opts.description - A longer description of the repositories purpose or contents
 * @param {function} opts.error
 * @param {function} opts.callback
 * @example
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
 **/

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

/**
 * Build a full URL based on a supplied path.
 * @param {string} path - The path to an endpoint on the DVID server.
 * @example
 * // returns http://www.dvidserver.com/test/path
 * var url  = con.createUrl('/test/path')
 **/
Connection.prototype.createUrl = function(path) {
  var hostString = this.hostString();

  return url.resolve(hostString, path);
}

/**
 * Build a url to fetch a an iso image from a specific node
 * @param {Object} opts -
 *
 * @example
 * // returns http://www.dvidserver.com/api/node/
 * var url  = con.createUrl('/test/path')
 **/
Connection.prototype.isoImageUrl = function(opts) {
  var path = 'api/node/' + opts.uuid + '/' + opts.tileSource + '/isotropic/' + opts.axis + '/' + opts.size + '_' + opts.size + '/' + opts.x + '_' + opts.y + '_' + opts.z + '/jpg';

  return this.createUrl(path);
}

/**
 * Generate a host string based on configuration provided during object creation.
 * @example
 * // returns http://www.dvidserver.com
 * var url  = con.hostString()
 **/
Connection.prototype.hostString = function() {
  var hostString = '/';

  if (this.config.host) {
    hostString = this.config.protocol + "://" + this.config.host;
  }

  if (this.config.port) {
    hostString += ":" + this.config.port;
  }
  return hostString;
}


/**
 * Generate an xhr request object.
 * @private
 * @example
 * // returns http://www.dvidserver.com
 * var request  = create_request()
 **/
function create_request(opts) {
  opts = opts || {};
  var xhr = new XHR(),
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
            var response = this.responseText;

            try {
              response = JSON.parse(this.responseText);
            }
            catch(e) {
              console.warn("Couldn't parse response as JSON: " + e);
            }

            opts.callback(response);
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
