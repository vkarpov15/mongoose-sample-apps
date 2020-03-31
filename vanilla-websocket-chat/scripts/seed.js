'use strict';

const fixture = require('../test/fixture');
const mongoose = require('mongoose');

fixture().
  then(() => console.log('Seeded database')).
  catch(err => console.log(err)).
  finally(() => mongoose.disconnect());