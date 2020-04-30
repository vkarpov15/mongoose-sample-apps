'use strict';

const AuthenticationMethod = require('../src/models/AuthenticationMethod');
const Song = require('../src/models/Song');
const User = require('../src/models/User');
const api = require('../');
const assert = require('assert');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const mongoose = require('mongoose');
const neatCsv = require('neat-csv');
const puppeteer = require('puppeteer');
const webpack = require('webpack');

const webpackConfig = require('../webpack.config');

describe('e2e test', function() {
  this.timeout(15000);

  before(function compileClient() {
    return new Promise((resolve, reject) => {
      webpack(webpackConfig).run(err => {
        if (err == null) {
          return resolve();
        }
        reject(err);
      });
    });
  });

  before(async function seedDatabase() {
    const data = await neatCsv(fs.createReadStream('./scripts/songs.csv'));

    await Song.deleteMany({});
    await User.deleteMany({});
    await AuthenticationMethod.deleteMany({});

    for (let i = 0; i < Math.min(data.length, 400); ++i) {
      const song = {
        name: data[i]['song_name'],
        artist: data[i]['artist_name'],
        album: data[i]['album_names'],
        image: data[i].image,
        price: (i % 3) + 1,
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
      await Song.create(song);
    }

    const user = new User({ email: 'alice@mit.edu' });
    await user.save();

    const secret = await bcrypt.hash('alice', 4);
    await AuthenticationMethod.create({ user, secret });
  });

  before(() => api);
  after(async function() {
    await api.close();
    await mongoose.disconnect();
  });

  let browser;
  let page;

  beforeEach(async function() {
    browser = await puppeteer.launch({ headless: !process.env.D, devtools: !!process.env.D });
    page = await browser.newPage();
    await page.setViewport({
      width: 1024,
      height: 768
    });
  });

  afterEach(async function() {
    if (process.env.D) {
      return;
    }
    await browser.close();
  });

  it('home page', async function() {
    await page.goto('http://localhost:3000');

    const content = await page.evaluate(() => document.querySelector('.nav .name').innerHTML);
    assert.ok(content.includes('React Music'));
  });

  it('login', async function() {
    await login(page);
    const url = await page.evaluate(() => window.location.href);
    assert.equal(url, 'http://localhost:3000/#/');

    const links = await page.evaluate(() => {
      const els = document.querySelectorAll('.nav a');
      const text = [];
      els.forEach(el => text.push(el.innerHTML));
      return text;
    });
    assert.ok(links.includes('Library'));
    assert.ok(links.includes('Cart'));
  });

  describe('authed', function() {
    beforeEach(function() {
      return login(page);
    });

    it('checkout', async function() {
      await page.goto('http://localhost:3000');

      // Search
      await page.evaluate(function searchForSong() {
        document.querySelector('.search input[type="text"]').value = 'jungle';
        document.querySelector('.search input[type="text"]').dispatchEvent(new Event('change'));
        document.querySelector('form.search').dispatchEvent(new Event('submit'));
      });

      await page.waitForSelector('.song');
      const numResults = await page.evaluate(function getNumSearchResults() {
        return Array.from(document.querySelectorAll('.song')).length;
      });
      assert.equal(numResults, 1);

      // Add to cart
      await page.evaluate(function addToCart() {
        document.querySelector('.song .add-to-cart form').dispatchEvent(new Event('submit'));
      });

      await page.waitFor(function waitForAddToCart() {
        return document.querySelector('.song .add-to-cart b').innerHTML === '-';
      });

      // Check out
      await page.goto('http://localhost:3000/#/cart');
      await page.waitForSelector('tr.summary');

      const totalCost = await page.evaluate(function getCost() {
        return document.querySelector('tr.summary td:nth-of-type(2)').innerHTML;
      });
      assert.equal(totalCost.trim(), '$2.00');

      await page.waitForSelector('#card-element');
      await page.evaluate(function fakeCardPayment() {
        window.stripe.confirmCardPayment = () => Promise.resolve({
          paymentIntent: { id: 'pi_1GddZGD3Wg9v9YjrJi1DTP6e' }
        });

        document.querySelector('#payment-form').dispatchEvent(new Event('submit'));
      });

      // Check cart
      await page.waitForNavigation();
      await page.waitForSelector('.song');
      const numSongs = await page.evaluate(function getNumSongs() {
        return Array.from(document.querySelectorAll('.song')).length;
      });
      assert.equal(numSongs, 1);

      const songDescription = await page.evaluate(function getSongDescription() {
        return document.querySelector('.song .song-description').innerHTML.trim();
      });
      assert.equal(songDescription, '"Welcome To The Jungle" - Guns N\' Roses');
    });
  });
});

async function login(page) {
  await page.goto('http://localhost:3000/#/login');

  await page.evaluate(() => {
    document.querySelector('input[name="email"]').value = 'alice@mit.edu';
    document.querySelector('input[name="email"]').dispatchEvent(new Event('change'));
    document.querySelector('input[name="password"]').value = 'alice';
    document.querySelector('input[name="password"]').dispatchEvent(new Event('change'));

    document.querySelector('form').dispatchEvent(new Event('submit'));
  });

  await page.waitForNavigation();
  return;
}