'use strict';

const Stock = require('../src/models/Stock');
const User = require('../src/models/User');
const assert = require('assert');
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const server = require('../');
const webpack = require('webpack');

describe('E2E', function() {
  let browser;
  let page;

  this.timeout(15000);

  before(function compileClient() {
    return new Promise((resolve, reject) => {
      webpack(require('../webpack.config')).run(err => {
        if (err == null) {
          return resolve();
        }
        reject(err);
      });
    });
  });

  after(async function() {
    if (process.env.D) {
      return;
    }
    await server.close();
    await browser.close();
    await mongoose.disconnect();
  });

  before(() => server);

  beforeEach(async () => {
    await User.deleteMany();
  });
  beforeEach(async function() {
    browser = await puppeteer.launch({ headless: !process.env.D, devtools: !!process.env.D });
    page = await browser.newPage();
    await page.setViewport({
      width: 1024,
      height: 768
    });
  });

  it('register, login, add stock', async function() {
    await Stock.updateOne({ symbol: 'MDB' }, { name: 'MongoDB', price: 201 }, { upsert: true });

    await page.goto('http://localhost:3000');

    let content = await page.evaluate(() => document.querySelector('.nav .name').innerHTML);
    assert.ok(content.includes('Vue Stocks'));

    await page.goto('http://localhost:3000/register');
    await page.evaluate(function register() {
      document.querySelector('#email').value = 'alice@mit.edu';
      document.querySelector('#email').dispatchEvent(new Event('input'));
      document.querySelector('#password').value = 'alice';
      document.querySelector('#password').dispatchEvent(new Event('input'));
      document.querySelector('form').dispatchEvent(new Event('submit'));
    });

    await page.waitForNavigation();

    await page.evaluate(function login() {
      document.querySelector('#email').value = 'alice@mit.edu';
      document.querySelector('#email').dispatchEvent(new Event('input'));
      document.querySelector('#password').value = 'alice';
      document.querySelector('#password').dispatchEvent(new Event('input'));
      document.querySelector('form').dispatchEvent(new Event('submit'));
    });

    await page.waitForNavigation();
    await page.waitForSelector('.input input[type="text"]');

    await page.evaluate(function addStock() {
      document.querySelector('.input input[type="text"]').value = 'MDB';
      document.querySelector('.input input[type="text"]').dispatchEvent(new Event('input'));
      document.querySelector('.input input[type="number"]').value = 10;
      document.querySelector('.input input[type="number"]').dispatchEvent(new Event('input'));
      document.querySelector('form').dispatchEvent(new Event('submit'));
    });

    await page.waitForSelector('.stock');

    const numStocks = await page.evaluate(function countStocks() {
      return document.querySelectorAll('.stock').length;
    });
    assert.equal(numStocks, 1);
    const total = await page.evaluate(function countStocks() {
      return document.querySelector('.summary').innerHTML;
    });
    assert.equal(total.match(/\d+\.\d+/), '2010.00');
  });
});