// src/api/jamendo/api.js
import axios from 'axios';

const CLIENT_ID = process.env.REACT_APP_JAMENDO_CLIENT_ID;
const BASE_URL = 'https://api.jamendo.com/v3.0';

const baseParams = () => ({
  client_id: CLIENT_ID,
  format: 'json',
  limit: 24,
  include: 'musicinfo',
  audioformat: 'mp32',
});

// Normalize a Jamendo track into the shape the UI already expects
// (mirrors the Spotify track object: id, name, artists[], album{}, preview_url)
const normalizeTrack = (item) => ({
  id: String(item.id),
  name: item.name,
  artists: [{ name: item.artist_name }],
  album: {
    name: item.album_name || '',
    images: item.album_image ? [{ url: item.album_image }] : [],
  },
  preview_url: item.audio || null,
});

const handleError = (error, context) => {
  if (error.response) {
    console.error(`[Jamendo API] ${context} failed:`, error.response.data);
  } else {
    console.error(`[Jamendo API] ${context} failed:`, error.message);
  }
};

export const searchTracks = async (query) => {
  if (!CLIENT_ID) {
    console.warn('[Jamendo API] Missing REACT_APP_JAMENDO_CLIENT_ID');
    return [];
  }
  try {
    const res = await axios.get(`${BASE_URL}/tracks/`, {
      params: { ...baseParams(), namesearch: query, order: 'relevance' },
    });
    return res.data.results.map(normalizeTrack);
  } catch (err) {
    handleError(err, 'Search Tracks');
    return [];
  }
};

export const browseByTags = async (tags) => {
  if (!CLIENT_ID) {
    console.warn('[Jamendo API] Missing REACT_APP_JAMENDO_CLIENT_ID');
    return [];
  }
  try {
    const res = await axios.get(`${BASE_URL}/tracks/`, {
      params: { ...baseParams(), fuzzytags: tags.join(' '), order: 'popularity_total' },
    });
    return res.data.results.map(normalizeTrack);
  } catch (err) {
    handleError(err, 'Browse By Tags');
    return [];
  }
};
