// src/api/spotify/api.js

let accessToken = '';

export const setAccessToken = (token) => {
  accessToken = token;
};

// Search tracks
export const fetchTracksBySearch = async (query) => {
  const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return data.tracks?.items || [];
};

// Get top tracks
export const fetchUserTopTracks = async () => {
  const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=20', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return data.items || [];
};

// Get saved (liked) tracks
export const getSavedTracks = async () => {
  const response = await fetch('https://api.spotify.com/v1/me/tracks?limit=20', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return data.items?.map(item => item.track) || [];
};

// Alias searchTracks to fetchTracksBySearch
export const searchTracks = fetchTracksBySearch;
