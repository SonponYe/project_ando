// src/pages/AuthPage.js

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSpotifyAuthUrl } from "../api/spotify/auth";

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    if (token) {
      // Already authenticated, redirect to home
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = () => {
    const authUrl = getSpotifyAuthUrl();
    console.log("Redirecting to:", authUrl); // ✅ This shows the full URL
    window.location.href = authUrl;
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Connect to Spotify</h2>
      <button
        onClick={handleLogin}
        style={{
          padding: "12px 24px",
          backgroundColor: "#1DB954",
          color: "#fff",
          border: "none",
          borderRadius: "30px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Connect with Spotify
      </button>
    </div>
  );
};

export default AuthPage;
