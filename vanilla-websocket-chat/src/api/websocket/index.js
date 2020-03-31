'use strict';

const Message = require('../../models/Message');
const User = require('../../models/User');
const jsonwebtoken = require('jsonwebtoken');
const secretToken = require('../secretToken');
const ws = require('ws');

// Set up a headless websocket server that prints any
// events that come in.
const server = new ws.Server({ noServer: true });

server.on('connection', (socket, req) => {
  const { user } = req;
  const userName = user.name;
  socket.on('message', message => {
    try {
      message = JSON.parse(message);
    } catch (err) {
      return sendError(socket, err);
    }

    Message.create({ ...message, user, userName }).
      then(doc => server.clients.forEach(client => sendSuccess(client, doc))).
      catch(err => {
        console.log('Error', err);
        return sendError(socket, err);
      });
  });

  function sendError(socket, err) {
    socket.send(JSON.stringify({ error: true, message: err.message }));
  }
  function sendSuccess(socket, res) {
    socket.send(JSON.stringify({ error: false, res }));
  }
});

module.exports = function handleUpgrade(request, socket, head) {
  // See https://stackoverflow.com/questions/22383089/is-it-possible-to-use-bearer-authentication-for-websocket-upgrade-requests
  const token = request.headers['sec-websocket-protocol'] == null ?
    null :
    request.headers['sec-websocket-protocol'].slice('access_token, '.length);

  let data;
  try {
    data = jsonwebtoken.verify(token, secretToken);
  } catch (err) {
    return socket.destroy();
  }

  User.findOne({ _id: data.userId }).orFail().
    then(user => {
      request.user = user;
      server.handleUpgrade(request, socket, head, socket => {
        server.emit('connection', socket, request);
      });
    }).
    catch(() => socket.destroy());
};