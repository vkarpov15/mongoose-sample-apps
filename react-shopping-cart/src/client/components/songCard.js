'use strict';

const React = require('react');

module.exports = props => (
  <div class="song">
    <div class="picture">
      <img src={props.image}></img>
    </div>
    <div class="title">
      <span class="song-description">
        "{props.name}" - {props.artist}
      </span>
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
  const addToCart = ev => {
    ev.preventDefault();
    props.addToCart(props);
  };
  const removeFromCart = ev => {
    ev.preventDefault();
    props.removeFromCart(props);
  };

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
        <form onSubmit={addToCart}>
          <button><b>+</b> ${props.price}</button>
        </form>
      </div>
    );
  }

  return (
    <div class="add-to-cart">
      <form onSubmit={removeFromCart}>
        <button><b>-</b> ${props.price}</button>
      </form>
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