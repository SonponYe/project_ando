// src/pages/MusicPage.js
import React, { useState, useEffect } from 'react';
import { fetchUserTopTracks, getSavedTracks, searchTracks } from '../api/spotify/api';

const moods = [
  { name: 'Happy', color: '#FFD700' },
  { name: 'Chill', color: '#00CED1' },
  { name: 'Energetic', color: '#FF4500' },
  { name: 'Sad', color: '#708090' },
];

const genres = ['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Afrobeats'];

const MusicPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      const saved = await getSavedTracks();
      setFavorites(saved);
      const top = await fetchUserTopTracks();
      setTracks(top);
    };
    fetchInitialData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const results = await searchTracks(searchQuery);
    setTracks(results);
  };

  const handleMoodClick = (mood) => {
    setSelectedMood(mood);
    setSearchQuery(mood);
    handleSearch({ preventDefault: () => {} });
  };

  const handleGenreChange = (e) => {
    const genre = e.target.value;
    setSelectedGenre(genre);
    setSearchQuery(genre);
    handleSearch({ preventDefault: () => {} });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🎧 Your Music Feed</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search songs, artists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '0.5rem', width: '60%' }}
        />
        <button type="submit" style={{ padding: '0.5rem', marginLeft: '0.5rem' }}>
          Search
        </button>
      </form>

      {/* Mood Cards */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {moods.map((mood) => (
          <div
            key={mood.name}
            onClick={() => handleMoodClick(mood.name)}
            style={{
              backgroundColor: mood.color,
              color: 'white',
              padding: '1rem',
              borderRadius: '10px',
              cursor: 'pointer',
              flex: 1,
              textAlign: 'center',
              boxShadow: selectedMood === mood.name ? '0 0 10px black' : '',
            }}
          >
            {mood.name}
          </div>
        ))}
      </div>

      {/* Genre Dropdown */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ marginRight: '0.5rem' }}>Genre:</label>
        <select value={selectedGenre} onChange={handleGenreChange}>
          <option value="">Select genre</option>
          {genres.map((genre) => (
            <option key={genre}>{genre}</option>
          ))}
        </select>
      </div>

      {/* Track List */}
      <h2>Results</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {tracks.map((track) => (
          <div key={track.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <strong>{track.name}</strong> – {track.artists[0].name}
            <br />
            <audio controls src={track.preview_url} style={{ marginTop: '0.5rem' }} />
          </div>
        ))}
      </div>

      {/* Favorites */}
      <h2 style={{ marginTop: '2rem' }}>❤️ Favorites</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {favorites.map((track) => (
          <div key={track.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <strong>{track.name}</strong> – {track.artists[0].name}
            <br />
            <audio controls src={track.preview_url} style={{ marginTop: '0.5rem' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicPage;
