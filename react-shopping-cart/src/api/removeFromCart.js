'use strict';

const User = require('../models/User');

module.exports = function removeFromCart(req, res, next) {
  const { _id } = req.user;
  const opts = { new: true };
  User.findOneAndUpdate({ _id }, { $pull: { cart: req.body.song } }, opts).
    populate('cart').
    exec().
    then(user => res.json({ user })).
    catch(next);
};