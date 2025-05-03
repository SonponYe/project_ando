// src/components/FavoriteList.js
import React from "react";

export default function FavoriteList({ favorites, onPlay }) {
  return (
    <div>
      <h2>Your Favorites</h2>
      {favorites.map((track) => (
        <div key={track.id} onClick={() => onPlay(track)}>
          {track.name} - {track.artist}
        </div>
      ))}
    </div>
  );
}
