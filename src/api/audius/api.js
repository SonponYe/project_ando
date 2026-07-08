// src/api/audius/api.js
import axios from 'axios';

// api.audius.co is Audius' own hosted gateway — it load-balances across the
// decentralized discovery-node network for us, so we don't need to resolve
// a node ourselves.
const BASE_URL = 'https://api.audius.co/v1';
const APP_NAME = 'ando';

// Normalize an Audius track into the same shape used across the app
// (mirrors Jamendo's normalized track: id, name, artists[], album{}, preview_url).
// IDs are prefixed so they never collide with Jamendo's numeric ids once
// both sources are merged into one list.
const normalizeTrack = (t) => {
  const artwork = t.artwork || {};
  const art = artwork['480x480'] || artwork['150x150'] || Object.values(artwork)[0] || null;
  return {
    id: `audius-${t.id}`,
    name: t.title,
    artists: [{ name: t.user?.name || t.user?.handle || 'Unknown Artist' }],
    album: {
      name: t.genre || '',
      images: art ? [{ url: art }] : [],
    },
    preview_url: `${BASE_URL}/tracks/${t.id}/stream?app_name=${APP_NAME}`,
  };
};

const handleError = (error, context) => {
  if (error.response) {
    console.error(`[Audius API] ${context} failed:`, error.response.data);
  } else {
    console.error(`[Audius API] ${context} failed:`, error.message);
  }
};

export const searchTracks = async (query) => {
  try {
    const res = await axios.get(`${BASE_URL}/tracks/search`, {
      params: { query, app_name: APP_NAME },
    });
    return (res.data.data || []).map(normalizeTrack);
  } catch (err) {
    handleError(err, 'Search Tracks');
    return [];
  }
};
