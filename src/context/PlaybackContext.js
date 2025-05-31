import React, { createContext, useState, useRef, useEffect } from 'react';

export const PlaybackContext = createContext();

export const PlaybackProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Play a new track
  const playTrack = (track) => {
    if (!track?.preview_url) return;
    if (currentTrack?.id !== track.id) {
      setCurrentTrack(track);
      audioRef.current.src = track.preview_url;
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      // If same track, toggle play/pause
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Pause playback
  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  // Play playback
  const play = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };

  // When track ends, reset playing state
  useEffect(() => {
    const audio = audioRef.current;  // capture current ref
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);
  

  return (
    <PlaybackContext.Provider
      value={{ currentTrack, isPlaying, playTrack, pause, play }}
    >
      {children}
    </PlaybackContext.Provider>
  );
};
