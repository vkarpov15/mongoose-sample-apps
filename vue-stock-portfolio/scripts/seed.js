'use strict';

const Stock = require('../src/models/Stock');
const axios = require('axios');
const neatCsv = require('neat-csv');

run().catch(err => console.log(err));

async function run() {
  await Stock.deleteMany();

  const data = await axios.get('https://old.nasdaq.com/screening/companies-by-name.aspx?letter=0&exchange=nasdaq&render=download').
    then(res => res.data).
    then(data => neatCsv(data));
  
  for (const line of data) {
    const name = line['Name'];
    const symbol = line['Symbol'];
    const price = +line['LastSale'];
    if (!symbol || Number.isNaN(price)) {
      continue;
    }
    console.log('Insert stock:', symbol, price, name);
    /*const url = `https://www.alphavantage.co/query?` +
      `function=GLOBAL_QUOTE&symbol=${symbol}&apikey=U6K93HBERFVD6OR7`;
    const data = await axios.get(url).then(res => res.data);
    console.log('X', data)
    const price = +data['Global Quote']['05. price'];*/

    await Stock.create({ name, symbol, price });
  }

  console.log('Done');
  process.exit(0);
}