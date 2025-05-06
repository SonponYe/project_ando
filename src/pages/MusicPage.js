import { useEffect, useState } from "react";
import { searchTracks, fetchUserTopTracks } from "../api/spotify/api";
import { getStoredToken, isTokenExpired } from "../api/spotify/token";
import { useNavigate } from "react-router-dom";
import MusicList from "../components/MusicList";
import SearchBar from "../components/SearchBar";

const MusicPage = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getStoredToken();
    if (!token || isTokenExpired()) {
      navigate("/auth");
    } else {
      fetchUserTopTracks()
        .then((data) => {
          setTracks(data.items);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching top tracks:", error);
          navigate("/error");
        });
    }
  }, [navigate]);

  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const data = await searchTracks(query);
      setTracks(data.tracks.items);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <SearchBar onSearch={handleSearch} />
      {loading ? <p>Loading...</p> : <MusicList tracks={tracks} />}
    </div>
  );
};

export default MusicPage;
