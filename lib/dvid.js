/*
 * DVID API
 * 
 */

var Connection = require('./connection');

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
  return new Connection(config);
}

var dvid = new DVID();

module.exports = dvid;



