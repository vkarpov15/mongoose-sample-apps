'use strict';

const Vue = require('vue');

module.exports = Vue.component('navbar', {
  props: ['user'],
  template: `
  <div class="nav">
    <div class="branding">
      <div class="name">
        <a href="/">
          <div class="logo"><img src="/images/logo.svg"></div>
          <div class="name">Vue Stocks</div>
        </a>
      </div>
      <div class="links" v-if="user">
        <router-link to="dashboard">Dashboard</router-link>
      </div>
      <div class="links" v-if="!user">
        <router-link to="login">Login</router-link>
        <router-link to="register">Register</router-link>
      </div>
      <div class="clear"></div>
    </div>
  </div>
  `
});