DVIDjs
======

JavaScript API to access a DVID server


Install
=======

    npm install /path/to/dvidjs/repo/clone

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
