'use strict';

const Song = require('../models/Song');

module.exports = function songs(req, res, next) {
  const skip = req.query.skip ? +req.query.skip : 0;
  const limit = req.query.limit ? +req.query.limit : 10;

  const filter = {};
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  const query = Song.find(filter).
    skip(skip).
    limit(limit).
    sort({ popularity: -1 });
  // If we have a user id, populate `purchased`, which will be
  // nullish if the user has **not** bought this song.
  const songsInCart = new Set();
  if (req.user) {
    query.populate({ path: 'purchased', match: { user: req.user._id } });

    for (const song of req.user.cart) {
      songsInCart.add(song.toString());
    }
  }
  
  query.
    exec().
    then(songs => {
      return songs.map(s => ({
        ...s.toObject(),
        inCart: songsInCart.has(s._id.toString())
      }));
    }).
    then(songs => res.json({ songs })).
    catch(next);
};