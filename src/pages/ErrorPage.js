// src/pages/HomePage.js
import React from "react";
import Navbar from "../components/Navbar";
import MoodSelector from "../components/MoodSelector";

export default function HomePage({ onSelection, onLogout }) {
  const handleMoodSelect = (mood) => {
    const genre = "pop"; // or you could let the user pick this too
    onSelection(mood, genre);
  };

  return (
    <div>
      <Navbar onLogout={onLogout} />
      <h1>Welcome to Ando</h1>
      <MoodSelector onMoodSelect={handleMoodSelect} />
      <button onClick={() => onSelection("happy", "pop")}>Load Music</button>
    </div>
  );
}
