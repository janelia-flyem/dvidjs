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
 * @param {function} options.error - callback function to handle error response from the server
 * @param {function} options.callback - callback function to handle successful response from the server.
 * @example
 * con1.serverInfo({
 *   callback: function(res){
 *     console.log(res);
 *   },
 *   error: function(err) {
 *     console.log(err);
 *   }
 * });
 */

Connection.prototype.serverInfo = function(options) {
  options = options || {};
  options.url = this.createUrl('api/server/info');
  var req = create_request(options);
  try {
    req.send();
  }
  catch (e) {
    if (options.hasOwnProperty('error')) {
      options.error(e);
    }
    else {
     throw e;
    }
  }
}

/**
 * Get a list of data types currently in use on the server - /api/server/types
 * @param {Object} options
 * @param {function} options.error - callback function to handle error response from the server
 * @param {function} options.callback - callback function to handle successful response from the server.
 * @example
 * con1.serverTypes({
 *   callback: function(res){
 *     console.log(res);
 *   },
 *   error: function(err) {
 *     console.log(err);
 *   }
 * });
 */

Connection.prototype.serverTypes = function(options) {
  options = options || {};
  options.url = this.createUrl('api/server/types');
  var req = create_request(options);
  try {
    req.send();
  }
  catch (e) {
    if (options.hasOwnProperty('error')) {
      options.error(e);
    }
    else {
     throw e;
    }
  }
}
/**
 * Fetch the list of data types the server provides - /api/server/compiled-types
 * @param {Object} options
 * @param {function} options.error - callback function to handle error response from the server
 * @param {function} options.callback - callback function to handle successful response from the server.
 * @example
 * con1.serverCompiledTypes({
 *   callback: function(res){
 *     console.log(res);
 *   },
 *   error: function(err) {
 *     console.log(err);
 *   }
 * });
 */
Connection.prototype.serverCompiledTypes = function(options) {
  options = options || {};
  options.url = this.createUrl('api/server/compiled-types');
  var req = create_request(options);
  try {
    req.send();
  }
  catch (e) {
    if (options.hasOwnProperty('error')) {
      options.error(e);
    }
    else {
     throw e;
    }
  }
}

/**
 * Provides current server load information
 * @param {Object} options
 * @param {function} options.error - callback function to handle error response from the server
 * @param {function} options.callback - callback function to handle successful response from the server.
 * @example
 * con1.serverCompiledTypes({
 *   callback: function(res){
 *     console.log(res);
 *   },
 *   error: function(err) {
 *     console.log(err);
 *   }
 * });
 */
Connection.prototype.load = function(options) {
  options = options || {};
  options.url = this.createUrl('api/load');
  var req = create_request(options);
  try {
    req.send();
  }
  catch (e) {
    if (options.hasOwnProperty('error')) {
      options.error(e);
    }
    else {
     throw e;
    }
  }
}

/**
 * Meta information about all the repositories stored on the server.
 * @param {Object} options
 * @param {function} options.error - callback function to handle error response from the server
 * @param {function} options.callback - callback function to handle successful response from the server.
 * @example
 * con1.reposInfo({
 *   callback: function(res){
 *     console.log(res);
 *   },
 *   error: function(err) {
 *     console.log(err);
 *   }
 * });
 */
Connection.prototype.reposInfo = function(options) {
  options = options || {};
  options.url = this.createUrl('api/repos/info');
  var req = create_request(options);
  try {
    req.send();
  }
  catch (e) {
    if (options.hasOwnProperty('error')) {
      options.error(e);
    }
    else {
     throw e;
    }
  }
}

/**
 * Get information from a single repository end point.
 * @param {Object} options
 * @deprecated
 */
Connection.prototype.get = function(options) {
  console.warn('The Connection.get() method has been deprecated. Please use the repo method instead.');
  this.repo(options);
}

/**
 * Get information from a single repository end point.
 * @param {Object} options
 * @param {string} options.endpoint
 * @param {string} options.uuid - unique id assigned to the repository
 * @param {string} [options.method=GET] - "POST", "GET", "DELETE"
 * @param {function} options.error - callback function to handle error response from the server
 * @param {function} options.callback - callback function to handle successful response from the server.
 * @example
 * con1.repo({
 *   endpoint: 'info',
 *   uuid: '77a05ca7347f988583c25d82d7250',
 *   callback: function(res){
 *     console.log(res);
 *   },
 *   error: function(err) {
 *     console.log(err);
 *   }
 * });
 */
Connection.prototype.repo = function(options) {
  options = options || {};
  options.url = this.createUrl('api/repo/' + options.uuid + '/' + options.endpoint);
  var req = create_request(options);
  try {
    req.send(options.payload);
  }
  catch (e) {
    if (options.hasOwnProperty('error')) {
      options.error(e);
    }
    else {
     throw e;
    }
  }
}

