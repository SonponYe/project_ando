import React from 'react';
import { LuPlay, LuPause } from 'react-icons/lu';

// Shared track row used by MusicPage, FavoritesPage, and playlist pages.
// `children` renders the action buttons between the track info and the
// play button (favorite toggle, add-to-playlist, remove, etc.) — each
// page decides which actions make sense for it.
const TrackRow = ({ track, isCurrent, isCurrentlyPlaying, onPlay, children }) => (
  <div
    className={`track-row${isCurrent ? ' track-row--active' : ''}`}
    onClick={onPlay}
  >
    {track.album?.images?.[0]?.url ? (
      <img
        src={track.album.images[0].url}
        alt={track.name}
        style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
      />
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
        {track.artists?.map((a) => a.name).join(', ')}
        {track.album?.name && <span style={{ color: '#303030' }}> · {track.album.name}</span>}
      </div>
    </div>

    {children}

    <button
      className="row-play-btn"
      onClick={(e) => { e.stopPropagation(); onPlay(); }}
      disabled={!track.preview_url}
      aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
      style={{ opacity: isCurrent ? 1 : undefined }}
    >
      {isCurrentlyPlaying
        ? <LuPause size={12} />
        : <LuPlay size={12} style={{ marginLeft: 1 }} />
      }
    </button>
  </div>
);

export default TrackRow;
