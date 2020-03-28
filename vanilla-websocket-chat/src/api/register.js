'use strict';

const AuthenticationMethod =
  require('../models/AuthenticationMethod');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = function register(req, res, next) {
  User.create(req.body).
    then(user => {
      return bcrypt.hash(req.body.password, 4).
        then(secret => AuthenticationMethod.create({ user, secret })).
        then(() => user);
    }).
    then(user => res.json(user)).
    catch(next);
};