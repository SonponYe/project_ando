import React, { createContext, useState } from 'react';

export const PlaybackContext = createContext();

export const PlaybackProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [queue, setQueue]               = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Play a track. Pass `trackList` (the list it was played from) to load
  // it as the active queue, enabling next/previous navigation through it.
  const playTrack = (track, trackList) => {
    if (trackList && trackList.length) {
      const idx = trackList.findIndex((t) => t.id === track.id);
      setQueue(trackList);
      setCurrentIndex(idx === -1 ? 0 : idx);
    } else if (queue.length === 0) {
      setQueue([track]);
      setCurrentIndex(0);
    }
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pauseTrack = () => setIsPlaying(false);

  const stepTrack = (direction) => {
    if (queue.length < 2) return;
    for (let i = 1; i <= queue.length; i++) {
      const idx = (currentIndex + direction * i + queue.length) % queue.length;
      if (queue[idx]?.preview_url) {
        setCurrentIndex(idx);
        setCurrentTrack(queue[idx]);
        setIsPlaying(true);
        return;
      }
    }
  };

  const nextTrack = () => stepTrack(1);
  const prevTrack = () => stepTrack(-1);

  return (
    <PlaybackContext.Provider value={{
      currentTrack, isPlaying, playTrack, pauseTrack,
      queue, currentIndex, nextTrack, prevTrack,
    }}>
      {children}
    </PlaybackContext.Provider>
  );
};
