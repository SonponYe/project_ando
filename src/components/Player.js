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
        backgroundColor: '#1f2937',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 1rem',
        gap: '1rem',
        zIndex: 10000,
      }}
    >
      <img
        src={currentTrack.album?.images?.[0]?.url}
        alt={currentTrack.name}
        style={{ width: 50, height: 50, borderRadius: 4 }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold' }}>{currentTrack.name}</div>
        <div style={{ fontSize: '0.9rem', color: '#d1d5db' }}>
          {currentTrack.artists.map((a) => a.name).join(', ')}
        </div>
      </div>
      {isPlaying ? (
        <button onClick={pause} style={buttonStyle}>
          Pause
        </button>
      ) : (
        <button onClick={() => playTrack(currentTrack)} style={buttonStyle}>
          Play
        </button>
      )}
    </div>
  );
};

const buttonStyle = {
  backgroundColor: '#4F46E5',
  border: 'none',
  color: 'white',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default Player;
