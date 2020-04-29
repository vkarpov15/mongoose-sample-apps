'use strict';

const React = require('react');
const http = require('../http');

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { status: 'INIT', error: null };
    this.email = React.createRef();
    this.password = React.createRef();
  }

  login(ev) {
    ev.preventDefault();
    const [email, password] = ['email', 'password'].
      map(prop => this[prop].current.value);
    http.post('/api/login', { email, password }).
      then(res => res.data).
      then(data => this.props.onLogin(data.token)).
      catch(err => {
        this.setState({ status: 'ERROR', err: err.message });
      });
  }

  render(props) {
    const login = ev => this.login(ev);

    return (
      <div class="login">
        <h1>Login</h1>
        <form onSubmit={login}>
          <div>
            <label for="email">Email</label>
            <input type="email" name="email" ref={this.email}></input>
          </div>
          <div>
            <label for="password">Password</label>
            <input type="password" name="password" ref={this.password}></input>
          </div>
          <button type="submit">Login</button>
          <LoginError status={this.state.status} error={this.state.err} />
        </form>
      </div>
    );
  }
}

function LoginError(props) {
  if (props.status !== 'ERROR') {
    return <span></span>;
  }
  return <div class="error">{props.error}</div>;
}

module.exports = Login;