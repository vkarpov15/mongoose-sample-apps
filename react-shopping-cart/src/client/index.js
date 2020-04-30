'use strict';

const Cart = require('./components/cart');
const DOM = require('react-dom');
const Library = require('./components/library');
const Login = require('./components/login');
const React = require('react');
const Register = require('./components/register');
const Router = require('react-router-dom');
const Songs = require('./components/songs');
const http = require('./http');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null, status: 'LOADING', error: null };
  }

  componentDidMount() {
    this.fetchUser();
  }

  fetchUser() {
    return http.get('/api/me').
      then(res => res.data).
      then(data => {
        this.setState({ user: data.user, status: 'LOGGED_IN', error: null });
      }).
      catch(err => {
        if (err.response.status === 401) {
          return this.setState({
            user: null,
            status: 'NOT_LOGGED_IN',
            error: null
          });
        }
        this.setState({ user: null, status: 'ERROR', error: err.message });
      });
  }

  updateCart(cart) {
    if (this.state == null) {
      return;
    }
    const { user } = this.state;
    if (user == null) {
      return;
    }
    this.setState({ ...this.state, user: { ...user, cart } });
  }

  onLogin(token) {
    window.localStorage.setItem('token', token);
    this.fetchUser().
      then(() => { window.location.hash = '/'; });
  }

  onUpdateCart(user) {
    this.setState({ ...this.state, user });
  }

  onCheckout(user) {
    this.setState({ ...this.state, user });
    window.location.hash = '/library';
  }

  onRegister() {
    window.location.hash = '/login';
  }

  waitForAuth(fn) {
    if (this.state.status === 'LOADING') {
      return (<div>Loading...</div>);
    }
    return fn();
  }

  render() {
    const onLogin = (token) => this.onLogin(token);
    const onUpdateCart = user => this.onUpdateCart(user);
    const onCheckout = user => this.onCheckout(user);
    const onRegister = () => this.onRegister();

    console.log('TT', this.state.user);
    const cart = this.state.user == null ? [] : this.state.user.cart;
    return (
      <Router.HashRouter>
        <div>
          <div class="nav">
            <div class="branding">
              <div class="name">
                <a href="/">React Music Shop</a>
              </div>
              <div class="links">
                <Router.Link to="/">Songs</Router.Link>
                <UserNav status={this.state.status}></UserNav>
              </div>
              <div class="clear"></div>
            </div>
          </div>

          <div class="allwrapper">
            <div class="content">
              <Router.Switch>
                <Router.Route exact path="/">
                  <div>
                    <Songs onUpdateCart={onUpdateCart} />
                  </div>
                </Router.Route>
                <Router.Route path="/cart">
                  { this.waitForAuth(() => <Cart cart={cart} onCheckout={onCheckout} />) }
                </Router.Route>
                <Router.Route path="/library">
                  { this.waitForAuth(() => <Library />) }
                </Router.Route>
                <Router.Route path="/login">
                  <Login onLogin={onLogin} />
                </Router.Route>
                <Router.Route path="/register">
                  <Register onRegister={onRegister} />
                </Router.Route>
              </Router.Switch>
            </div>
          </div>
        </div>
      </Router.HashRouter>
    );
  }
}

function UserNav(props) {
  if (props.status === 'NOT_LOGGED_IN') {
    return (
      <span>
        <Router.Link to="/login">Login</Router.Link>
        <Router.Link to="/register">Register</Router.Link>
      </span>
    );
  }
  if (props.status === 'LOGGED_IN') {
    return (
      <span>
        <Router.Link to="/library">Library</Router.Link>
        <Router.Link to="/cart">Cart</Router.Link>
      </span>
    );
  }

  return <span></span>;
}

if (typeof window !== 'undefined') {
  const el = document.getElementById('app');
  DOM.render(<App />, el);
}