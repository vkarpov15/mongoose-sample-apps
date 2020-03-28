'use strict';

module.exports = function updateUser(req, res, next) {
  req.user.set(req.body);
  req.user.save().
    then(() => res.json(req.user)).
    catch(next);
};