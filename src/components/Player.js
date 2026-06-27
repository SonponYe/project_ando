import React, { useContext } from 'react';
import ReactHowler from 'react-howler';
import { FaPlay, FaPause } from 'react-icons/fa';
import { PlaybackContext } from '../context/PlaybackContext';

const Player = () => {
  const { currentTrack, isPlaying, playTrack, pauseTrack } = useContext(PlaybackContext);

  if (!currentTrack) return null;

  return (
    <>
      {currentTrack.preview_url && (
        <ReactHowler
          src={currentTrack.preview_url}
          playing={isPlaying}
          onEnd={pauseTrack}
          html5={true}
          volume={1.0}
        />
      )}

      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 68,
        background: 'rgba(8, 8, 8, 0.97)',
        borderTop: '1px solid #1c1c1c',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        gap: '1rem',
        zIndex: 9999,
      }}>
        {currentTrack.album?.images?.[0]?.url ? (
          <img
            src={currentTrack.album.images[0].url}
            alt={currentTrack.name}
            style={{
              width: 42,
              height: 42,
              borderRadius: 7,
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />
        ) : (
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 7,
            background: '#1a1a1a',
            flexShrink: 0,
          }} />
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#f0f0f0',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            lineHeight: 1.3,
          }}>
            {currentTrack.name}
          </div>
          <div style={{
            fontSize: '0.76rem',
            color: '#666',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginTop: 2,
          }}>
            {currentTrack.artists?.map(a => a.name).join(', ')}
          </div>
        </div>

        {!currentTrack.preview_url ? (
          <span style={{ fontSize: '0.72rem', color: '#3a3a3a', flexShrink: 0 }}>
            No preview
          </span>
        ) : (
          <button
            onClick={isPlaying ? pauseTrack : () => playTrack(currentTrack)}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: '#f0f0f0',
              border: 'none',
              color: '#111',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background 0.15s ease, transform 0.15s ease',
              padding: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f0f0f0'; }}
          >
            {isPlaying
              ? <FaPause size={12} />
              : <FaPlay size={12} style={{ marginLeft: 1 }} />
            }
          </button>
        )}
      </div>
    </>
  );
};

export default Player;
