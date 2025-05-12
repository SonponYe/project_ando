// src/api/spotify/token.js
const CLIENT_ID = 'e7046a4937da4182b586c352a0c66d3d';
const REDIRECT_URI = 'https://ando-ten.vercel.app/callback';
const SCOPES = 'user-read-private user-read-email user-library-read';

function generateCodeVerifier(length = 128) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let codeVerifier = '';
  for (let i = 0; i < length; i++) {
    codeVerifier += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return codeVerifier;
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  const base64Digest = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return base64Digest;
}

export async function redirectToSpotifyAuth() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem('spotify_code_verifier', codeVerifier);

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('scope', SCOPES.join(' '));
  authUrl.searchParams.set('code_challenge_method', 'S256');
  authUrl.searchParams.set('code_challenge', codeChallenge);

  window.location.href = authUrl.toString();
}

export async function exchangeToken(code) {
  const codeVerifier = localStorage.getItem('spotify_code_verifier');
  if (!codeVerifier) throw new Error('Code verifier not found');

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  });

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || 'Token exchange failed');

  const now = Date.now();
  const expiresAt = now + data.expires_in * 1000;

  localStorage.setItem('spotify_access_token', data.access_token);
  localStorage.setItem('spotify_token_expiry', expiresAt.toString());

  return data.access_token;
}

export function getStoredToken() {
  const token = localStorage.getItem('spotify_access_token');
  const expiry = parseInt(localStorage.getItem('spotify_token_expiry'), 10);
  if (!token || !expiry || Date.now() > expiry) return null;
  return token;
}

export function storeToken(token, expiresIn) {
  const expiresAt = Date.now() + expiresIn * 1000;
  localStorage.setItem('spotify_access_token', token);
  localStorage.setItem('spotify_token_expiry', expiresAt.toString());
}

// ✅ Export the missing function
export function isTokenExpired() {
  const expiry = parseInt(localStorage.getItem('spotify_token_expiry'), 10);
  return !expiry || Date.now() > expiry;
}
