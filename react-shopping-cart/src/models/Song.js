'use strict';

const mongoose = require('mongoose');

require('./connect');

const songSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  album: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  popularity: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  acousticness: {
    type: Number,
    required: true
  },
  danceability: {
    type: Number,
    required: true
  },
  loudness: {
    type: Number,
    required: true
  }
}, { strictQuery: true });

songSchema.virtual('purchased', {
  ref: 'Purchase',
  localField: '_id',
  foreignField: 'song._id',
  justOne: true,
  select: { user: 1 }
});

songSchema.index({ name: 'text', artist: 'text', album: 'text' });

module.exports = mongoose.model('Song', songSchema);