import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import AuthPage from "./pages/Authpage";
import HomePage from "./pages/HomePage";
import MusicPage from "./pages/MusicPage";
import FavoritesPage from "./pages/FavoritesPage";
import ErrorPage from "./pages/ErrorPage";
import CallbackPage from "./pages/CallbackPage";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";

function App() {
  const [user, setUser] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [query, setQuery] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Check if there's a Spotify token already
  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    if (token) {
      setUser({
        uid: "dummy123",
        displayName: "Spotify User",
        email: "spotifyuser@example.com",
      });
    } else {
      setUser(null);
    }
  }, []);

  const onSearch = async (searchTerm) => {
    const dummyResults = [
      {
        id: 2,
        name: `Search result for "${searchTerm}"`,
        artist: "Search Artist",
        url: "https://samplelib.com/lib/preview/mp3/sample-6s.mp3",
      },
    ];
    setTracks(dummyResults);
  };

  const handleSelection = (mood, genre) => {
    setTracks([
      {
        id: 1,
        name: `Mood: ${mood}, Genre: ${genre}`,
        artist: "Mood Artist",
        url: "https://samplelib.com/lib/preview/mp3/sample-3s.mp3",
      },
    ]);
    navigate("/music");
  };

  const handleAddFavorite = (track) => {
    setFavorites((prev) => [...prev, track]);
  };

  const handleSearchClick = () => {
    if (query.trim()) {
      onSearch(query.trim());
      navigate("/music");
    } else {
      alert("Enter a search term.");
    }
  };

  return (
    <>
      {location.pathname !== "/auth" && location.pathname !== "/callback" && user && (
        <>
          <Navbar user={user} />
          <SearchBar value={query} onChange={setQuery} onSearch={handleSearchClick} />
        </>
      )}

      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route
          path="/"
          element={user ? <HomePage onSelection={handleSelection} /> : <Navigate to="/auth" />}
        />
        <Route
          path="/music"
          element={<MusicPage tracks={tracks} onAddFavorite={handleAddFavorite} />}
        />
        <Route
          path="/favorites"
          element={<FavoritesPage favorites={favorites} />}
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
