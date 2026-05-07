import React, { useContext } from 'react';
import { PlaybackContext } from '../context/PlaybackContext';

const Player = () => {
  const { currentTrack, isPlaying, playTrack, pause } = useContext(PlaybackContext);

  if (!currentTrack) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(12, 12, 12, 0.94)',
        color: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        padding: '1rem 1.5rem',
        gap: '1.25rem',
        zIndex: 10000,
        boxShadow: '0 -6px 24px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid #303030',
      }}
    >
      <img
        src={currentTrack.album?.images?.[0]?.url}
        alt={currentTrack.name}
        style={{ 
          width: 56, 
          height: 56, 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ 
          fontWeight: '700', 
          fontSize: '0.95rem',
          marginBottom: '0.25rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {currentTrack.name}
        </div>
        <div style={{ 
          fontSize: '0.85rem', 
          color: '#a3a3a3',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {currentTrack.artists.map((a) => a.name).join(', ')}
        </div>
      </div>
      {isPlaying ? (
        <button onClick={pause} style={buttonStyle}>
          ⏸ Pause
        </button>
      ) : (
        <button onClick={() => playTrack(currentTrack)} style={buttonStyle}>
          ▶ Play
        </button>
      )}
    </div>
  );
};

const buttonStyle = {
  background: 'linear-gradient(135deg, #f5f5f5, #cfcfcf)',
  border: 'none',
  color: '#111111',
  padding: '0.625rem 1.25rem',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.9rem',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.35)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  letterSpacing: '0.3px',
};

export default Player;
