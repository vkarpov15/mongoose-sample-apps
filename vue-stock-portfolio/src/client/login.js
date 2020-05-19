'use strict';

const Vue = require('vue');
const http = require('./helpers/http');

module.exports = Vue.component('login', {
  data: () => ({ email: '', password: '', error: null, inProgress: false }),
  methods: {
    submit: async function(ev) {
      ev.preventDefault();

      const body = { email: this.email, password: this.password };
      let res;
      this.inProgress = true;
      try {
        res = await http.post('/api/login', body);
      } catch (err) {
        this.error = err.message;
        this.inProgress = false;
        return;
      }

      this.$emit('success', res.data);
    }
  },
  template: `
    <div>
      <h1>Login</h1>
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
          <button type="submit" :disabled="inProgress">Login</button>
        </div>
        <div class="error" v-if="error">
          {{error}}
        </div>
      </form>
    </div>
  `
});