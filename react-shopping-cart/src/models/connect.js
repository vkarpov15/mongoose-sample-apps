'use strict';

const config = require('../../config');
const mongoose = require('mongoose');

mongoose.connect(config.mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set('toJSON', { virtuals: true });
mongoose.set('toObject', { virtuals: true });