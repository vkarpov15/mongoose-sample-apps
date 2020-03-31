'use strict';

const AuthenticationMethod =
  require('../src/models/AuthenticationMethod');
const Message = require('../src/models/Message');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

module.exports = async function() {
  const promises = Object.values(mongoose.models).
    map(Model => Model.deleteMany());
  await Promise.all(promises);

  const users = await User.create([
    { name: 'Alice', email: 'alice@mit.edu' },
    { name: 'Bob', email: 'bob@mit.edu' }
  ]);

  for (const user of users) {
    const secret = await bcrypt.hash(user.name.toLowerCase(), 4);
    await AuthenticationMethod.create({ user, secret });
  }

  await Message.create({
    user: users[0]._id,
    userName: users[0].name,
    body: 'I hope Carol doesn\'t read this'
  });
};