/**
 * Get information from a single node end point.
 * @param {Object} options
 * @param {string} options.endpoint
 * @param {string} [options.method=GET] - "POST", "GET", "DELETE"
 * @param {string} options.uuid
 * @param {function} options.error - callback function to handle error response from the server
 * @param {function} options.callback - callback function to handle successful response from the server.
 * @example
 * con1.node({
 *   endpoint: 'info',
 *   uuid: '77a05ca7347f988583c25d82d7250',
 *   callback: function(res){
 *     console.log(res);
 *   },
 *   error: function(err) {
 *     console.log(err);
 *   }
 * });
 */
Connection.prototype.node = function(options) {
  options = options || {};
  options.url = this.createUrl('api/node/' + options.uuid + '/' + options.endpoint);
  var req = create_request(options);
  try {
    req.send(options.payload);
  }
  catch (e) {
    if (options.hasOwnProperty('error')) {
      options.error(e);
    }
    else {
     throw e;
    }
  }
}

/**
 * Create a new repo on the dvid server. Here is an example:
 * @param {Object} options
 * @param {string} options.alias - A short plain english name for the repository
 * @param {string} options.description - A longer description of the repositories purpose or contents
 * @param {function} options.error - callback function to handle error response from the server
 * @param {function} options.callback - callback function to handle successful response from the server.
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

Connection.prototype.createRepo = function(options) {
  options = options || {};
  options.url = this.createUrl('api/repos');
  options.method = 'POST';

  if (!options.hasOwnProperty('alias')) {
    var e = new Error('alias required to create data repository');
    if (options.hasOwnProperty('error')) {
      options.error(e);
      return;
    }
    else {
     throw e;
    }
  }

  if (!options.hasOwnProperty('description')) {
    var e = new Error('description required to create data repository');
    if (options.hasOwnProperty('error')) {
      options.error(e);
      return;
    }
    else {
     throw e;
    }
  }

  var req = create_request(options);

  req.setRequestHeader('Content-Type', 'text/plain');

  try {
    req.send('{"alias": "' + options.alias + '", "description": "' + options.description + '"}');
  }
  catch (e) {
    if (options.hasOwnProperty('error')) {
      options.error(e);
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
 * @param {Object} options -
 * @param {string} options.uuid - the node uuid
 * @param {string} options.tileSource - the name of the data source that the tiles are stored in.
 * @param {string} options.axis - choose either xy, xz or yz
 * @param {number} options.size - the size of the tile in pixels, eg: 500
 * @param {number} options.x - the x coordinate
 * @param {number} options.y - the y coordinate
 * @param {number} options.z - the z coordinate
 *
 * @example
 * // returns http://www.dvidserver.com/api/node/29a77a05ca7347f988583c25d82d7250/imagetiles/xy/512_512/20/45/2030/jpg
 * var url  = con.isoImageUrl({
 *  uuid: '29a77a05ca7347f988583c25d82d7250',
 *  tileSource: 'imagetiles',
 *  axis: 'xy',
 *  size: 512,
 *  x: 20,
 *  y: 45,
 *  z: 2030
 * });
 **/
Connection.prototype.isoImageUrl = function(options) {
  var path = 'api/node/' + options.uuid + '/' + options.tileSource + '/isotropic/' + options.axis + '/' + options.size + '_' + options.size + '/' + options.x + '_' + options.y + '_' + options.z + '/jpg';

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
 * @param {Object} options
 * @param {string} options.method - http verb to use: POST, PUT, GET or DELETE
 * @param {boolean} options.data - set to true if expecting a non text/json response.
 * @param {function} options.error - callback function to handle error response from the server
 * @param {function} options.callback - callback function to handle successful response from the server.
 * @example
 * // returns http://www.dvidserver.com
 * var request  = create_request()
 **/
function create_request(options) {
  options = options || {};
  var xhr = new XHR(),
    method = 'GET';

  if (options.hasOwnProperty('method')) {
    method = options.method;
  }


  // make sure we get back the correct data object.
  if (options.data) {
    xhr.responseType = "arraybuffer";
  }

  if (options.hasOwnProperty('callback')) {
    xhr.onload = function() {
      if (xhr.status === 200) {

        /* if we are expecting an array buffer, then we don't want to
         * try and parse it into a JSON object. */
        if (xhr.responseType === "arraybuffer") {
          options.callback.call(this);
        } else {
          if (this.responseText) {
            var response = this.responseText;

            try {
              response = JSON.parse(this.responseText);
            }
            catch(e) {
              console.warn("Couldn't parse response as JSON: " + e);
            }

            options.callback(response);
          }
          else {
            options.callback();
          }
        }
      } else {

        var error = new Error('Server responded with an error: (' + xhr.status + ') ' + xhr.responseText );
        if (options.hasOwnProperty('error')) {
          options.error(error);
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
  if (options.error) {
    xhr.onerror = function(err) {
      options.error(new Error('Failed to connect to the server'));
    }
  }
  else {
    xhr.onerror = function(err) {
      throw new Error('Failed to connect to the server and no error callback set.');
    }
  }

  xhr.open(method, options.url, true);
  return xhr;
}

module.exports = Connection;
