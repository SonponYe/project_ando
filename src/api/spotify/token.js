// src/api/spotify/token.js
const CLIENT_ID = 'e7046a4937da4182b586c352a0c66d3d';
const REDIRECT_URI = 'https://ando-ten.vercel.app/callback';
const CODE_VERIFIER_KEY = 'pkce_code_verifier';

const generateRandomString = (length) => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('');
};

const base64UrlEncode = (str) =>
  btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

export const generateCodeChallenge = async (verifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(digest);
};

export const redirectToSpotifyLogin = async () => {
  const verifier = generateRandomString(64);
  const challenge = await generateCodeChallenge(verifier);
  localStorage.setItem(CODE_VERIFIER_KEY, verifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    scope: 'user-top-read user-library-read',
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

export const fetchAccessToken = async (code) => {
  const verifier = localStorage.getItem(CODE_VERIFIER_KEY);
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: verifier,
    }),
  });

  if (!res.ok) throw new Error('Token exchange failed');
  const data = await res.json();
  const expiryTime = Date.now() + data.expires_in * 1000;
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('expires_at', expiryTime);
  return data.access_token;
};

export const getStoredToken = () => {
  const token = localStorage.getItem('access_token');
  const expires = parseInt(localStorage.getItem('expires_at'), 10);
  if (!token || Date.now() > expires) return null;
  return token;
};

export const clearStoredToken = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('expires_at');
  localStorage.removeItem(CODE_VERIFIER_KEY);
};
// src/api/spotify/token.js

export const isTokenExpired = () => {
  const expiryTime = localStorage.getItem('spotify_token_expiry');
  if (!expiryTime) return true;
  return Date.now() > parseInt(expiryTime, 10);
};
