import React from "react";

const MusicPlayer = ({ track }) => {
  if (!track) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black text-white p-4 flex items-center justify-between shadow-xl">
      <div>
        <p className="text-lg font-semibold">{track.name}</p>
        <p className="text-sm text-gray-300">{track.artist}</p>
      </div>
      <audio controls autoPlay src={track.preview_url} className="w-64">
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default MusicPlayer;