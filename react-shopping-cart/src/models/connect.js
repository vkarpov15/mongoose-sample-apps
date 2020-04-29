'use strict';

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set('toJSON', { virtuals: true });
mongoose.set('toObject', { virtuals: true });