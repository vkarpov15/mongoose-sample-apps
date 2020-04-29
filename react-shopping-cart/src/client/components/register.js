'use strict';

const React = require('react');
const http = require('../http');

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = { status: 'INIT', error: null };
    this.email = React.createRef();
    this.password = React.createRef();
  }

  register(ev) {
    ev.preventDefault();
    const [email, password] = ['email', 'password'].
      map(prop => this[prop].current.value);
    http.post('/api/register', { email, password }).
      then(res => res.data).
      then(data => this.props.onRegister(data.token)).
      catch(err => {
        this.setState({ status: 'ERROR', err: err.message });
      });
  }

  render() {
    const register = ev => this.register(ev);

    return (
      <div class="login">
        <h1>Register</h1>
        <form onSubmit={register}>
          <div>
            <label for="email">Email</label>
            <input type="email" name="email" ref={this.email}></input>
          </div>
          <div>
            <label for="password">Password</label>
            <input type="password" name="password" ref={this.password}></input>
          </div>
          <button type="submit">Register</button>
          <RegisterError status={this.state.status} error={this.state.err} />
        </form>
      </div>
    );
  }
}

function RegisterError(props) {
  if (props.status !== 'ERROR') {
    return <span></span>;
  }
  return <div class="error">{props.error}</div>;
}

module.exports = Register;