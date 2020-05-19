'use strict';

const mongoose = require('mongoose');

require('./connect');

const holdingSchema = mongoose.Schema({
  stockId: {
    type: mongoose.ObjectId,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    validate: v => v > 0
  },
  userId: {
    type: mongoose.ObjectId,
    required: true,
    index: true
  }
});

holdingSchema.virtual('stock', {
  ref: 'Stock',
  localField: 'stockId',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Holding', holdingSchema);