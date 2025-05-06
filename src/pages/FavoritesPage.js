import React, { useEffect, useState } from "react";
import { getSavedTracks } from "../api/spotify/api";
import MusicList from "../components/MusicList";
import { useNavigate } from "react-router-dom";

const FavoritesPage = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedTracks = async () => {
      try {
        const savedTracks = await getSavedTracks();
        setTracks(savedTracks);
      } catch (err) {
        console.error("Error fetching saved tracks:", err);
        setError("Could not load favorites. Redirecting to auth...");
        setTimeout(() => navigate("/auth"), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedTracks();
  }, [navigate]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Your Favorite Tracks</h1>
      {loading && <p>Loading favorites...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && <MusicList tracks={tracks} />}
    </div>
  );
};

export default FavoritesPage;