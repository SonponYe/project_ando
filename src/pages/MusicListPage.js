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
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        maxWidth: '900px',
        margin: '2rem auto',
        border: '1px solid #2f2f2f',
        borderRadius: '16px',
        background: 'rgba(12, 12, 12, 0.9)',
      }}>
        <h2 style={{ color: '#f5f5f5' }}>No tracks found.</h2>
        <button onClick={() => navigate('/music')}>Back to Search</button>
      </div>
    );
  }

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '900px',
      margin: '1.5rem auto 6rem',
      border: '1px solid #2f2f2f',
      borderRadius: '16px',
      background: 'linear-gradient(180deg, rgba(14, 14, 14, 0.94), rgba(8, 8, 8, 0.95))',
      boxShadow: '0 14px 34px rgba(0, 0, 0, 0.5)',
    }}>
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
                border: isCurrent ? '2px solid #f5f5f5' : '2px solid #2f2f2f',
                padding: '1.25rem',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                backgroundColor: isCurrent ? '#242424' : '#121212',
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
                  color: '#f3f4f6',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {track.name}
                </strong>
                <em style={{ 
                  fontSize: '0.9rem', 
                  color: '#a3a3a3',
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
                  color: '#737373',
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
                    ? 'linear-gradient(135deg, #ffffff, #d4d4d4)'
                    : track.preview_url
                      ? 'linear-gradient(135deg, #e5e5e5, #bcbcbc)'
                      : '#4b5563',
                  border: 'none',
                  color: 'white',
                  padding: '0.625rem 1.25rem',
                  borderRadius: '10px',
                  cursor: track.preview_url ? 'pointer' : 'not-allowed',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  boxShadow: track.preview_url ? '0 2px 8px rgba(0, 0, 0, 0.35)' : 'none',
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
                    ? 'linear-gradient(135deg, #ffffff, #d4d4d4)'
                    : 'linear-gradient(135deg, #444444, #2f2f2f)',
                  border: 'none',
                  color: 'white',
                  padding: '0.625rem 1rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  boxShadow: favorite ? '0 2px 8px rgba(0, 0, 0, 0.35)' : 'none',
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
