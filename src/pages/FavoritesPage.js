import React, { useContext } from 'react';
import { PlaybackContext } from '../context/PlaybackContext';
import { FavoritesContext } from '../context/FavoritesContext';

const FavoritesPage = () => {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const { playTrack, pause, currentTrack, isPlaying } = useContext(PlaybackContext);

  if (!favorites.length) {
    return <p style={{ padding: '2rem', textAlign: 'center' }}>No favorite tracks found.</p>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h1>❤️ Your Favorites</h1>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        {favorites.map((track) => {
          const isCurrent = currentTrack?.id === track.id && isPlaying;

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
                userSelect: 'none',
              }}
            >
              {track.album?.images?.[0]?.url ? (
                <img
                  src={track.album.images[0].url}
                  alt={track.name}
                  style={{ width: 64, height: 64, borderRadius: '8px' }}
                />
              ) : (
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '8px',
                    backgroundColor: '#ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                    fontSize: '0.75rem',
                  }}
                >
                  No Image
                </div>
              )}
              <div style={{ flex: 1 }}>
                <strong>{track.name}</strong>
                <br />
                <em>{track.artists.map((a) => a.name).join(', ')}</em>
                <br />
                <small>{track.album?.name}</small>
              </div>

              {/* Play/Pause Button */}
              <button
                onClick={() => (isCurrent ? pause() : playTrack(track))}
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
                    ? `${isCurrent ? 'Pause' : 'Play'} ${track.name}`
                    : 'Preview not available'
                }
              >
                {isCurrent ? 'Pause' : 'Play'}
              </button>

              {/* Remove from Favorites Button */}
              <button
                onClick={() => toggleFavorite(track)}
                style={{
                  backgroundColor: '#dc2626',
                  border: 'none',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                aria-label={`Remove ${track.name} from favorites`}
                aria-pressed="true"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FavoritesPage;
