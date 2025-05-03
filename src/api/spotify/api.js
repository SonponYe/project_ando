// src/apis/spotify/api.js

import axios from "axios";

let token = null;

export const setAccessToken = (accessToken) => {
  token = accessToken;
};

export const searchTracks = async (query) => {
  if (!token) throw new Error("Access token is not set.");

  const response = await axios.get("https://api.spotify.com/v1/search", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      q: query,
      type: "track",
      limit: 10,
    },
  });

  return response.data.tracks.items.map((item) => ({
    id: item.id,
    name: item.name,
    artist: item.artists[0].name,
    url: item.preview_url,
  }));
};
