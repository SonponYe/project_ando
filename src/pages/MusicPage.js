// src/pages/MusicPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchTracks } from '../api/spotify/api';

const moods = [
  { name: 'Happy', color: '#FFD700' },
  { name: 'Chill', color: '#00CED1' },
  { name: 'Energetic', color: '#FF4500' },
  { name: 'Sad', color: '#708090' },
];

const genres = ['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Afrobeats'];

const MusicPage = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle Explore button (mood + genre)
  const handleExplore = async () => {
    if (!selectedMood && !selectedGenre) return;
    setLoading(true);
    const query = [selectedMood, selectedGenre].filter(Boolean).join(' ');
    const tracks = await searchTracks(query);
    setLoading(false);
    navigate('/music-list', { state: { tracks } });
  };

  // Handle search bar submit
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    const tracks = await searchTracks(searchQuery);
    setLoading(false);
    navigate('/music-list', { state: { tracks } });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1>🎧 Discover Music</h1>

      {/* Mood Cards */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {moods.map((mood) => (
          <div
            key={mood.name}
            onClick={() => setSelectedMood(mood.name)}
            style={{
              backgroundColor: mood.color,
              color: 'white',
              padding: '1rem',
              borderRadius: '10px',
              cursor: 'pointer',
              flex: 1,
              textAlign: 'center',
              boxShadow: selectedMood === mood.name ? '0 0 10px black' : '',
              userSelect: 'none',
            }}
          >
            {mood.name}
          </div>
        ))}
      </div>

      {/* Genre Dropdown */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="genre-select" style={{ marginRight: '0.5rem' }}>Genre:</label>
        <select
          id="genre-select"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">Select genre</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>

      {/* Explore Button */}
      <button
        onClick={handleExplore}
        disabled={loading || (!selectedMood && !selectedGenre)}
        style={{
          backgroundColor: '#4F46E5',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          border: 'none',
          cursor: loading || (!selectedMood && !selectedGenre) ? 'not-allowed' : 'pointer',
          marginBottom: '2rem',
          width: '100%',
          fontWeight: 'bold',
        }}
      >
        {loading ? 'Searching...' : 'Explore'}
      </button>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Search songs, artists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#000',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default MusicPage;
