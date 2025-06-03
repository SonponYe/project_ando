import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlaybackContext } from '../context/PlaybackContext';
import { FavoritesContext } from '../context/FavoritesContext';
import AudioPlayer from '../components/AudioPlayer';

const MusicListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tracks = location.state?.tracks || [];
  const { currentTrack, setCurrentTrack } = useContext(PlaybackContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);

  if (!tracks.length) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>No tracks found.</h2>
        <button onClick={() => navigate('/music')}>Back to Search</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h1>🎶 Search Results</h1>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        {tracks.map((track) => {
          const isCurrent = currentTrack?.id === track.id;
          const favorite = isFavorite(track.id);

          return (
            <div
              key={track.id}
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: isCurrent ? '#e0e7ff' : 'white',
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

              <button
                onClick={() => setCurrentTrack(track)}
                disabled={!track.preview_url}
                style={{
                  backgroundColor: isCurrent ? '#2563eb' : '#4F46E5',
                  border: 'none',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: track.preview_url ? 'pointer' : 'not-allowed',
                }}
                aria-label={
                  track.preview_url
                    ? `${isCurrent ? 'Playing' : 'Play'} ${track.name}`
                    : 'Preview not available'
                }
              >
                {isCurrent ? 'Playing' : 'Play'}
              </button>

              <button
                onClick={() => toggleFavorite(track)}
                style={{
                  backgroundColor: favorite ? '#dc2626' : '#9ca3af',
                  border: 'none',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                aria-pressed={favorite}
                aria-label={
                  favorite
                    ? `Remove ${track.name} from favorites`
                    : `Add ${track.name} to favorites`
                }
              >
                {favorite ? '♥' : '♡'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Place AudioPlayer at bottom */}
      <AudioPlayer track={currentTrack} />
    </div>
  );
};

export default MusicListPage;
