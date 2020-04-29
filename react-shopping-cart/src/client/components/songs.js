'use strict';

const React = require('react');
const SongCard = require('./songCard');
const http = require('../http');

class Songs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { songs: [], status: 'LOADING', error: null, addingToCart: {} };
    this.query = React.createRef();
  }

  componentDidMount() {
    this.getSongs();
  }

  getSongs(query) {
    let songs = this.state.songs;
    if (query != null) {
      songs = [];
      this.setState({
        ...this.state,
        songs,
        status: 'LOADING',
        error: null,
        query
      });
    }

    const skip = songs == null ? 0 : songs.length;
    const params = { skip, limit: 15 };
    if (query != null) {
      params.search = encodeURIComponent(query);
    }
    http.get('/api/songs', { params }).
      then(res => res.data).
      then(({ songs }) => this.setState({
        songs: this.state.songs.concat(songs),
        error: null,
        status: 'LOADED'
      })).
      catch(err => this.setState({ songs: [], error: err.message, status: 'ERROR' }));
  }

  addToCart(song) {
    if (this.state.addingToCart[song._id]) {
      return;
    }
    this.setState({
      ...this.state,
      addingToCart: { ...this.state.addingToCart, [song._id]: true }
    });
    http.put('/api/addToCart', { song: song._id }).
      then(res => res.data.user).
      then(user => {
        this.setState({
          ...this.state,
          songs: this.state.songs.map(s => {
            if (s._id === song._id) {
              return { ...s, inCart: true };
            }
            return s;
          }),
          addingToCart: { ...this.state.addingToCart, [song._id]: false }
        });

        this.props.onUpdateCart(user);
      }).
      catch(err => this.setState({ songs: [], error: err.message, status: 'ERROR' }));
  }

  removeFromCart(song) {
    if (this.state.addingToCart[song._id]) {
      return;
    }
    this.setState({
      ...this.state,
      addingToCart: { ...this.state.addingToCart, [song._id]: true }
    });
    http.put('/api/removeFromCart', { song: song._id }).
      then(res => res.data.user).
      then(user => {
        this.setState({
          ...this.state,
          songs: this.state.songs.map(s => {
            if (s._id === song._id) {
              return { ...s, inCart: false };
            }
            return s;
          }),
          addingToCart: { ...this.state.addingToCart, [song._id]: false }
        });

        this.props.onUpdateCart(user);
      }).
      catch(err => this.setState({ songs: [], error: err.message, status: 'ERROR' }));
  }

  search(ev) {
    ev.preventDefault();

    this.getSongs(this.query.current.value);
  }

  render() {
    const addToCart = song => this.addToCart(song);
    const removeFromCart = song => this.removeFromCart(song);
    const search = ev => this.search(ev);

    if (this.state === null) {
      return (<div>Loading...</div>);
    }
    const { songs, status, error } = this.state;

    if (status === 'LOADING') {
      return (<div>Loading...</div>);
    }
    if (status === 'ERROR') {
      return (<div>Error loading songs: {error}</div>);
    }

    const getSongs = () => this.getSongs();

    return (
      <div>
        <h1>Songs</h1>
        <form onSubmit={search} class="search">
          <input type="text" placeholder="Search" ref={this.query} />
          <button onClick={search}>Search</button>
        </form>
        <div class="list">
          { songs.map(song => SongCard({ ...song, addToCart, removeFromCart })) }
        </div>
        <div class="list-cta" onClick={getSongs}>
          <button>Load More</button>
        </div>
      </div>
    );
  }
}

module.exports = Songs;