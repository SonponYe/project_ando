import React from "react";

const FavoriteList = ({ favorites, onPlay }) => {
  if (!favorites || favorites.length === 0) {
    return <p className="mt-6 text-center text-gray-600">No favorites yet.</p>;
  }

  return (
    <div className="grid gap-4 mt-6 md:grid-cols-2">
      {favorites.map((track) => (
        <div
          key={track.id}
          className="p-4 bg-white rounded-xl shadow flex items-center justify-between hover:shadow-lg transition"
        >
          <div>
            <p className="text-lg font-semibold">{track.name}</p>
            <p className="text-sm text-gray-500">{track.artist}</p>
          </div>
          <button
            onClick={() => onPlay(track)}
            className="bg-green-500 text-white px-4 py-1 rounded-xl hover:bg-green-600"
          >
            Play
          </button>
        </div>
      ))}
    </div>
  );
};

export default FavoriteList;
