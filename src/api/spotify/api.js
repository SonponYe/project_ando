// src/apis/spotify/api.js
import axios from 'axios';

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

const getHeaders = () => ({
  Authorization: `Bearer ${accessToken}`,
});

export const fetchTracksBySearch = async (query) => {
  const res = await axios.get(`https://api.spotify.com/v1/search`, {
    headers: getHeaders(),
    params: { q: query, type: 'track', limit: 10 },
  });
  return res.data.tracks.items;
};

export const getSavedTracks = async () => {
  const res = await axios.get('https://api.spotify.com/v1/me/tracks', {
    headers: getHeaders(),
    params: { limit: 10 },
  });
  return res.data.items.map(item => item.track);
};

export const fetchUserProfile = async () => {
  const res = await axios.get('https://api.spotify.com/v1/me', {
    headers: getHeaders(),
  });
  return res.data;
};

export const fetchUserTopTracks = async () => {
  const res = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
    headers: getHeaders(),
    params: { limit: 10 },
  });
  return res.data.items;
};

export const searchTracks = fetchTracksBySearch;
