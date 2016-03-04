DVIDjs
======
[![Build Status](https://drone.io/github.com/janelia-flyem/dvidjs/status.png)](https://drone.io/github.com/janelia-flyem/dvidjs/latest)

DVIDjs is a JavaScript API built to ineract with a [DVID](https://github.com/janelia-flyem/dvid) server. It is used within the
[dvid-console](https://github.com/janelia-flyem/dvid-console) applicaiton to provide a consistent communication layer.


Install
=======
The simplest way to install is via [npm](https://www.npmjs.com)

    > npm install dvid

Available Methods
=================


Examples
========
1. Get some meta information about the server.
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
Developers
==========

If you wish to hack on the code
    
    clone the repository from github
    change directory into the checkout
    > npm install
    > grunt build
    include the javascript in ./build/dvid.js into your application
