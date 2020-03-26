'use strict';

const User = require('../models/User');

module.exports = function findUsers(req, res, next) {
  User.find(req.query).
    then(users => res.json({ users })).
    catch(next);
};