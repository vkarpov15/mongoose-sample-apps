'use strict';

const React = require('react');
const SongCard = require('./songCard');
const http = require('../http');

class Library extends React.Component {
  constructor(props) {
    super(props);
    this.state = { songs: [], status: 'LOADING', error: null };
  }

  componentDidMount() {
    this.getSongs();
  }

  getSongs() {
    const skip = this.state.songs == null ? 0 : this.state.songs.length;
    http.get('/api/purchased', { params: { skip, limit: 15 } }).
      then(res => res.data).
      then(({ purchased }) => this.setState({
        songs: this.state.songs.concat(purchased.map(p => p.song)),
        error: null,
        status: 'LOADED'
      })).
      catch(err => this.setState({ songs: [], error: err.message, status: 'ERROR' }));
  }

  render() {
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
    if (songs.length === 0) {
      return (
        <div>
          <h1>My Songs</h1>
          <div>No songs purchased yet!</div>
        </div>
      );
    }

    const getSongs = () => this.getSongs();

    return (
      <div>
        <h1>My Songs</h1>
        <div class="list">
          { songs.map(song => SongCard({ ...song, purchased: true })) }
        </div>
        <div class="list-cta" onClick={getSongs}>
          <button>Load More</button>
        </div>
      </div>
    );
  }
}

module.exports = Library;