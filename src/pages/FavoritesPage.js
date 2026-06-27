import React, { useContext } from 'react';
import { FaPlay, FaPause, FaTimes } from 'react-icons/fa';
import { PlaybackContext } from '../context/PlaybackContext';
import { FavoritesContext } from '../context/FavoritesContext';

const FavoritesPage = () => {
  const { currentTrack, isPlaying, playTrack, pauseTrack } = useContext(PlaybackContext);
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const handleTrackPlay = (track) => {
    if (!track.preview_url) return;
    if (currentTrack?.id === track.id && isPlaying) {
      pauseTrack();
    } else {
      playTrack(track);
    }
  };

  return (
    <div className="page-wrap">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: '#f0f0f0',
          letterSpacing: '-0.5px',
          marginBottom: '0.25rem',
        }}>
          Favorites
        </h1>
        <p style={{ color: '#444', fontSize: '0.85rem' }}>
          {favorites.length > 0
            ? `${favorites.length} saved track${favorites.length !== 1 ? 's' : ''}`
            : 'Your saved tracks'}
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="state-center">
          <p>No favorites yet</p>
          <p>Save tracks from the Discover page</p>
        </div>
      ) : (
        <div>
          {favorites.map((track) => {
            const isCurrent = currentTrack?.id === track.id;
            const isCurrentlyPlaying = isCurrent && isPlaying;

            return (
              <div
                key={track.id}
                className={`track-row${isCurrent ? ' track-row--active' : ''}`}
                onClick={() => handleTrackPlay(track)}
              >
                {/* Album art */}
                {track.album?.images?.[0]?.url ? (
                  <img
                    src={track.album.images[0].url}
                    alt={track.name}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      objectFit: 'cover',
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    background: '#1a1a1a',
                    flexShrink: 0,
                  }} />
                )}

                {/* Track info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: isCurrent ? '#f5f5f5' : '#d4d4d4',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.3,
                  }}>
                    {track.name}
                  </div>
                  <div style={{
                    fontSize: '0.78rem',
                    color: '#555',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginTop: 2,
                  }}>
                    {track.artists?.map(a => a.name).join(', ')}
                    {track.album?.name && (
                      <span style={{ color: '#3a3a3a' }}> · {track.album.name}</span>
                    )}
                  </div>
                </div>

                {/* Remove button */}
                <button
                  className="icon-btn"
                  onClick={e => { e.stopPropagation(); toggleFavorite(track); }}
                  aria-label={`Remove ${track.name} from favorites`}
                  title="Remove"
                >
                  <FaTimes size={12} />
                </button>

                {/* Play/pause button */}
                <button
                  className="row-play-btn"
                  onClick={e => { e.stopPropagation(); handleTrackPlay(track); }}
                  disabled={!track.preview_url}
                  aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
                  style={{ opacity: isCurrent ? 1 : undefined }}
                >
                  {isCurrentlyPlaying
                    ? <FaPause size={11} />
                    : <FaPlay size={11} style={{ marginLeft: 1 }} />
                  }
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
