// src/components/GenreSelector.js
import React from "react";

const genres = ["Pop", "Rock", "Hip-hop", "Jazz", "Electronic", "Classical"];

export default function GenreSelector({ selectedGenre, onGenreChange }) {
  return (
    <div>
      <label>Select Genre: </label>
      <select value={selectedGenre} onChange={(e) => onGenreChange(e.target.value)}>
        <option value="">--Choose Genre--</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  );
}
