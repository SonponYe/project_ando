// src/api/spotify/token.js
const SPOTIFY_CLIENT_ID = process.env.REACT_APP_SPOTIFY_ID || '<YOUR_SPOTIFY_ID>'; // use CRA env var

// Use environment variable or hardcode for local/production
const REDIRECT_URI = (function() {
  if (process.env.REACT_APP_SPOTIFY_REDIRECT_URI) return process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
  if (typeof window !== 'undefined' && window.location && window.location.origin.includes('localhost')) {
    return 'http://localhost:3000/callback';
  }
  return 'https://ando-ten.vercel.app/callback';
})();

const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-library-read',
  'user-top-read',
];

function generateRandomString(length = 128) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const cryptoObj = window.crypto || window.msCrypto;
  const randomValues = new Uint32Array(length);
  cryptoObj.getRandomValues(randomValues);
  return Array.from(randomValues, value => charset[value % charset.length]).join('');
}

async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export const initiateAuthFlow = async () => {
  const codeVerifier = generateRandomString();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  localStorage.setItem('spotify_code_verifier', codeVerifier);

  const authParams = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(' '),
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });

  window.location = `https://accounts.spotify.com/authorize?${authParams.toString()}`;
};

export const handleTokenExchange = async (code) => {
  const codeVerifier = localStorage.getItem('spotify_code_verifier');
  if (!codeVerifier) throw new Error('Missing code verifier');

  const requestBody = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: SPOTIFY_CLIENT_ID,
    code_verifier: codeVerifier,
  });

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: requestBody.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Spotify API error: ${errorData.error_description || 'Unknown error'}`);
  }

  const tokenData = await response.json();
  return persistTokenData(tokenData);
};

const persistTokenData = (tokenData) => {
  const expirationTime = Date.now() + (tokenData.expires_in * 1000);
  localStorage.setItem('spotify_access_token', tokenData.access_token);
  localStorage.setItem('spotify_token_expiry', expirationTime.toString());
  return tokenData.access_token;
};

export const retrieveValidToken = () => {
  const token = localStorage.getItem('spotify_access_token');
  const expiry = localStorage.getItem('spotify_token_expiry');
  if (!token || !expiry) return null;
  if (Date.now() > parseInt(expiry, 10)) {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expiry');
    return null;
  }
  return token;
};

export const isAuthenticated = () => !!retrieveValidToken();

export const clearAuthData = () => {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_token_expiry');
  localStorage.removeItem('spotify_code_verifier');
};
