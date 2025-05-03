// src/pages/MusicPage.js
import React, { useState } from "react";
import SearchBar from "../components/SearchBar";

export default function MusicPage({ tracks, onAddFavorite }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTracks = tracks.filter(
    (track) =>
      track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Tracks</h2>
   

      {filteredTracks.length === 0 ? (
        <p>No tracks found</p>
      ) : (
        <ul>
          {filteredTracks.map((track) => (
            <li key={track.id}>
              <h3>{track.name}</h3>
              <p>{track.artist}</p>
              {track.url ? (
                <audio controls src={track.url}></audio>
              ) : (
                <p>No preview available</p>
              )}
              <button onClick={() => onAddFavorite(track)}>❤️ Favorite</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
