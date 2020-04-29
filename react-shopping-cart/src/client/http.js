'use strict';

const axios = require('axios');

const http = axios.create();

http.interceptors.request.use(request => {
  const token = window.localStorage.getItem('token');
  if (token) {
    request.headers['Authorization'] = token;
  }
  return request;
});

module.exports = http;