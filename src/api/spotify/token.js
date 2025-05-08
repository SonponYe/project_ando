// src/apis/spotify/token.js

const TOKEN_KEY = 'spotify_token';
const TOKEN_TIMESTAMP_KEY = 'spotify_token_timestamp';
const TOKEN_EXPIRE_KEY = 'spotify_token_expires_in';

export const storeToken = (token, expiresIn = 3600) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_TIMESTAMP_KEY, Date.now().toString());
  localStorage.setItem(TOKEN_EXPIRE_KEY, expiresIn.toString());
};

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const isTokenExpired = () => {
  const timestamp = localStorage.getItem(TOKEN_TIMESTAMP_KEY);
  const expiresIn = localStorage.getItem(TOKEN_EXPIRE_KEY);

  if (!timestamp || !expiresIn) return true;

  const elapsed = (Date.now() - parseInt(timestamp)) / 1000;
  return elapsed > parseInt(expiresIn);
};

export const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_TIMESTAMP_KEY);
  localStorage.removeItem(TOKEN_EXPIRE_KEY);
};

// For parsing access_token and expires_in from the URL
export const getTokenFromUrl = () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return {
    access_token: params.get("access_token"),
    expires_in: params.get("expires_in") || 3600,
  };
};
