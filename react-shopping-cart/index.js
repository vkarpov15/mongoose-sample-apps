'use strict';

const api = require('./src/api');
const config = require('./config');
const express = require('express');

const app = express();

// Ensure that `req.query` values are always strings or nullish,
// no arrays or objects.
app.set('query parser', 'simple');

app.use(express.static('./public'));
app.use('/api', api());

const port = config.port || 3000;
app.listen(config.port);
console.log('Listening on port ' + config.port);

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const compiler = webpack(require('./webpack.config.js'));

  compiler.watch({ poll: 1000 }, err => {
    if (err == null) {
      return console.log('Webpack build finished successfully');
    }
    console.log(`Webpack build finished with error: ${err}`);
  });
}