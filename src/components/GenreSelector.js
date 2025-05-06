// src/components/GenreSelector.js
import React from "react";

const genres = ["Pop", "Rock", "Hip-Hop", "Jazz", "Classical", "Electronic", "Afrobeats"];

const GenreSelector = ({ onSelect }) => {
  return (
    <div className="mt-6">
      <label className="block text-lg font-medium mb-2 text-gray-800">Select Genre</label>
      <select
        onChange={(e) => onSelect(e.target.value)}
        className="w-full p-3 border rounded-xl shadow"
      >
        <option value="">-- Choose Genre --</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>{genre}</option>
        ))}
      </select>
    </div>
  );
};

export default GenreSelector;
