// src/apis/spotify/api.js

let accessToken = localStorage.getItem("spotify_token");

export const setAccessToken = (token) => {
  accessToken = token;
};

const getHeaders = () => ({
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
});

export const fetchUserProfile = async () => {
  try {
    const res = await fetch("https://api.spotify.com/v1/me", {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch user profile");
    return await res.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const fetchTracksBySearch = async (query) => {
  try {
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
      { headers: getHeaders() }
    );
    if (!res.ok) throw new Error("Failed to fetch tracks");
    const data = await res.json();
    return data.tracks.items;
  } catch (error) {
    console.error("Error searching tracks:", error);
    return [];
  }
};
