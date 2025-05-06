// src/apis/spotify/auth.js

const CLIENT_ID =  "e7046a4937da4182b586c352a0c66d3d"; // Replace with your actual Spotify Client ID
const REDIRECT_URI = "https://ando-ten.vercel.app/callback"; // Your deployed redirect URI
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "streaming",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-library-read",
  "user-library-modify",
];

export const getSpotifyAuthUrl = () => {
  const scopeParam = encodeURIComponent(SCOPES.join(" "));
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${scopeParam}`;
  return authUrl;
};
