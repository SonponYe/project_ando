import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import { rehydrateLocalTracks } from '../api/local/db';

export const PlaybackContext = createContext();

const MODES = ['order', 'shuffle', 'repeat-one'];
const RECENT_KEY = 'ando_recently_played';
const RECENT_LIMIT = 50;
const PLAYLOG_KEY = 'ando_play_log';
const PLAYLOG_LIMIT = 2000;

// Compact per-play event kept for listening stats. Stores just enough to
// rank/replay a track later — not the whole track object (waveform arrays
// alone would blow up localStorage).
const toPlayEvent = (track) => ({
  id: track.id,
  name: track.name,
  artist: track.artists?.map((a) => a.name).join(', ') || 'Unknown Artist',
  image: track.album?.images?.[0]?.url || null,
  preview_url: track.preview_url || null,
  ts: Date.now(),
});

export const PlaybackProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [queue, setQueue]               = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [playbackMode, setPlaybackMode] = useState('order'); // 'order' | 'shuffle' | 'repeat-one'
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [playLog, setPlayLog] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(PLAYLOG_KEY)) || [];
    } catch {
      return [];
    }
  });

  // Load recently-played history, refreshing any local-file tracks' blob
  // URLs from IndexedDB since the ones saved in localStorage are stale
  useEffect(() => {
    (async () => {
      const saved = localStorage.getItem(RECENT_KEY);
      if (saved) setRecentlyPlayed(await rehydrateLocalTracks(JSON.parse(saved)));
    })();
  }, []);

  const recordPlay = useCallback((track) => {
    setRecentlyPlayed((prev) => [track, ...prev.filter((t) => t.id !== track.id)].slice(0, RECENT_LIMIT));
    setPlayLog((prev) => [toPlayEvent(track), ...prev].slice(0, PLAYLOG_LIMIT));
  }, []);

  useEffect(() => {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  useEffect(() => {
    localStorage.setItem(PLAYLOG_KEY, JSON.stringify(playLog));
  }, [playLog]);

  const clearRecentlyPlayed = () => setRecentlyPlayed([]);
  const clearPlayLog = () => setPlayLog([]);

  // Central "start playing this track at this queue index" — everything
  // that changes the current track funnels through here so recently-played
  // tracking and playback state stay in sync in one place. Resuming the
  // already-loaded track isn't a new play, so it isn't re-recorded (that
  // would inflate the listening stats on every pause/resume).
  const setNowPlaying = (track, idx) => {
    setCurrentIndex(idx);
    setCurrentTrack(track);
    setIsPlaying(true);
    if (currentTrack?.id !== track.id) recordPlay(track);
  };

  // Play a track. Pass `trackList` (the list it was played from) to load
  // it as the active queue, enabling next/previous navigation through it.
  const playTrack = (track, trackList) => {
    if (currentTrack?.id === track.id && !trackList) {
      setIsPlaying(true);
      return;
    }
    if (trackList && trackList.length) {
      const idx = trackList.findIndex((t) => t.id === track.id);
      setQueue(trackList);
      setNowPlaying(track, idx === -1 ? 0 : idx);
    } else {
      setQueue([track]);
      setNowPlaying(track, 0);
    }
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
        setNowPlaying(queue[idx], idx);
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
    setNowPlaying(queue[idx], idx);
    return true;
  };

  const nextTrack = () => (playbackMode === 'shuffle' ? stepRandom() : stepSequential(1));
  const prevTrack = () => stepSequential(-1);

  // Jump directly to an arbitrary index in the queue (used by the Up Next view)
  const jumpToIndex = (idx) => {
    if (idx < 0 || idx >= queue.length || !queue[idx]?.preview_url) return;
    setNowPlaying(queue[idx], idx);
  };

  // Remove a track from the queue (not the one currently playing)
  const removeFromQueue = (idx) => {
    if (idx === currentIndex) return;
    setQueue((prev) => prev.filter((_, i) => i !== idx));
    setCurrentIndex((prev) => (idx < prev ? prev - 1 : prev));
  };

  // Called when the current track finishes playing naturally, respecting
  // the active playback mode. Returns true if playback should continue.
  const advanceAfterEnd = () => {
    if (playbackMode === 'repeat-one') return 'repeat';
    if (playbackMode === 'shuffle') return stepRandom();
    return stepSequential(1);
  };

  const canSkip = queue.length > 1;

  // ── Lock-screen / OS media controls (MediaSession API) ──
  const latest = useRef({});
  latest.current = { currentTrack, isPlaying, playTrack, pauseTrack, nextTrack, prevTrack, canSkip };

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.setActionHandler('play', () => {
      const { currentTrack: t, playTrack: p } = latest.current;
      if (t) p(t);
    });
    navigator.mediaSession.setActionHandler('pause', () => latest.current.pauseTrack());
    navigator.mediaSession.setActionHandler('previoustrack', () => latest.current.prevTrack());
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      if (latest.current.canSkip) latest.current.nextTrack();
    });
    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
    };
  }, []);

  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentTrack) return;
    const art = currentTrack.album?.images?.[0]?.url;
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: currentTrack.name,
      artist: currentTrack.artists?.map((a) => a.name).join(', ') || '',
      album: currentTrack.album?.name || '',
      artwork: art ? [{ src: art, sizes: '512x512', type: 'image/png' }] : [],
    });
  }, [currentTrack]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [isPlaying]);

  return (
    <PlaybackContext.Provider value={{
      currentTrack, isPlaying, playTrack, pauseTrack,
      queue, currentIndex, nextTrack, prevTrack, canSkip,
      jumpToIndex, removeFromQueue,
      playbackMode, cyclePlaybackMode, advanceAfterEnd,
      recentlyPlayed, clearRecentlyPlayed,
      playLog, clearPlayLog,
    }}>
      {children}
    </PlaybackContext.Provider>
  );
};
