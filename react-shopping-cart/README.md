# react-shopping-cart

A lightweight React music store app with a Mongoose-backed API.
Here's a video demo:

<div style="position: relative; padding-bottom: 56.25%; height: 0;"><iframe src="https://www.loom.com/embed/8585c9edd5384572b29f15d9035bf77a" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

Song data adapted from the [19000 Spotify Songs data set](https://www.kaggle.com/edalrami/19000-spotify-songs/data).

## Setup

First, a couple assumptions:

1. Make sure you have MongoDB running locally on port 27017. Or modify the `mongodbUri` in `config.js` with your MongoDB connection string.
2. For your convenience, test keys for Stripe are included in `config.js` and `src/client/config.js`. You can change them to your own keys if you want to use a different account.

To run:

1. `npm install`
2. `npm run seed` to seed your local database. Note that this will delete a few collections in the `test` database by default.
3. `npm run dev`
4. Go to `http://localhost:3000`