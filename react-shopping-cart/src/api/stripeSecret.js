'use strict';

const config = require('../../config');
const stripe = require('stripe')(config.stripePrivateKey);

module.exports = function stripeSecret(req, res, next) {
  const currency = 'usd'; 

  req.user.populate('cart').execPopulate().
    then(user => {
      return user.cart.
        reduce((sum, song) => sum + Math.round(song.price * 100), 0);
    }).
    then(amount => parseFloat(amount.toFixed(2))).
    then(amount => stripe.paymentIntents.create({ amount, currency })).
    then(intent => res.json({ secret: intent['client_secret'] })).
    catch(next);
};