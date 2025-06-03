import React, { createContext, useState } from 'react';

export const PlaybackContext = createContext();

export const PlaybackProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);

  return (
    <PlaybackContext.Provider value={{ currentTrack, setCurrentTrack }}>
      {children}
    </PlaybackContext.Provider>
  );
};
