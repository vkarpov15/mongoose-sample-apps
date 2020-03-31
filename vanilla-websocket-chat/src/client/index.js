'use strict';

const axios = require('axios');

const state = {
  token: window.localStorage.getItem('accessToken'),
  messages: null
};

let socket = null;

init();

function init() {
  document.querySelector('#nav .action').addEventListener('click', function() {
    if (!state.token) {
      document.querySelector('.modal-footer').innerHTML = '';
      document.querySelector('#modal').style = 'display: block';
    } else {
      onLoggedOut();
    }
  });
  document.querySelector('.modal-mask').addEventListener('click', function(ev) {
    if (ev.srcElement.className === 'modal-wrapper') {
      document.querySelector('#modal').style = 'display: none';
    }
  });

  if (!state.token) {
    onLoggedOut();
  } else {
    onLoggedIn(state.token);
  }
}

function fetchMessages() {
  return axios.get('/messages', { headers: { authorization: state.token } }).
    then(res => {
      state.messages = res.data.messages.reverse();
      const container = document.querySelector('#messages');
      container.innerHTML = '';
      for (const message of state.messages) {
        addMessage(message, container);
      }

      container.scrollTo(0, container.scrollHeight);
    });
}

function addMessage(message, container) {
  container = container || document.querySelector('#messages');
  const msg = document.createElement('div');
  msg.innerHTML = `
    <div class="message">
      <span class="timestamp">${new Date(message.createdAt).toLocaleString()}</span>
      <span class="user">${message.userName}:&nbsp;</span>
      <span class="message-body">${message.body}</span>
    </div>
  `;
  container.appendChild(msg);
}

function onLoggedIn(token) {
  window.localStorage.setItem('accessToken', token);
  state.token = token;

  socket = new WebSocket(`ws://localhost:3000`, ['access_token', token]);

  socket.onerror = onLoggedOut;
  socket.onclose = onLoggedOut;
  socket.onopen = () => {
    fetchMessages();
  };
  socket.onmessage = msg => {
    document.querySelectorAll('#input form input').forEach(el => { el.disabled = false; });

    msg = JSON.parse(msg.data);
    if (!msg.error) {
      addMessage(msg.res);
    }
  };

  document.querySelector('#nav .action').textContent = 'Logout';
  document.querySelectorAll('#input form input').forEach(el => { el.disabled = false; });
  document.querySelector('#input form input[type="text"]').placeholder =
    'Your Message Here';
  document.querySelector('#modal').style = 'display: none';
}

function onLoggedOut() {
  window.localStorage.setItem('accessToken', '');
  state.token = null;
  state.messages = null;
  const container = document.querySelector('#messages');
  container.innerHTML = '';

  document.querySelector('#nav .action').textContent = 'Login';
  document.querySelectorAll('#input form input').forEach(el => { el.disabled = true; });
  document.querySelector('#input form input[type="text"]').placeholder =
    'Log In to Send Messages';
}

window.onLogin = function onLogin() {
  const email = document.querySelector('#login-form input[name="email"]').value;
  const password = document.querySelector('#login-form input[name="password"]').value;
  axios.post('/login', { email, password }).
    then(res => {
      const token = res.data.token;
      document.querySelector('#login-form input[name="email"]').value = '';
      document.querySelector('#login-form input[name="password"]').value = '';
      onLoggedIn(token);
    }).
    catch(() => {
      document.querySelector('.modal-footer').textContent = 'Login Failed';
    });
};

window.onSubmit = function onSubmit() {
  const body = document.querySelector('#input input[type="text"]').value;
  document.querySelectorAll('#input form input').forEach(el => { el.disabled = true; });
  socket.send(JSON.stringify({ body }));

  document.querySelector('#input input[type="text"]').value = '';
};