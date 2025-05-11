// src/apis/spotify/api.js
import axios from 'axios';

let accessToken = null;

export const setAccessToken = (token) => {
  console.log('[Spotify API] Setting access token:', token);
  accessToken = token;
};

const getHeaders = () => {
  if (!accessToken) {
    console.warn('[Spotify API] No access token set!');
    return {};
  }
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

const handleError = (error, context) => {
  if (error.response) {
    console.error(`[Spotify API] ${context} failed:`, {
      status: error.response.status,
      data: error.response.data,
    });
  } else {
    console.error(`[Spotify API] ${context} failed:`, error.message);
  }
};

// 🔍 Search tracks by query
export const fetchTracksBySearch = async (query) => {
  console.log('[Spotify API] Searching tracks with query:', query);
  try {
    const res = await axios.get('https://api.spotify.com/v1/search', {
      headers: getHeaders(),
      params: { q: query, type: 'track', limit: 10 },
    });
    return res.data.tracks.items;
  } catch (error) {
    handleError(error, 'Search tracks');
    return [];
  }
};

// 🎵 Get user's saved tracks (library)
export const getSavedTracks = async () => {
  console.log('[Spotify API] Fetching saved tracks...');
  try {
    const res = await axios.get('https://api.spotify.com/v1/me/tracks', {
      headers: getHeaders(),
      params: { limit: 10 },
    });
    return res.data.items.map(item => item.track);
  } catch (error) {
    handleError(error, 'Get saved tracks');
    return [];
  }
};

// 👤 Get user profile info
export const fetchUserProfile = async () => {
  console.log('[Spotify API] Fetching user profile...');
  try {
    const res = await axios.get('https://api.spotify.com/v1/me', {
      headers: getHeaders(),
    });
    return res.data;
  } catch (error) {
    handleError(error, 'Fetch user profile');
    return null;
  }
};

// 🎧 Get user's top tracks
export const fetchUserTopTracks = async () => {
  console.log('[Spotify API] Fetching user top tracks...');
  try {
    const res = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      headers: getHeaders(),
      params: { limit: 10 },
    });
    return res.data.items;
  } catch (error) {
    handleError(error, 'Fetch top tracks');
    return [];
  }
};

// Alias
export const searchTracks = fetchTracksBySearch;
