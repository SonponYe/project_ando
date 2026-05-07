// src/pages/MusicPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchTracks } from '../api/spotify/api';
import { isAuthenticated, initiateAuthFlow } from '../api/spotify/token';

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
    <div style={{ padding: '2rem', maxWidth: '700px', margin: 'auto' }}>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: '800', 
        marginBottom: '2rem',
        color: '#111827',
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
                ? '0 8px 25px rgba(0, 0, 0, 0.25)' 
                : '0 4px 12px rgba(0, 0, 0, 0.1)',
              userSelect: 'none',
              fontWeight: '700',
              fontSize: '1rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: selectedMood === mood.name ? 'scale(1.05) translateY(-4px)' : 'scale(1)',
              border: selectedMood === mood.name ? '3px solid rgba(255, 255, 255, 0.5)' : 'none',
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
            color: '#374151',
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
            border: '2px solid #e5e7eb',
            fontSize: '1rem',
            backgroundColor: '#ffffff',
            color: '#111827',
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
            ? '#9ca3af'
            : 'linear-gradient(135deg, #6366f1, #818cf8)',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          border: 'none',
          cursor: loading || (!selectedMood && !selectedGenre) ? 'not-allowed' : 'pointer',
          marginBottom: '2rem',
          width: '100%',
          fontWeight: '700',
          fontSize: '1rem',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
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
            border: '2px solid #e5e7eb',
            fontSize: '1rem',
            backgroundColor: '#ffffff',
            transition: 'all 0.3s ease',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? '#9ca3af' : 'linear-gradient(135deg, #111827, #374151)',
            color: 'white',
            padding: '0.875rem 1.75rem',
            borderRadius: '12px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '700',
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
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
