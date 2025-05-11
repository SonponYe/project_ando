// src/api/spotify/token.js

const TOKEN_KEY = 'spotify_access_token';
const EXPIRY_KEY = 'spotify_token_expiry';

export const storeToken = (token, expiresIn = 3600) => {
  const expiryTime = Date.now() + expiresIn * 1000;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRY_KEY, expiryTime.toString());
};

export const getStoredToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(EXPIRY_KEY);

  if (!token || !expiry) return null;

  const isExpired = Date.now() > parseInt(expiry, 10);
  return isExpired ? null : token;
};

export const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
};

export const isTokenExpired = () => {
  const expiry = localStorage.getItem(EXPIRY_KEY);
  return !expiry || Date.now() > parseInt(expiry, 10);
};

// src/api/spotify/token.js
export const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split('&')
    .reduce((acc, item) => {
      const [key, value] = item.split('=');
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
};

