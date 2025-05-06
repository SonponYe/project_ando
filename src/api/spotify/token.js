// src/apis/spotify/token.js

export const getTokenFromUrl = () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get("access_token");
  };
  
  export const isTokenExpired = () => {
    const token = localStorage.getItem("spotify_token");
    // Basic presence check — Spotify access tokens last 1 hour, so optionally handle expiration
    return !token;
  };
  
  export const logoutSpotify = () => {
    localStorage.removeItem("spotify_token");
    window.location.href = "/auth";
  };
  