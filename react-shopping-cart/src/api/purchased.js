'use strict';

const Purchased = require('../models/Purchase');

module.exports = function purchased(req, res, next) {
  const skip = req.query.skip ? +req.query.skip : 0;
  const limit = req.query.limit ? +req.query.limit : 10;

  Purchased.find({ user: req.user._id }).
    sort({ createdAt: -1 }).
    skip(skip).
    limit(limit).
    exec().
    then(purchased => res.json({ purchased })).
    catch(next);
};