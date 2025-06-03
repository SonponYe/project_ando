// src/api/spotify/api.js
import axios from 'axios';
import { retrieveValidToken } from './token';

const getHeaders = () => {
  const token = retrieveValidToken();
  if (!token) {
    console.warn('[Spotify API] No access token set!');
    return {};
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

const handleError = (error, context) => {
  if (error.response) {
    console.error(`[Spotify API] ${context} failed:`, error.response.data);
  } else {
    console.error(`[Spotify API] ${context} failed:`, error.message);
  }
};

export const fetchTracksBySearch = async (query) => {
  try {
    const res = await axios.get('https://api.spotify.com/v1/search', {
      headers: getHeaders(),
      params: { q: query, type: 'track', limit: 10 },
    });
    return res.data.tracks.items;
  } catch (err) {
    handleError(err, 'Search Tracks');
    return [];
  }
};

export const fetchUserTopTracks = async () => {
  try {
    const res = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      headers: getHeaders(),
      params: { limit: 10 },
    });
    return res.data.items;
  } catch (err) {
    handleError(err, 'Top Tracks');
    return [];
  }
};

export const getSavedTracks = async () => {
  try {
    const res = await axios.get('https://api.spotify.com/v1/me/tracks', {
      headers: getHeaders(),
      params: { limit: 10 },
    });
    return res.data.items.map(item => item.track);
  } catch (err) {
    handleError(err, 'Saved Tracks');
    return [];
  }
};

export const searchTracks = fetchTracksBySearch;

export const fetchUserProfile = async () => {
  try {
    const res = await axios.get('https://api.spotify.com/v1/me', {
      headers: getHeaders(),
    });
    return res.data;
  } catch (err) {
    console.error('[Spotify API] Fetch User Profile failed:', err);
    return null;
  }
};

// Save a track to user's favorites
export const saveTrackToFavorites = async (trackId) => {
  try {
    // Spotify API expects an array of track IDs
    await axios.put(
      `https://api.spotify.com/v1/me/tracks?ids=${trackId}`,
      null,
      {
        headers: getHeaders(),
      }
    );
    return true;
  } catch (error) {
    console.error('[Spotify API] saveTrackToFavorites error:', error);
    return false;
  }
};

// Fetch recently played tracks (fixed)
export const fetchRecentlyPlayed = async () => {
  try {
    const res = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
      headers: getHeaders(),
      params: { limit: 10 },
    });
    return res.data;
  } catch (err) {
    handleError(err, 'Recently Played');
    return { items: [] };
  }
};

// Remove a track from user's favorites
export const removeTrackFromFavorites = async (trackId) => {
  try {
    // Spotify API expects an array of track IDs
    await axios.delete(
      `https://api.spotify.com/v1/me/tracks?ids=${trackId}`,
      {
        headers: getHeaders(),
      }
    );
    return true;
  } catch (error) {
    console.error('[Spotify API] removeTrackFromFavorites error:', error);
    return false;
  }
};
