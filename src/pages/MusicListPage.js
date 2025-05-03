// src/pages/MusicListPage.js
import React from "react";

export default function MusicListPage({ tracks, onAddFavorite }) {
  return (
    <div>
      <h2>Music List</h2>
      {tracks.length === 0 ? (
        <p>No tracks available. Go back and select a mood & genre.</p>
      ) : (
        <ul>
          {tracks.map((track) => (
            <li key={track.id} style={{ marginBottom: "1rem" }}>
              <strong>{track.title}</strong> by {track.user.name}
              <br />
              <audio controls src={track.preview_url || track.stream_url} />
              <br />
              <button onClick={() => onAddFavorite(track)}>❤️ Favorite</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
