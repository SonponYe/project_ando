import React, { createContext, useState, useRef, useEffect } from 'react';

export const PlaybackContext = createContext();

export const PlaybackProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playTrack = (track) => {
    console.log('Attempting to play track:', track.name, track.preview_url);
    if (!track?.preview_url) {
      console.warn('No preview URL available for this track.');
      return;
    }

    if (currentTrack?.id !== track.id) {
      setCurrentTrack(track);
      audioRef.current.src = track.preview_url;
      audioRef.current.load();

      const playAudio = () => {
        audioRef.current.play().catch((error) => {
          console.warn('Playback failed:', error);
        });
        setIsPlaying(true);
      };

      // Play once audio can play
      audioRef.current.addEventListener('canplay', playAudio, { once: true });
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

  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const play = () => {
    audioRef.current.play().catch((error) => {
      console.warn('Playback failed:', error);
    });
    setIsPlaying(true);
  };

  useEffect(() => {
    const audio = audioRef.current;
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
