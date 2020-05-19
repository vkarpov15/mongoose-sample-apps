'use strict';

const Vue = require('vue');
const http = require('./helpers/http');

module.exports = Vue.component('dashboard', {
  data: () => ({
    user: null,
    holdings: [],
    state: 'LOADING',
    error: null,
    searchText: '',
    searchHasFocus: false,
    quantity: null,
    searchResults: []
  }),
  mounted: async function() {
    let res;
    try {
      res = await http.get('/api/holdings');
    } catch (err) {
      this.error = err.message;
      this.state = 'ERROR';
      return;
    }

    this.user = res.data.user;
    this.holdings = res.data.holdings;
    this.state = 'LOADED';
  },
  methods: {
    autocomplete: async function() {
      if (this.searchText.length < 2) {
        return;
      }
      const params = { search: this.searchText };
      const res = await http.get('/api/search', { params }).
        catch(() => null);
      if (res != null) {
        this.searchResults = res.data.stocks;
      }
    },
    addStock: async function(ev) {
      ev.preventDefault();

      const body = { symbol: this.searchText, quantity: this.quantity };
      let holding;
      try {
        holding = await http.post('/api/holding', body).
          then(res => res.data.holding);
      } catch (err) {
        this.error = err.message;
        return;
      }

      this.holdings.push(holding);
      this.searchText = '';
      this.quantity = null;
    }
  },
  computed: {
    total: function() {
      const total = this.holdings.reduce((sum, holding) => {
        return sum + holding.stock.price * holding.quantity;
      }, 0);
      return total.toFixed(2);
    }
  },
  template: `
    <div>
      <div v-if="state === 'LOADING'">
        Loading...
      </div>
      <div v-if="state === 'LOADED'">
        <h1>{{user.email}}'s Portfolio</h1>
        <form @submit="addStock($event)" class="add-stock">
          <h3>Add Stock</h3>
          <div class="input">
            <input
              type="text"
              placeholder="Symbol or Name"
              v-model="searchText"
              @keyup="autocomplete()"
              @focus="searchHasFocus = true"
              @blur="searchHasFocus = false">
            <div class="autocomplete" v-if="searchHasFocus && searchResults && searchResults.length">
              <div v-for="stock in searchResults" @mousedown="searchText = stock.symbol">
                {{stock.name}} ({{stock.symbol}})
              </div>
            </div>
          </div>
          <div class="input">
            <input type="number" placeholder="Quantity" v-model="quantity">
          </div>
          <div class="input">
            <button>Add</button>
          </div>
          <div class="error" v-if="error">
            {{error}}
          </div>
        </form>
        <div v-if="holdings.length === 0">
          No stocks yet!
        </div>
        <div v-if="holdings.length > 0">
          <div class="stock" v-for="holding in holdings">
            <div class="info">
              <div class="symbol">{{holding.stock.symbol}}</div>
              <div class="name">{{holding.stock.name}}</div>
            </div>
            <div class="quantities">
              <div class="price">\${{holding.stock.price}}</div>
              <div class="quantity">{{holding.quantity}} Shares</div>
            </div>
            <div style="clear: both"></div>
          </div>
          <div class="summary">
            Total Portfolio Value: \${{total}}
          </div>
          <div style="clear: both"></div>
        </div>
      </div>
      <div v-if="state === 'ERROR'">
        <div class="error">{{error}}</div>
      </div>
    </div>
  `
});