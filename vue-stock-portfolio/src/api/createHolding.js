'use strict';

const Holding = require('../models/Holding');
const Stock = require('../models/Stock');

module.exports = function createHolding(req, res, next) {
  Stock.findOne({ symbol: { $eq: req.body.symbol } }).
    orFail().
    then(stock => {
      const doc = new Holding({
        ...req.body,
        stockId: stock._id,
        userId: req.user._id
      });
      doc.stock = stock;
      return doc.save();
    }).
    then(holding => res.json({ holding })).
    catch(next);
};