import React, { createContext, useState, useEffect } from 'react';

export const PlaylistsContext = createContext();

const STORAGE_KEY = 'ando_playlists';
const genId = () => `pl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const PlaylistsProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setPlaylists(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
  }, [playlists]);

  const createPlaylist = (name) => {
    const id = genId();
    setPlaylists((prev) => [...prev, { id, name: name.trim() || 'Untitled Playlist', tracks: [], createdAt: Date.now() }]);
    return id;
  };

  const renamePlaylist = (id, name) => {
    setPlaylists((prev) => prev.map((p) => (p.id === id ? { ...p, name: name.trim() || p.name } : p)));
  };

  const deletePlaylist = (id) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
  };

  const addTrackToPlaylist = (playlistId, track) => {
    setPlaylists((prev) => prev.map((p) => {
      if (p.id !== playlistId) return p;
      if (p.tracks.some((t) => t.id === track.id)) return p;
      return { ...p, tracks: [...p.tracks, track] };
    }));
  };

  const removeTrackFromPlaylist = (playlistId, trackId) => {
    setPlaylists((prev) => prev.map((p) => (
      p.id === playlistId ? { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) } : p
    )));
  };

  const isTrackInPlaylist = (playlistId, trackId) => {
    const playlist = playlists.find((p) => p.id === playlistId);
    return !!playlist?.tracks.some((t) => t.id === trackId);
  };

  return (
    <PlaylistsContext.Provider value={{
      playlists, createPlaylist, renamePlaylist, deletePlaylist,
      addTrackToPlaylist, removeTrackFromPlaylist, isTrackInPlaylist,
    }}>
      {children}
    </PlaylistsContext.Provider>
  );
};
