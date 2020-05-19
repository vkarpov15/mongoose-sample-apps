'use strict';

const mongoose = require('mongoose');

require('./connect');

const stockSchema = mongoose.Schema({
  symbol: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number
  }
});

stockSchema.index({ symbol: 'text', name: 'text' });

module.exports = mongoose.model('Stock', stockSchema);