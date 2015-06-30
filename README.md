DVIDjs
======

JavaScript API to access a DVID server


Install
=======

    npm install /path/to/dvid/repo/clone

Examples
========

```javascript
require('dvid');

var con1 = dvid.connect({host: 'localhost', port: '8000'});

con1.serverInfo(function(response) {
  console.log(response);
});
```
