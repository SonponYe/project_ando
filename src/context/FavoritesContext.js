import React, { createContext, useState, useEffect } from 'react';
import { rehydrateLocalTracks } from '../api/local/db';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load favorites from localStorage on mount, refreshing any local-file
  // tracks' blob URLs from IndexedDB since the stored one is stale
  useEffect(() => {
    (async () => {
      const saved = localStorage.getItem('favorites');
      if (saved) {
        setFavorites(await rehydrateLocalTracks(JSON.parse(saved)));
      }
      setLoaded(true);
    })();
  }, []);

  // Save favorites to localStorage on change (skip the initial load so we
  // don't immediately overwrite storage with an empty array before it's read)
  useEffect(() => {
    if (loaded) localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites, loaded]);

  const toggleFavorite = (track) => {
    setFavorites((prev) => {
      const exists = prev.find((t) => t.id === track.id);
      return exists ? prev.filter((t) => t.id !== track.id) : [...prev, track];
    });
  };

  const isFavorite = (trackId) => favorites.some((t) => t.id === trackId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
