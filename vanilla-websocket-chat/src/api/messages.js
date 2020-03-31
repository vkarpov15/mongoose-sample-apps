'use strict';

const Message = require('../models/Message');

module.exports = function messages(req, res, next) {
  Message.find().sort({ createdAt: -1 }).limit(100).
    then(messages => res.json({ messages })).
    catch(next);
};