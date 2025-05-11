// src/pages/HomePage.js
import React from "react";
import Navbar from "../components/Navbar";
import MoodSelector from "../components/MoodSelector";
import GenreSelector from "../components/GenreSelector";
import SearchBar from "../components/SearchBar";
import { getSpotifyAuthUrl } from '../api/spotify/auth';
import { getStoredToken } from '../api/spotify/token';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {

  const token = getStoredToken();
  const navigate = useNavigate();

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  const handleExplore = () => {
    navigate('/music');
    console.log("Go to Music clicked");
  };





  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to Ando</h1>
      <p className="mb-4">Your mood-based music experience.</p>

      {!token ? (
        <button
          onClick={handleLogin}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded"
        >
          Login with Spotify
        </button>
      ) : (
        <button
          onClick={handleExplore}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded"
        >
          Go to Music
        </button>
      )}
    </div>
  );
};

export default HomePage;