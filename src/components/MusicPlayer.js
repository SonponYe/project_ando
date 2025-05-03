// src/components/MusicPlayer.js
import React from "react";

export default function MusicPlayer({ track }) {
  if (!track) return null;

  return (
    <div>
      <h3>Now Playing: {track.name} - {track.artist}</h3>
      <audio controls src={track.url} autoPlay />
    </div>
  );
}
