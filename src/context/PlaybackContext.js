import React, { createContext, useState, useRef, useEffect } from 'react';

export const PlaybackContext = createContext();

export const PlaybackProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Play or toggle track
  const playTrack = (track) => {
    if (!track?.preview_url) {
      console.warn('No preview URL available for this track.');
      return;
    }

    if (currentTrack?.id !== track.id) {
      setCurrentTrack(track);
    } else {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch((error) => {
          console.warn('Playback failed:', error);
        });
        setIsPlaying(true);
      }
    }
  };

  // Effect to handle track change and playback
  useEffect(() => {
    if (!currentTrack) return;

    audioRef.current.src = currentTrack.preview_url;
    audioRef.current.load();

    const onCanPlay = () => {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.warn('Playback failed:', error);
          setIsPlaying(false);
        });
    };

    const onEnded = () => setIsPlaying(false);

    audioRef.current.addEventListener('canplay', onCanPlay, { once: true });
    audioRef.current.addEventListener('ended', onEnded);

    // Cleanup listeners on unmount or track change
    return () => {
      audioRef.current.pause();
      audioRef.current.removeEventListener('canplay', onCanPlay);
      audioRef.current.removeEventListener('ended', onEnded);
    };
  }, [currentTrack]);

  // Pause playback manually
  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  return (
    <PlaybackContext.Provider value={{ currentTrack, isPlaying, playTrack, pause }}>
      {children}
    </PlaybackContext.Provider>
  );
};
