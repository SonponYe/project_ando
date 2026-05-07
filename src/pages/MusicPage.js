// src/pages/MusicPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchTracks } from '../api/spotify/api';
import { isAuthenticated, initiateAuthFlow } from '../api/spotify/token';

const moods = [
  { name: 'Happy', color: '#404040' },
  { name: 'Chill', color: '#2e2e2e' },
  { name: 'Energetic', color: '#575757' },
  { name: 'Sad', color: '#222222' },
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
    if (!isAuthenticated()) {
      await initiateAuthFlow();
      return;
    }
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
    if (!isAuthenticated()) {
      await initiateAuthFlow();
      return;
    }
    setLoading(true);
    const tracks = await searchTracks(searchQuery);
    setLoading(false);
    navigate('/music-list', { state: { tracks } });
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '700px',
      margin: 'auto',
      background: 'linear-gradient(180deg, rgba(14, 14, 14, 0.94), rgba(8, 8, 8, 0.95))',
      border: '1px solid #2f2f2f',
      borderRadius: '20px',
      boxShadow: '0 18px 40px rgba(0, 0, 0, 0.45)',
      marginTop: '1.5rem',
      marginBottom: '6rem',
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: '800', 
        marginBottom: '2rem',
        color: '#f5f5f5',
        letterSpacing: '-0.5px',
      }}>
        🎧 Discover Music
      </h1>

      {/* Mood Cards */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {moods.map((mood) => (
          <div
            key={mood.name}
            onClick={() => setSelectedMood(mood.name)}
            style={{
              backgroundColor: mood.color,
              color: 'white',
              padding: '1.25rem',
              borderRadius: '14px',
              cursor: 'pointer',
              flex: 1,
              minWidth: '120px',
              textAlign: 'center',
              boxShadow: selectedMood === mood.name
                ? '0 8px 25px rgba(0, 0, 0, 0.55)'
                : '0 4px 12px rgba(0, 0, 0, 0.35)',
              userSelect: 'none',
              fontWeight: '700',
              fontSize: '1rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: selectedMood === mood.name ? 'scale(1.05) translateY(-4px)' : 'scale(1)',
              border: selectedMood === mood.name ? '2px solid #e5e5e5' : '1px solid #3b3b3b',
            }}
          >
            {mood.name}
          </div>
        ))}
      </div>

      {/* Genre Dropdown */}
      <div style={{ marginBottom: '2rem' }}>
        <label 
          htmlFor="genre-select" 
          style={{ 
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: '#d4d4d8',
            fontSize: '0.95rem',
          }}
        >
          Select Genre
        </label>
        <select
          id="genre-select"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          style={{
            width: '100%',
            padding: '0.875rem 1rem',
            borderRadius: '12px',
            border: '2px solid #3b3b3b',
            fontSize: '1rem',
            backgroundColor: '#101010',
            color: '#f5f5f5',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
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
          background: loading || (!selectedMood && !selectedGenre)
            ? '#525252'
            : 'linear-gradient(135deg, #f5f5f5, #d4d4d4)',
          color: '#0a0a0a',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          border: 'none',
          cursor: loading || (!selectedMood && !selectedGenre) ? 'not-allowed' : 'pointer',
          marginBottom: '2rem',
          width: '100%',
          fontWeight: '700',
          fontSize: '1rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.45)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          letterSpacing: '0.3px',
        }}
      >
        {loading ? '🔍 Searching...' : '✨ Explore Music'}
      </button>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem' }}>
        <input
          type="text"
          placeholder="Search songs, artists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ 
            flex: 1, 
            padding: '0.875rem 1.25rem', 
            borderRadius: '12px', 
            border: '2px solid #3b3b3b',
            fontSize: '1rem',
            backgroundColor: '#101010',
            color: '#f5f5f5',
            transition: 'all 0.3s ease',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? '#525252' : 'linear-gradient(135deg, #f5f5f5, #cfcfcf)',
            color: '#0a0a0a',
            padding: '0.875rem 1.75rem',
            borderRadius: '12px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '700',
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.45)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            whiteSpace: 'nowrap',
          }}
        >
          {loading ? '...' : '🔍 Search'}
        </button>
      </form>
    </div>
  );
};

export default MusicPage;
