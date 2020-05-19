'use strict';

const Holding = require('../models/Holding');

module.exports = function holdings(req, res, next) {
  Holding.
    find({ userId: req.user._id }).
    populate('stock').
    then(holdings => res.json({ holdings, user: req.user })).
    catch(next);
};