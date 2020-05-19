'use strict';

const mongoose = require('mongoose');

require('./connect');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);