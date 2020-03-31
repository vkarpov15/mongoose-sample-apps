'use strict';

const api = require('./src/api');
const express = require('express');

const app = express();
app.use(express.static('./public'));

api(app, 3000);

console.log('Listening on port 3000');