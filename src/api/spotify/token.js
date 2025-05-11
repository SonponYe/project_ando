// src/api/spotify/token.js
const CLIENT_ID = 'e7046a4937da4182b586c352a0c66d3d';
const REDIRECT_URI = 'https://ando-ten.vercel.app/callback';
const SCOPES = 'user-read-private user-read-email user-library-read user-top-read';
const CODE_VERIFIER_KEY = 'spotify_code_verifier';

function generateRandomString(length) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(x => charset[x % charset.length])
    .join('');
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function redirectToSpotifyAuth() {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function exchangeToken(code) {
  const codeVerifier = localStorage.getItem(CODE_VERIFIER_KEY);
  if (!codeVerifier) throw new Error('No code verifier found in localStorage');

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!res.ok) {
    console.error('[Token] Token exchange failed:', await res.text());
    throw new Error('Token exchange failed');
  }

  const data = await res.json();
  storeToken(data.access_token, data.expires_in);
  return data.access_token;
}

export function storeToken(token, expiresIn) {
  const expiresAt = Date.now() + expiresIn * 1000;
  localStorage.setItem('spotify_access_token', token);
  localStorage.setItem('spotify_token_expiry', expiresAt.toString());
}

export function getStoredToken() {
  const token = localStorage.getItem('spotify_access_token');
  const expiry = parseInt(localStorage.getItem('spotify_token_expiry'), 10);

  if (!token || Date.now() > expiry) {
    return null;
  }

  return token;
}
