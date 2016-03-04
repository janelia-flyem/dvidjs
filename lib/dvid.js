/**
 * DVID API
 * @module dvid
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
 * @example
 * var conn = dvid.connect({host: 'example.com', port: 1234 })
 */
DVID.prototype.connect = function(config) {
  return new Connection(config);
}

/**
 * version
 * @method
 * @example
 * // returns the current version of the API 
 * var version = dvid.version()
 */

DVID.prototype.version = function() {
  return require(__dirname + '/../package.json').version;
}

var dvid = new DVID();

module.exports = dvid;



