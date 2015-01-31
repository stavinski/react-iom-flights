'use strict';

var express = require('express'),
    app = express(),
    serveStatic = require('serve-static');

// serve static files from public
app.use(serveStatic('public', {'index': ['index.html']}));

if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorhandler());
}

app.listen(3000, function () {
  console.info('react iom flights listening on port: 3000');
});
