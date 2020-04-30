'use strict';

const express = require('express');

module.exports = () => {
  const app = express.Router();

  app.use(express.json());

  app.post('/login', require('./login'));
  app.post('/register', require('./register'));

  // Pull `req.user`, but don't throw an error if it doesn't exist
  app.use(require('./loadUser'));
  app.get('/songs', require('./songs'));

  // The rest of the functionality requires being logged in.
  app.use(require('./requireAuth'));

  app.get('/me', require('./me'));
  app.get('/stripeSecret', require('./stripeSecret'));
  app.get('/purchased', require('./purchased'));

  app.put('/addToCart', require('./addToCart'));
  app.put('/checkout', require('./checkout'));
  app.put('/removeFromCart', require('./removeFromCart'));

  // Error handling middleware
  app.use(function(err, req, res, next) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(err.stack);
    }
    res.status(err.status || 500).json({ message: err.message });
  });

  return app;
};