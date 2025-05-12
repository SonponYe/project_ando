// src/pages/HomePage.js
import { redirectToSpotifyAuth } from '../api/spotify/token';

const HomePage = () => {
  const handleLogin = () => {
    redirectToSpotifyAuth();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-400 to-black text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome to Ando</h1>
      <p className="mb-4 text-lg">Stream music by mood or genre.</p>
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition"
      >
        Connect with Spotify
      </button>
    </div>
  );
};

export default HomePage;
