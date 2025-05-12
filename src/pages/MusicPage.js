// src/pages/MusicPage.js
import { useEffect, useState } from 'react';
import { fetchUserTopTracks, getSavedTracks, searchTracks } from '../api/spotify/api';

const moods = ['Happy', 'Sad', 'Energetic', 'Calm'];
const genres = ['pop', 'rock', 'hip-hop', 'jazz', 'classical'];

const MusicPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tracks, setTracks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    const loadTracks = async () => {
      const topTracks = await fetchUserTopTracks();
      const saved = await getSavedTracks();
      setTracks(topTracks);
      setFavorites(saved);
    };
    loadTracks();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    const results = await searchTracks(searchTerm);
    setTracks(results);
  };

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    const results = await searchTracks(mood);
    setTracks(results);
  };

  const handleGenreSelect = async (e) => {
    const genre = e.target.value;
    setSelectedGenre(genre);
    if (genre) {
      const results = await searchTracks(genre);
      setTracks(results);
    }
  };

  const isFavorite = (trackId) => favorites.some((track) => track.id === trackId);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-black to-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Discover Music</h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search songs, artists..."
          className="px-4 py-2 rounded text-black w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="px-4 py-2 bg-green-500 rounded hover:bg-green-600">
          Search
        </button>
      </form>

      {/* Mood Cards */}
      <div className="mb-4">
        <h2 className="text-xl mb-2">Mood</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {moods.map((mood) => (
            <div
              key={mood}
              className={`p-4 rounded-lg cursor-pointer text-center border ${
                selectedMood === mood ? 'bg-green-500' : 'bg-white text-black'
              }`}
              onClick={() => handleMoodSelect(mood)}
            >
              {mood}
            </div>
          ))}
        </div>
      </div>

      {/* Genre Dropdown */}
      <div className="mb-4">
        <h2 className="text-xl mb-2">Genre</h2>
        <select
          value={selectedGenre}
          onChange={handleGenreSelect}
          className="text-black px-4 py-2 rounded"
        >
          <option value="">Select a genre</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre.charAt(0).toUpperCase() + genre.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Track List */}
      <div>
        {tracks.length === 0 ? (
          <p>No tracks found.</p>
        ) : (
          <ul className="grid gap-4">
            {tracks.map((track) => (
              <li
                key={track.id}
                className="p-4 rounded bg-gray-800 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">{track.name}</p>
                  <p className="text-sm text-gray-400">
                    {track.artists.map((a) => a.name).join(', ')}
                  </p>
                </div>
                <div>
                  {isFavorite(track.id) && <span className="text-yellow-400">★</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MusicPage;
