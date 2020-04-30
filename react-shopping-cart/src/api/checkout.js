'use strict';

const Purchase = require('../models/Purchase');
const config = require('../../config');
const stripe = require('stripe')(config.stripePrivateKey);

module.exports = function checkout(req, res, next) {
  const intentId = req.body.intentId || '';

  return Purchase.findOne({ intentId }).
    then(doc => {
      if (doc != null) {
        throw new Error(`Intent id ${intentId} was already used`);
      }

      const getStripeData = stripe.paymentIntents.retrieve(req.body.intentId);
      const populateCart = req.user.populate('cart').execPopulate();
      return Promise.all([getStripeData, populateCart]);
    }).
    then(([intent]) => {
      const { user } = req;
      const paid = intent.amount;
      const cartAmount = user.cart.
        reduce((sum, song) => sum + Math.round(song.price * 100), 0);
      if (paid !== cartAmount) {
        throw new Error(`Paid ${paid} but got ${cartAmount} in cart`);
      }

      return Purchase.create(user.cart.map(song => ({ user, song, intentId })));
    }).
    then(() => {
      req.user.cart = [];
      return req.user.save();
    }).
    then(() => res.json({ user: req.user })).
    catch(next);
};