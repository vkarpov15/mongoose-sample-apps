'use strict';

const mongoose = require('mongoose');

require('./connect');

module.exports = mongoose.model('User', mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  }
}));