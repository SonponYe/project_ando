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
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: '800', 
        marginBottom: '2rem',
        color: '#111827',
        letterSpacing: '-0.5px',
      }}>
        🎶 Search Results
      </h1>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        {tracks.map((track) => {
          const isCurrent = currentTrack?.id === track.id;
          const favorite = isFavorite(track.id);

          return (
            <div
              key={track.id}
              style={{
                border: isCurrent ? '2px solid #6366f1' : '2px solid #e5e7eb',
                padding: '1.25rem',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                backgroundColor: isCurrent ? '#eef2ff' : '#ffffff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                if (!isCurrent) {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {track.album?.images?.[0]?.url && (
                <img
                  src={track.album.images[0].url}
                  alt={track.name}
                  style={{ 
                    width: 72, 
                    height: 72, 
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ 
                  fontSize: '1.05rem', 
                  display: 'block', 
                  marginBottom: '0.25rem',
                  color: '#111827',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {track.name}
                </strong>
                <em style={{ 
                  fontSize: '0.9rem', 
                  color: '#6b7280',
                  display: 'block',
                  marginBottom: '0.25rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {track.artists.map((a) => a.name).join(', ')}
                </em>
                <small style={{ 
                  fontSize: '0.85rem', 
                  color: '#9ca3af',
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {track.album?.name}
                </small>
              </div>

              <button
                onClick={() => setCurrentTrack(track)}
                disabled={!track.preview_url}
                style={{
                  background: isCurrent 
                    ? 'linear-gradient(135deg, #4f46e5, #6366f1)' 
                    : track.preview_url 
                      ? 'linear-gradient(135deg, #6366f1, #818cf8)' 
                      : '#d1d5db',
                  border: 'none',
                  color: 'white',
                  padding: '0.625rem 1.25rem',
                  borderRadius: '10px',
                  cursor: track.preview_url ? 'pointer' : 'not-allowed',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  boxShadow: track.preview_url ? '0 2px 8px rgba(99, 102, 241, 0.3)' : 'none',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap',
                }}
                aria-label={
                  track.preview_url
                    ? `${isCurrent ? 'Playing' : 'Play'} ${track.name}`
                    : 'Preview not available'
                }
              >
                {isCurrent ? '▶ Playing' : '▶ Play'}
              </button>

              <button
                onClick={() => toggleFavorite(track)}
                style={{
                  background: favorite 
                    ? 'linear-gradient(135deg, #ec4899, #f472b6)' 
                    : 'linear-gradient(135deg, #d1d5db, #e5e7eb)',
                  border: 'none',
                  color: 'white',
                  padding: '0.625rem 1rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  boxShadow: favorite ? '0 2px 8px rgba(236, 72, 153, 0.3)' : 'none',
                  transition: 'all 0.3s ease',
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
