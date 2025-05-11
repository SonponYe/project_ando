// src/api/spotify/api.js
import axios from 'axios';

let accessToken = null;

export const setAccessToken = (token) => {
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
