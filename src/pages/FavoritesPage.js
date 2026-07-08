import React, { useContext } from 'react';
import { LuPlay, LuPause, LuX } from 'react-icons/lu';
import { PlaybackContext } from '../context/PlaybackContext';
import { FavoritesContext } from '../context/FavoritesContext';

const FavoritesPage = () => {
  const { currentTrack, isPlaying, playTrack, pauseTrack } = useContext(PlaybackContext);
  const { favorites, toggleFavorite }                      = useContext(FavoritesContext);

  const handlePlay = (track) => {
    if (!track.preview_url) return;
    if (currentTrack?.id === track.id && isPlaying) pauseTrack();
    else playTrack(track, favorites);
  };

  return (
    <div className="page-wrap">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#efefef', letterSpacing: '-0.5px', marginBottom: '0.2rem' }}>
          Favorites
        </h1>
        <p style={{ color: '#383838', fontSize: '0.82rem' }}>
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
        <>
          {favorites.map((track) => {
            const isCurrent          = currentTrack?.id === track.id;
            const isCurrentlyPlaying = isCurrent && isPlaying;

            return (
              <div
                key={track.id}
                className={`track-row${isCurrent ? ' track-row--active' : ''}`}
                onClick={() => handlePlay(track)}
              >
                {track.album?.images?.[0]?.url ? (
                  <img src={track.album.images[0].url} alt={track.name}
                    style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 48, height: 48, borderRadius: 8, background: '#191919', flexShrink: 0 }} />
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    fontSize: '0.88rem', fontWeight: 600,
                    color: isCurrent ? '#efefef' : '#c8c8c8',
                    lineHeight: 1.3,
                  }}>
                    {isCurrentlyPlaying && (
                      <span className="eq-bars"><span /><span /><span /></span>
                    )}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {track.name}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.76rem', color: '#444',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2,
                  }}>
                    {track.artists?.map(a => a.name).join(', ')}
                    {track.album?.name && <span style={{ color: '#303030' }}> · {track.album.name}</span>}
                  </div>
                </div>

                <button
                  className="icon-btn"
                  onClick={e => { e.stopPropagation(); toggleFavorite(track); }}
                  aria-label={`Remove ${track.name} from favorites`}
                  title="Remove"
                >
                  <LuX size={14} />
                </button>

                <button
                  className="row-play-btn"
                  onClick={e => { e.stopPropagation(); handlePlay(track); }}
                  disabled={!track.preview_url}
                  aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
                  style={{ opacity: isCurrent ? 1 : undefined }}
                >
                  {isCurrentlyPlaying
                    ? <LuPause size={12} />
                    : <LuPlay  size={12} style={{ marginLeft: 1 }} />
                  }
                </button>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default FavoritesPage;
