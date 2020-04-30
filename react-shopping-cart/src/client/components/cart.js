'use strict';

const React = require('react');
const config = require('../config');
const http = require('../http');

const stripe = Stripe(config.stripePublicKey);
const elements = stripe.elements();
window.stripe = stripe;

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { secret: null, status: 'LOADING', error: null };

    this.cardElement = React.createRef();
  }

  componentDidMount() {
    if (this.props.cart.length <= 0) {
      return;
    } 

    http.get('/api/stripeSecret').
      then(res => res.data).
      then(({ secret }) => this.setState({ status: 'LOADED', secret, error: null })).
      catch(err => this.handleErr(err));
    
    this._card = elements.create('card');
    this._card.mount(this.cardElement.current);
  }

  handleErr(err) {
    this.setState({ status: 'ERROR', secret: null, error: err.message });
  }

  pay(ev) {
    ev.preventDefault();
    const data = { payment_method: { card: this._card } };
    stripe.confirmCardPayment(this.state.secret, data).
      then(res => {
        if (res.error != null) {
          throw new Error(res.error.message);
        }

        return http.put('/api/checkout', { intentId: res.paymentIntent.id }).
          then(() => this.props.onCheckout()).
          catch(err => this.handleErr(err));
      }).
      catch(err => this.handleErr(err));
  }

  render() {
    const pay = ev => this.pay(ev);

    const props = this.props;
    const { status } = this.state;

    const showCheckout = status === 'LOADED' && props.cart.length > 0;
    return (
      <div class="cart">
        <h1>My Cart</h1>
        <CartList cart={props.cart}></CartList>

        <div class="error">
          {this.state.error}
        </div>

        <form id="payment-form" onSubmit={pay} style={{display: showCheckout ? 'block' : 'none'}}>
          <div id="card-element" ref={this.cardElement}>
          </div>

          <div id="card-errors" role="alert"></div>

          <div class="button-wrapper">
            <button type="submit" disabled={status !== 'LOADED'}>Pay</button>
          </div>
        </form>
      </div>
    );
  }
}

module.exports = Cart;

function CartList({ cart }) {
  if (cart.length === 0) {
    return <div>Cart is Empty</div>;
  }
  const price = cart.reduce((sum, song) => sum + song.price, 0).toFixed(2);
  return (
    <table>
      <tr>
        <th>
          Song
        </th>
        <th>
          Cost
        </th>
      </tr>
      {
        cart.map(song => {
          return (
            <tr>
              <td>"{song.name}" - {song.artist}</td>
              <td>${song.price}</td>
            </tr>
          );
        })
      }
      <tr class="summary">
        <td>Total</td>
        <td>${price}</td>
      </tr>
    </table>
  );
}