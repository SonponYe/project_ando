import React, { createContext, useState } from 'react';

export const PlaybackContext = createContext();

export const PlaybackProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playTrack = (track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(true);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const pauseTrack = () => setIsPlaying(false);

  return (
    <PlaybackContext.Provider value={{ currentTrack, isPlaying, playTrack, pauseTrack }}>
      {children}
    </PlaybackContext.Provider>
  );
};
