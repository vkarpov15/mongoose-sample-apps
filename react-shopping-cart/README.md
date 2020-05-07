# react-shopping-cart

A lightweight React music store app with a Mongoose-backed API.
Here's a video demo: https://www.loom.com/embed/8585c9edd5384572b29f15d9035bf77a

Song data adapted from the [19000 Spotify Songs data set](https://www.kaggle.com/edalrami/19000-spotify-songs/data).

## Setup

1. Make sure you have MongoDB running locally on port 27017. Or modify the `mongodbUri` in `config.js` with your MongoDB connection string.
2. `npm install`
3. `npm run seed` to seed your local database. Note that this will delete a few collections in the `test` database by default.
4. `npm run dev`
5. Go to `http://localhost:3000`

For your convenience, test keys for Stripe are included in `config.js` and `src/client/config.js`. You can change them to your own keys if you want to use a different account. However, if you change the test Stripe keys, `npm test` will fail because the tests hard code a Stripe intent id.

## Testing

Run `npm test` to run the tests in `test/e2e.test.js`. The tests use Puppeteer
to test the app end to end, with the exception of entering in test credit
card numbers.

Run `env D=1 npm test` to run the tests in "debug mode" - show the actual
browser windows the tests are running in, and leave the browser windows
open after the test is done.
