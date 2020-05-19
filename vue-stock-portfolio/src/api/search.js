'use strict';

const Stock = require('../models/Stock');

module.exports = function search(req, res, next) {
  const skip = req.query.skip ? +req.query.skip : 0;
  const filter = {};
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  Stock.
    find(filter).
    skip(skip).
    limit(10).
    then(stocks => res.json({ stocks })).
    catch(next);
};