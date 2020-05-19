'use strict';

const Vue = require('vue');
const axios = require('axios');
const http = require('./helpers/http');

module.exports = Vue.component('register', {
  data: () => ({ email: '', password: '', error: null }),
  methods: {
    submit: async function(ev) {
      ev.preventDefault();

      const body = { email: this.email, password: this.password };
      let res;
      try {
        res = await http.post('/api/register', body);
      } catch (err) {
        this.error = err.message;
        return;
      }

      this.$router.push({ path: 'login' });
    }
  },
  template: `
    <div>
      <h1>Register</h1>
      <form class="login" @submit="submit($event)">
        <div>
          <label for="email">Email</label>
          <input type="text" v-model="email" id="email" />
        </div>
        <div>
          <label for="password">Password</label>
          <input type="password" v-model="password" id="password" />
        </div>
        <div>
          <button type="submit">Register</button>
        </div>
        <div class="error" v-if="error">
          {{error}}
        </div>
      </form>
    </div>
  `
});