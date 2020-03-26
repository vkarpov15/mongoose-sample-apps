'use strict';

const express = require('express');

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
app.get('/users', require('./findUsers'));

// Error handling middleware
app.use(function(err, req, res, next) {
  res.status(500).json({ message: err.message });
});

module.exports = app;