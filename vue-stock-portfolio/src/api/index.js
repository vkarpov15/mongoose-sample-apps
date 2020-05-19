'use strict';

const express = require('express');

module.exports = () => {
  const app = express.Router();

  app.use(express.json());

  app.post('/login', require('./login'));
  app.post('/register', require('./register'));

  app.get('/popularStocks', require('./popularStocks'));

  // The rest of the functionality requires being logged in.
  app.use(require('./checkAuth'));

  app.get('/holdings', require('./holdings'));
  app.get('/me', require('./me'));
  app.get('/search', require('./search'));
  app.post('/holding', require('./createHolding'));

  // Error handling middleware
  app.use(function(err, req, res, next) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(err.stack);
    }
    res.status(err.status || 500).json({ message: err.message });
  });

  return app;
};