'use strict';

const Vue = require('vue');
const VueRouter = require('vue-router');
const http = require('./helpers/http');

require('./dashboard');
require('./home');
require('./login');
require('./navbar');
require('./register');

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: { template: '<home />' }
    },
    {
      path: '/login',
      component: { template: '<login @success="$emit(\'login\', $event)" />' }
    },
    {
      path: '/register',
      component: { template: '<register />' }
    },
    {
      path: '/dashboard',
      component: { template: '<dashboard />' }
    },
  ]
});

const App = () => new Vue({
  router,
  data: () => {
    // __INITIAL_STATE__ from SSR
    return typeof window !== 'undefined' && window.__INITIAL_STATE__ ?
      window.__INITIAL_STATE__ :
      ({ user: null });
  },
  mounted: async function() {
    if (this.user != null) {
      return;
    }

    let user;
    try {
      user = await http.get('/api/me').then(res => res.data.user);
    } catch (err) {
      return;
    }

    this.user = user;
  },
  methods: {
    onLogin: async function(data) {
      const token = data.token;
      document.cookie = `token=${token}`;

      let user;
      try {
        user = await http.get('/api/me').then(res => res.data.user);
      } catch (err) {
        window.localStorage.setItem('token', null);
        this.$router.push({ path: '/' });
        return;
      }
      this.user = user;
      this.$router.push({ path: 'dashboard' });
    }
  },
  template: `
    <div id="content">
      <navbar :user="user"></navbar>
      <div class="content">
        <router-view @login="onLogin($event)"></router-view>
      </div>
    </div>
  `
});

module.exports = App;

if (typeof window !== 'undefined') {
  App().$mount('#content');
}