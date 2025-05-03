// src/pages/HomePage.js
import React, { useState } from "react";

import MoodSelector from "../components/MoodSelector";
import GenreSelector from "../components/GenreSelector";
import SearchBar from "../components/SearchBar";

export default function HomePage({ onSelection, onLogout }) {
  const [mood, setMood] = useState("");
  const [genre, setGenre] = useState("");
  const [query, setQuery] = useState("");

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
    setGenre(""); // Reset genre when mood changes
  };

  const handleGenreSelect = (selectedGenre) => {
    setGenre(selectedGenre);
  };

  const handleSelectionClick = () => {
    if (mood && genre) {
      onSelection(mood, genre, query); // Send mood, genre, and search query to App
    } else {
      alert("Please select both mood and genre.");
    }
  };

  return (
    <div>
     
      <h1>Welcome to Ando</h1>


      <MoodSelector onMoodSelect={handleMoodSelect} />
      {mood && (
        <div>
          <h2>Selected Mood: {mood}</h2>
          <GenreSelector selectedGenre={genre} onGenreChange={handleGenreSelect} />
          <button onClick={handleSelectionClick}>Load Music</button>
        </div>
      )}
    </div>
  );
}
