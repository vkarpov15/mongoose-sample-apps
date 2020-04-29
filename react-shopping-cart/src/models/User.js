'use strict';

const mongoose = require('mongoose');

require('./connect');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  cart: [{ type: mongoose.ObjectId, ref: 'Song', required: true }]
});

module.exports = mongoose.model('User', userSchema);