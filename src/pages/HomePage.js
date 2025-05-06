// src/pages/HomePage.js
import React from "react";
import Navbar from "../components/Navbar";
import MoodSelector from "../components/MoodSelector";
import GenreSelector from "../components/GenreSelector";
import SearchBar from "../components/SearchBar";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Find Your Vibe 🎧</h1>
        <SearchBar />
        <div className="mt-8">
          <MoodSelector />
        </div>
        <div className="mt-8">
          <GenreSelector />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
