'use strict';

const AuthenticationMethod = require('../src/models/AuthenticationMethod');
const Song = require('../src/models/Song');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const neatCsv = require('neat-csv');

run().catch(err => console.error(err));

async function run() {
  // Song data adapted from:
  // https://www.kaggle.com/edalrami/19000-spotify-songs/data
  const data = await neatCsv(fs.createReadStream(`${__dirname}/songs.csv`));

  await Song.deleteMany({});
  await User.deleteMany({});
  await AuthenticationMethod.deleteMany({});

  for (let i = 0; i < data.length; ++i) {
    const song = {
      name: data[i]['song_name'],
      artist: data[i]['artist_name'],
      album: data[i]['album_names'],
      image: data[i].image,
      price: getRandomPrice(),
      popularity: data[i]['song_popularity'],
      duration: data[i]['song_duration_ms'],
      acousticness: data[i].acousticness,
      danceability: data[i].danceability,
      loudness: data[i].loudness
    };

    const existing = await Song.findOne({ name: song.name, artist: song.artist });
    if (existing != null) {
      continue;
    }

    console.log('Create Song', song);
    await Song.create(song);
  }

  const user = new User({ email: 'alice@mit.edu' });
  console.log('Create User', user);
  await user.save();

  const secret = await bcrypt.hash('alice', 4);
  await AuthenticationMethod.create({ user, secret });

  console.log('Done');

  process.exit(0);
}

function getRandomPrice() {
  const prices = [0.79, 0.99, 1.09, 1.29, 1.79, 2.49];
  return prices[Math.floor(Math.random() * prices.length)];
}