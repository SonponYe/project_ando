import React, { useContext } from 'react';
import { LuPlay, LuPause, LuHeart } from 'react-icons/lu';
import { FavoritesContext } from '../context/FavoritesContext';
import mark from '../images/ando-mark.png';

// Square card for the horizontal home-page rails (Spotify/Boomplay style).
// The whole card plays the track; a play/pause button and a favorite toggle
// float over the artwork on hover (always visible for the active track).
const TrackCard = ({ track, isCurrent, isCurrentlyPlaying, onPlay }) => {
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const favorited = isFavorite(track.id);
  const art = track.album?.images?.[0]?.url;

  return (
    <div
      className={`track-card${isCurrent ? ' track-card--active' : ''}`}
      onClick={onPlay}
      role="button"
      aria-label={`Play ${track.name}`}
    >
      <div className="track-card__art">
        {art ? (
          <img src={art} alt="" loading="lazy" />
        ) : (
          <div className="track-card__art-fallback">
            <img src={mark} alt="" aria-hidden="true" />
          </div>
        )}

        {isCurrentlyPlaying && (
          <span className="eq-bars track-card__eq"><span /><span /><span /></span>
        )}

        <button
          className={`icon-btn track-card__fav${favorited ? ' icon-btn--active' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleFavorite(track); }}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={favorited}
        >
          <LuHeart size={13} style={{ fill: favorited ? 'currentColor' : 'none' }} />
        </button>

        <button
          className="track-card__play"
          onClick={(e) => { e.stopPropagation(); onPlay(); }}
          disabled={!track.preview_url}
          aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
        >
          {isCurrentlyPlaying
            ? <LuPause size={14} />
            : <LuPlay size={14} style={{ marginLeft: 2 }} />
          }
        </button>
      </div>

      <div className="track-card__name">{track.name}</div>
      <div className="track-card__artist">
        {track.artists?.map((a) => a.name).join(', ')}
      </div>
    </div>
  );
};

export default TrackCard;
