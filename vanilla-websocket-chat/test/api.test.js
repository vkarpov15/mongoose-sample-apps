'use strict';

const Message = require('../src/models/Message');
const User = require('../src/models/User');
const api = require('../src/api');
const assert = require('assert');
const axios = require('axios');
const express = require('express');
const fixture = require('./fixture');
const jsonwebtoken = require('jsonwebtoken');
const mongoose = require('mongoose');
const secretToken = require('../src/api/secretToken');
const ws = require('ws');

describe('API', function() {
  this.timeout(5000);

  let server;
  const urlRoot = 'http://localhost:3000';

  before(async function() {
    const app = express();
    server = await api(app, 3000);

    // Wait for all Mongoose models to finish building indexes
    const promises = Object.values(mongoose.models).
      map(Model => Model.init());
    await Promise.all(promises);
  });

  after(async function() {
    await server.close();
    await mongoose.disconnect();
  });

  describe('register and login', function() {
    before(async function() {
      const promises = Object.values(mongoose.models).
        map(Model => Model.deleteMany());
      await Promise.all(promises);
    });

    it('creates a new user and authentication method', async function() {
      const user = {
        name: 'Taco',
        email: 'taco@theleague.com',
        password: 'taco'
      };

      let res = await axios.post(`${urlRoot}/register`, user);
      assert.equal(res.data.name, 'Taco');
      assert.strictEqual(res.data.password, undefined);

      const count = await mongoose.model('AuthenticationMethod').
        countDocuments({});
      assert.equal(count, 1);

      res = await axios.post(`${urlRoot}/login`, user);
      assert.ok(res.data.token);
    });
  });

  describe('authed functionality', function() {
    beforeEach(async function() {
      await fixture();
    });

    it('sending messages with access token', async function() {
      await Message.deleteMany({});
      const alice = await User.findOne({ name: 'Alice' });
      const token = jsonwebtoken.sign({ userId: alice._id }, secretToken);

      const socket = new ws('ws://localhost:3000', ['access_token', token.toString()]);

      await new Promise((resolve, reject) => {
        socket.on('error', err => reject(err));
        socket.on('open', resolve);
      });

      let messages = await Message.find();
      assert.equal(messages.length, 0);

      socket.send(JSON.stringify({ body: 'Hello, World' }));

      const message = await new Promise((resolve) => {
        socket.once('message', msg => resolve(msg));
      }).then(str => JSON.parse(str));

      assert.ok(!message.error);
      assert.equal(message.res.body, 'Hello, World');

      messages = await Message.find();
      assert.equal(messages.length, 1);
      assert.equal(messages[0].body, 'Hello, World');

      socket.close();
    });

    it('fetching messages', async function() {
      const alice = await User.findOne({ name: 'Alice' });
      const token = jsonwebtoken.sign({ userId: alice._id }, secretToken);

      const opts = { headers: { authorization: token } };
      const messages = await axios.get(`${urlRoot}/messages`, opts).
        then(res => res.data.messages);

      assert.equal(messages.length, 1);
      assert.equal(messages[0].userName, 'Alice');
      assert.equal(messages[0].body, 'I hope Carol doesn\'t read this');
    });
  });
});