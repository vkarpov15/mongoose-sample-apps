'use strict';

const jsonwebtoken = require('jsonwebtoken');
const secretToken = require('./secretToken');

module.exports = function checkAuth(req, res, next) {
  let data;
  try {
    data = jsonwebtoken.verify(req.headers.authorization, secretToken);
  } catch (err) {
    return next(err);
  }

  User.findOne({ _id: data.userId }).orFail().
    then(user => {
      req.user = user;
      next();
    }).
    catch(next);
};