// src/pages/CallbackPage.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTokenFromUrl } from "../apipotify/token";
import { setAccessToken } from "../api/spotify/api";

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getTokenFromUrl();
    if (token) {
      localStorage.setItem("spotify_token", token);
      setAccessToken(token);
      navigate("/home");
    } else {
      navigate("/error");
    }
  }, [navigate]);

  return <div className="p-4 text-center text-gray-600">Redirecting...</div>;
};

export default CallbackPage;
