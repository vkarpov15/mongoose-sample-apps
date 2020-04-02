'use strict';

const mongoose = require('mongoose');

require('./connect');

const schema = mongoose.Schema({
  user: { type: 'ObjectId', required: true, ref: 'User' },
  userName: { type: String, required: true, trim: true },
  body: { type: String, required: true }
}, { timestamps: true });

schema.index({ createdAt: -1 });

module.exports = mongoose.model('Message', schema);
