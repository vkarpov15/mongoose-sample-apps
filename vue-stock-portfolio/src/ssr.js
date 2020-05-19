'use strict';

const AccessToken = require('./models/AccessToken');
const App = require('./client');
const User = require('./models/User');
const Vue = require('vue');

const { renderToString } = require('vue-server-renderer').createRenderer({
  template: `
  <html>
    <head>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <!--vue-ssr-outlet-->

      <script src="https://unpkg.com/vue/dist/vue.js"></script>
      <script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
      <script src="/js/main.js"></script>
    </body>
  </html>
  `
});

Vue.use(require('vue-router'));

module.exports = function ssr(req, res, next) {
  AccessToken.findOne({ _id: { $eq: req.cookies.token } }).
    then(token => token == null ? null : User.findOne({ _id: token.user })).
    then(user => {
      const app = App();
      app.$data.user = user;
      app.$options.router.push(req.url);
      return new Promise((resolve, reject) => {
        app.$options.router.onReady(() => {
          const matchedComponents = app.$options.router.getMatchedComponents();
          if (!matchedComponents.length) {
            return next();
          }
    
          resolve(app);
        }, reject);
      });
    }).
    then(app => renderToString(app, { state: app.$data })).
    then(html => {
      res.set('content-type', 'text/html').send(html);
    }).
    catch(next);
};