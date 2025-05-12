// src/api/spotify/token.js
const CLIENT_ID = 'e7046a4937da4182b586c352a0c66d3d';
const REDIRECT_URI = 'https://ando-ten.vercel.app/callback';
const SCOPES = 'user-read-private user-read-email user-library-read';

function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(x => possible[x % possible.length])
    .join('');
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function redirectToSpotifyAuth() {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem('spotify_code_verifier', codeVerifier);

  const authUrl = `https://accounts.spotify.com/authorize?` +
    new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: SCOPES,
      redirect_uri: REDIRECT_URI,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
    });

  window.location.href = authUrl;
}

export async function exchangeToken(code) {
  const codeVerifier = localStorage.getItem('spotify_code_verifier');
  if (!codeVerifier) {
    throw new Error('Code verifier not found');
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: codeVerifier,
  });

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || 'Token exchange failed');
  }

  storeToken(data.access_token, data.expires_in);
  return data;
}

export function storeToken(token, expiresIn) {
  const expiryTime = Date.now() + expiresIn * 1000;
  localStorage.setItem('spotify_token', token);
  localStorage.setItem('spotify_token_expiry', expiryTime.toString());
}

export function getStoredToken() {
  const token = localStorage.getItem('spotify_token');
  const expiry = parseInt(localStorage.getItem('spotify_token_expiry'), 10);

  if (!token || Date.now() > expiry) {
    return null;
  }

  return token;
}

export function isTokenExpired() {
  const expiry = parseInt(localStorage.getItem('spotify_token_expiry'), 10);
  return !expiry || Date.now() > expiry;
}

