// src/pages/FavoritesPage.js
import React from "react";

export default function FavoritesPage({ favorites = [], onPlay }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Favorites</h2>
      {favorites.length === 0 ? (
        <p>No favorites yet. Go add some!</p>
      ) : (
        <ul className="space-y-4">
          {favorites.map((track, idx) => (
            <li key={idx} className="border p-2 rounded shadow">
              <p className="font-semibold">{track.name}</p>
              <p className="text-sm text-gray-600">{track.artist}</p>
              <audio controls src={track.url} className="mt-2 w-full" />
              <button
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => onPlay(track)}
              >
                Play
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
