import React, { createContext, useState } from 'react';

export const PlaybackContext = createContext();

const MODES = ['order', 'shuffle', 'repeat-one'];

export const PlaybackProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [queue, setQueue]               = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [playbackMode, setPlaybackMode] = useState('order'); // 'order' | 'shuffle' | 'repeat-one'

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

  const cyclePlaybackMode = () => {
    setPlaybackMode((m) => MODES[(MODES.indexOf(m) + 1) % MODES.length]);
  };

  const playableIndices = () => queue.reduce((acc, t, i) => (t?.preview_url ? [...acc, i] : acc), []);

  // Sequential step (used by manual prev/next, and by "order" mode on track end)
  const stepSequential = (direction) => {
    if (queue.length < 2) return false;
    for (let i = 1; i <= queue.length; i++) {
      const idx = (currentIndex + direction * i + queue.length) % queue.length;
      if (queue[idx]?.preview_url) {
        setCurrentIndex(idx);
        setCurrentTrack(queue[idx]);
        setIsPlaying(true);
        return true;
      }
    }
    return false;
  };

  // Random step (used by manual next in shuffle mode, and by shuffle mode on track end)
  const stepRandom = () => {
    const candidates = playableIndices().filter((i) => i !== currentIndex);
    const pool = candidates.length ? candidates : playableIndices();
    if (!pool.length) return false;
    const idx = pool[Math.floor(Math.random() * pool.length)];
    setCurrentIndex(idx);
    setCurrentTrack(queue[idx]);
    setIsPlaying(true);
    return true;
  };

  const nextTrack = () => (playbackMode === 'shuffle' ? stepRandom() : stepSequential(1));
  const prevTrack = () => stepSequential(-1);

  // Called when the current track finishes playing naturally, respecting
  // the active playback mode. Returns true if playback should continue.
  const advanceAfterEnd = () => {
    if (playbackMode === 'repeat-one') return 'repeat';
    if (playbackMode === 'shuffle') return stepRandom();
    return stepSequential(1);
  };

  const canSkip = queue.length > 1;

  return (
    <PlaybackContext.Provider value={{
      currentTrack, isPlaying, playTrack, pauseTrack,
      queue, currentIndex, nextTrack, prevTrack, canSkip,
      playbackMode, cyclePlaybackMode, advanceAfterEnd,
    }}>
      {children}
    </PlaybackContext.Provider>
  );
};
