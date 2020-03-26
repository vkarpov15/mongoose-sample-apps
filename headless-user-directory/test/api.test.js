'use strict';

const api = require('../src/api');
const assert = require('assert');
const axios = require('axios');
const mongoose = require('mongoose');
const seed = require('../scripts/seed');

describe('API', function() {
  let server;
  const urlRoot = 'http://localhost:3000';

  before(async function() {
    server = await api.listen(3000);

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
    beforeEach(async function() {
      const promises = Object.values(mongoose.models).
        map(Model => Model.deleteMany());
      await Promise.all(promises);
    });

    it('creates a new user and authentication method', async function() {
      const user = {
        firstName: 'Taco',
        lastName: 'MacArthur',
        email: 'taco@theleague.com',
        password: 'taco'
      };

      let res = await axios.post(`${urlRoot}/register`, user);
      assert.equal(res.data.firstName, 'Taco');
      assert.strictEqual(res.data.password, undefined);

      const count = await mongoose.model('AuthenticationMethod').
        countDocuments({});
      assert.equal(count, 1);

      res = await axios.post(`${urlRoot}/login`, user);
      assert.ok(res.data.token);
    });

    it('login fails with no password', async function() {
      const user = {
        firstName: 'Taco',
        lastName: 'MacArthur',
        email: 'taco@theleague.com',
        password: 'taco'
      };

      let res = await axios.post(`${urlRoot}/register`, user);
      assert.equal(res.data.firstName, 'Taco');
      assert.strictEqual(res.data.password, undefined);

      const err = await axios.post(`${urlRoot}/login`, { email: 'taco@theleague.com' }).
        then(() => null, err => err);
      assert.ok(err);
    });
  });

  describe('authed functionality', function() {
    let authorization;

    beforeEach(async function() {
      await seed();

      authorization = await mongoose.model('AccessToken').findOne().
        then(doc => doc._id);
    });

    it('update profile', async function() {
      const opts = { headers: { authorization } };
      const res = await axios.put(`${urlRoot}/user`, { lastName: 'Tuesday' }, opts).
        then(res => res.data);
      
      assert.equal(res.firstName, 'Taco');
      assert.equal(res.lastName, 'Tuesday');

      const fromDb = await mongoose.model('User').find();
      assert.equal(fromDb.length, 1);
      assert.equal(fromDb[0].firstName, 'Taco');
      assert.equal(fromDb[0].lastName, 'Tuesday');
    });

    it('fails with no auth header', async function() {
      const err = await axios.put(`${urlRoot}/user`, { lastName: 'Tuesday' }).
        then(() => null, err => err);
      
      assert.ok(err);
    });

    it('find users by name', async function() {
      const opts = { headers: { authorization } };
      let res = await axios.get(`${urlRoot}/users?firstName=Taco`, opts).
        then(res => res.data);
      assert.equal(res.users.length, 1);

      res = await axios.get(`${urlRoot}/users?firstName=Pizza`, opts).
        then(res => res.data);
      assert.equal(res.users.length, 0);
    });
  });
});