/**
 * DVID API
 * @module dvid
 * @author Jody Clements
 */

var Connection = require('./connection');

/**
 * DVID object
 * @constructor
 */
function DVID() {
}

/** 
 * about
 * @method
 * @returns {string}
 * @example
 * var about = dvid.about()
 */
DVID.prototype.about = function () {
  return "This is the dvid api";
}
/**
 * connect
 * @method
 * @param {Object} config
 * @see {@link dvid:Connection} for configuration values 
 * @return {Object} a connection object pointing to a single DVID server
 * @example
 * var conn = dvid.connect({host: 'example.com', port: 1234 })
 */
DVID.prototype.connect = function(config) {
  return new Connection(config);
}

/**
 * version
 * @method
 * @returns {string} the current version of the API 
 * @example
 * var version = dvid.version()
 */

DVID.prototype.version = function() {
  return require(__dirname + '/../package.json').version;
}

var dvid = new DVID();

module.exports = dvid;



