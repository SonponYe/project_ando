// src/api/spotify/token.js

const SPOTIFY_CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID';
const REDIRECT_URI = 'https://ando-ten.vercel.app/callback';

const scopes = [
  'user-read-private',
  'user-read-email',
  'user-library-read',
  'user-top-read',
];

function generateRandomString(length) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const cryptoObj = window.crypto || window.msCrypto;
  const randomValues = new Uint32Array(length);
  cryptoObj.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length];
  }
  return result;
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export const redirectToSpotifyAuth = async () => {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem('spotify_code_verifier', codeVerifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: scopes.join(' '),
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });

  window.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

export const exchangeToken = async (code) => {
  const codeVerifier = localStorage.getItem('spotify_code_verifier');
  if (!codeVerifier) throw new Error('Missing code verifier');

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: SPOTIFY_CLIENT_ID,
    code_verifier: codeVerifier,
  });

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const data = await response.json();

  if (data.access_token) {
    storeToken(data);
  }

  return data;
};

export const storeToken = (data) => {
  const expiryTime = Date.now() + data.expires_in * 1000;
  localStorage.setItem('spotify_token', data.access_token);
  localStorage.setItem('spotify_token_expiry', expiryTime);
};

export const getStoredToken = () => {
  const token = localStorage.getItem('spotify_token');
  const expiry = localStorage.getItem('spotify_token_expiry');
  if (!token || !expiry || Date.now() > Number(expiry)) {
    return null;
  }
  return token;
};
