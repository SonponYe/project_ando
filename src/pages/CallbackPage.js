// src/pages/CallbackPage.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTokenFromUrl } from "../api/spotify/token";
import { setAccessToken } from "../api/spotify/api";

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const tokenData = getTokenFromUrl();
    const token = tokenData.access_token;

    if (token) {
      localStorage.setItem("spotify_token", token);
      setAccessToken(token);
      navigate("/");
    } else {
      console.error("No token found in URL.");
      navigate("/auth");
    }
  }, [navigate]);

  return <div>WAIT FOR THE VIBE BRUH....</div>;
};

export default CallbackPage;
