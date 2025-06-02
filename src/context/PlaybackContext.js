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

    const audio = audioRef.current; // copy ref to local variable

    audio.src = currentTrack.preview_url;
    audio.load();

    const onCanPlay = () => {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.warn('Playback failed:', error);
          setIsPlaying(false);
        });
    };

    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('canplay', onCanPlay, { once: true });
    audio.addEventListener('ended', onEnded);

    // Cleanup listeners on unmount or track change
    return () => {
      audio.pause();
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('ended', onEnded);
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
