DVIDjs
======

JavaScript API to access a DVID server


Install
=======

  npm install dvid

Examples
========

```javascript
require('dvid');

var con1 = dvid.connect({host: 'localhost', port: '8000'});

con1.serverInfo(function(response) {
  console.log(response);
});
```
