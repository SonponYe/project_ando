// src/components/SearchBar.js
import React from "react";

export default function SearchBar({ value, onChange, onSearch }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search for a song or artist"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border p-2 rounded w-full max-w-md"
      />
      <button onClick={onSearch} className="px-4 py-2 bg-blue-500 text-white rounded">
        Search
      </button>
    </div>
  );
}
