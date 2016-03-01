/*
 * DVID API
 * 
 */

var Connection = require('./connection');

function DVID() {
}

DVID.prototype.about = function () {
  return "This is the dvid api";
}

DVID.prototype.connect = function(config) {
  return new Connection(config);
}

DVID.prototype.version = function() {
  return require(__dirname + '/../package.json').version;
}

var dvid = new DVID();

module.exports = dvid;



