import React from "react";

const MusicList = ({ tracks, onPlay, onFavorite }) => {
  if (!tracks || tracks.length === 0) {
    return <p className="mt-6 text-center text-gray-600">No tracks found.</p>;
  }

  return (
    <div className="grid gap-4 mt-6 md:grid-cols-2">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="p-4 bg-white rounded-xl shadow flex items-center justify-between hover:shadow-lg transition"
        >
          <div>
            <p className="text-lg font-semibold">{track.name}</p>
            <p className="text-sm text-gray-500">{track.artist}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPlay(track)}
              className="bg-green-500 text-white px-4 py-1 rounded-xl hover:bg-green-600"
            >
              Play
            </button>
            <button
              onClick={() => onFavorite(track)}
              className="bg-pink-500 text-white px-3 py-1 rounded-xl hover:bg-pink-600"
            >
              ❤️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MusicList;