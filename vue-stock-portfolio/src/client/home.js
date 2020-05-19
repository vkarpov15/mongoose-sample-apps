'use strict';

const Vue = require('vue');
const http = require('./helpers/http');

module.exports = Vue.component('home', {
  data: () => ({ stocks: [] }),
  mounted: async function() {
    if (this.stocks.length > 0) {
      return;
    }
    this.stocks = await http.get('/api/popularStocks').
      then(res => res.data.stocks);
  },
  template: `
    <div>
      <h1>Popular Stocks</h1>
      <div class="list">
        <div class="stock" v-for="stock in stocks">
          <div class="info">
            <div class="symbol">{{stock.symbol}}</div>
            <div class="name">{{stock.name}}</div>
          </div>
          <div class="quantities">
            <div class="price">\${{stock.price.toFixed(2)}}</div>
          </div>
          <div style="clear: both"></div>
        </div>
      </div>
    </div>
  `
});