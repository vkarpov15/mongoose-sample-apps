'use strict';

const Stock = require('../models/Stock');

// Hard coded list
const symbols = ['MDB', 'MSFT', 'AAPL', 'AMZN', 'NFLX'];

module.exports = function popularStocks(req, res, next) {
  Stock.find({ symbol: { $in: symbols } }).
    sort({ symbol: 1 }).
    then(stocks => res.json({ stocks })).
    catch(next);
};