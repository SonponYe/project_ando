import React, { useEffect, useState, useContext } from 'react';
import { getSavedTracks } from '../api/spotify/api';
import { PlaybackContext } from '../context/PlaybackContext';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const { playTrack, currentTrack, isPlaying } = useContext(PlaybackContext);

  useEffect(() => {
    const fetchFavorites = async () => {
      const saved = await getSavedTracks();
      setFavorites(saved);
    };
    fetchFavorites();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>❤️ Your Favorites</h1>
      {favorites.length === 0 && <p>No favorite tracks found.</p>}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {favorites.map((track) => {
          const isCurrent = currentTrack?.id === track.id && isPlaying;
          return (
            <div
              key={track.id}
              onClick={() => playTrack(track)}
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: isCurrent ? '#e0e7ff' : 'white',
              }}
              title="Click to play/pause"
            >
              <strong>{track.name}</strong> – {track.artists[0].name}
              <br />
              <audio controls src={track.preview_url} style={{ marginTop: '0.5rem', display: 'none' }} />
              <div style={{ marginTop: '0.5rem', fontWeight: 'bold', color: '#4F46E5' }}>
                {isCurrent ? '▶️ Playing' : '▶️ Play'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FavoritesPage;
