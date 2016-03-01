DVIDjs
======

JavaScript API to access a DVID server

[![Build Status](https://drone.io/github.com/janelia-flyem/dvidjs/status.png)](https://drone.io/github.com/janelia-flyem/dvidjs/latest)

Install
=======

    npm install dvid

Examples
========

```javascript
require('dvid');

var con1 = dvid.connect({host: 'localhost', port: '8000'});

con1.serverInfo({
  callback: function(res) {
    console.log('There are ' + res.Cores + ' on the server.');
  },
  error: function(err) {
    console.log('Something went wrong: ' + err.message);
  }
});
```
