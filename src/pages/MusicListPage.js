// src/pages/MusicListPage.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MusicListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tracks = location.state?.tracks || [];

  if (!tracks.length) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>No tracks found.</h2>
        <button
          onClick={() => navigate('/music')}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#4F46E5',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h1>🎶 Search Results</h1>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        {tracks.map((track) => (
          <div
            key={track.id}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            {track.album?.images?.[0]?.url && (
              <img
                src={track.album.images[0].url}
                alt={track.name}
                style={{ width: 64, height: 64, borderRadius: '8px' }}
              />
            )}
            <div style={{ flex: 1 }}>
              <strong>{track.name}</strong>
              <br />
              <em>{track.artists.map((a) => a.name).join(', ')}</em>
              <br />
              <small>{track.album?.name}</small>
            </div>
            {track.preview_url && (
              <audio controls src={track.preview_url} style={{ width: 150 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicListPage;
