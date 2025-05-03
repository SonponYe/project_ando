// src/components/MusicList.js
import React from "react";

export default function MusicList({ tracks, onTrackSelect }) {
  return (
    <div>
      {tracks.map((track) => (
        <div key={track.id} onClick={() => onTrackSelect(track)}>
          {track.name} - {track.artist}
        </div>
      ))}
    </div>
  );
}
