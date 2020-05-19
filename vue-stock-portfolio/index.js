'use strict';

const api = require('./src/api');
const express = require('express');
const ssr = require('./src/ssr');

const app = express();
app.use(require('cookie-parser')());
app.use(express.static('./public'));

app.get('/', ssr);
app.get('/dashboard', ssr);
app.get('/login', ssr);
app.get('/register', ssr);

app.use('/api', api());

if (process.env.NODE_ENV === 'local') {
  const webpack = require('webpack');
  const compiler = webpack(require('./webpack.config.js'));

  compiler.watch({ poll: 1000 }, err => {
    if (err == null) {
      console.log('Webpack build finished successfully');
    } else {
      console.log(`Webpack build finished with error: ${err}`);
    }
  });
}

module.exports = app.listen(3000);

console.log('Listening on port 3000');