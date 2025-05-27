// src/pages/AuthPage.js
import React from "react";
import { initiateAuthFlow } from "../api/spotify/token";

const AuthPage = () => {
  const handleLogin = async () => {
    await initiateAuthFlow();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Ando 🎵</h1>
      <p className="mb-6 text-gray-600">
        Discover music by mood, genre, or search — no account setup needed.
      </p>
      <button
        onClick={handleLogin}
        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
      >
        Start Listening
      </button>
    </div>
  );
};

export default AuthPage;
