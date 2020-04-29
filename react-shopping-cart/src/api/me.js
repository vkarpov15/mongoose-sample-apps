'use strict';

module.exports = function me(req, res, next) {
  req.user.populate('cart').execPopulate().
    then(() => res.json({ user: req.user })).
    catch(next);
};