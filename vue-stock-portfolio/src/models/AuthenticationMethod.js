'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

require('./connect');

let Model = mongoose.model('AuthenticationMethod', Schema({
  secret: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.ObjectId,
    ref: 'User',
    required: true
  }
}));

module.exports = Model;