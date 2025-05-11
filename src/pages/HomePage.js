// src/pages/HomePage.js
import React from 'react';
import { redirectToSpotifyLogin } from '../api/spotify/token';

const HomePage = () => (
  <div className="home">
    <h1>Welcome to Ando</h1>
    <button onClick={redirectToSpotifyLogin}>Login with Spotify</button>
  </div>
);

export default HomePage;
