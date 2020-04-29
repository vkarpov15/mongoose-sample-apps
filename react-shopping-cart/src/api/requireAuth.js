'use strict';

module.exports = function requireAuth(req, res, next) {
  if (req.user == null) {
    const err = new Error('Not logged in');
    err.status = 401;
    return next(err);
  }
  return next();
};