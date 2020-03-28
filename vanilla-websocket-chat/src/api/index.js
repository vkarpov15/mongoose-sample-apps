'use strict';

const express = require('express');
const handleUpgrade = require('./websocket');

module.exports = port => {
  const app = express();
  // Ensure that `req.query` values are always strings or nullish,
  // no arrays or objects.
  app.set('query parser', 'simple');
  app.use(express.json());

  app.post('/login', require('./login'));
  app.post('/register', require('./register'));

  // The rest of the functionality requires being logged in.
  app.use(require('./checkAuth'));

  app.put('/user', require('./updateUser'));

  // Error handling middleware
  app.use(function(err, req, res, next) {
    res.status(500).json({ message: err.message });
  });

  const server = app.listen(port);
  // See https://masteringjs.io/tutorials/express/websockets
  server.on('upgrade', handleUpgrade);

  return server;
};