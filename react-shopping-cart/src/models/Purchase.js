'use strict';

const Song = require('./Song');
const mongoose = require('mongoose');

require('./connect');

const purchaseSchema = mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'User',
    required: true
  },
  song: {
    type: Song.schema,
    required: true
  },
  intentId: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);