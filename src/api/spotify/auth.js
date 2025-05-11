// src/api/spotify/auth.js

const CLIENT_ID = 'e7046a4937da4182b586c352a0c66d3d'; // Replace with your real one
const REDIRECT_URI = 'https://ando-ten.vercel.app/callback';
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-library-read',
  'user-top-read',
];

export const getSpotifyAuthUrl = () => {
  const authUrl = `https://accounts.spotify.com/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&response_type=token` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(SCOPES.join(' '))}`;

  return authUrl;
};
