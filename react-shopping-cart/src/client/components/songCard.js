'use strict';

const React = require('react');
const Router = require('react-router-dom');

module.exports = props => (
  <div class="song">
    <div class="picture">
      <img src={props.image}></img>
    </div>
    <div class="title">
      <Router.Link to={'/song/' + props._id}>
        "{props.name}" - {props.artist}
      </Router.Link>
      <div class="stats">
        <span class="stat">Duration: {durationToString(props.duration)}</span>
        <span class="stat">Popularity: {props.popularity.toFixed(2)}</span>
        <span class="stat">Danceability: {props.danceability.toFixed(2)}</span>
        <span class="stat">Loudness: {props.loudness.toFixed(2)}</span>
        <span class="stat">Acousticness: {props.acousticness.toFixed(2)}</span>
      </div>
    </div>
    <AddToCartButton
      price={props.price}
      addToCart={props.addToCart}
      removeFromCart={props.removeFromCart}
      _id={props._id}
      purchased={props.purchased}
      inCart={props.inCart} />
    <div class="clear"></div>
  </div>
);

function AddToCartButton(props) {
  if (props.purchased) {
    return (
      <div class="add-to-cart">
        <button>&#x25B6; Play</button>
      </div>
    );
  }
  if (props.addToCart == null) {
    return (
      <div class="add-to-cart">
        <button>${props.price}</button>
      </div>
    );
  }

  if (props.inCart !== true) {
    return (
      <div class="add-to-cart">
        <button onClick={() => props.addToCart(props)}><b>+</b> ${props.price}</button>
      </div>
    );
  }

  return (
    <div class="add-to-cart">
      <button onClick={() => props.removeFromCart(props)}><b>-</b> ${props.price}</button>
    </div>
  );
}

function durationToString(ms) {
  const m = Math.floor(ms / (60 * 1000));
  let s = Math.floor(ms / 1000) % 60;
  if (s < 10) {
    s = '0' + s;
  }

  return `${m}:${s}`;
}