// src/components/MoodSelector.js
import React from "react";

const moods = [
  { name: "Chill", image: "/moods/chill.jpg" },
  { name: "Happy", image: "/moods/happy.jpg" },
  { name: "Sad", image: "/moods/sad.jpg" },
  { name: "Workout", image: "/moods/workout.jpg" },
];

const MoodSelector = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {moods.map((mood) => (
        <div
          key={mood.name}
          className="relative cursor-pointer rounded-2xl overflow-hidden shadow-lg group"
          onClick={() => onSelect(mood.name)}
        >
          <img
            src={mood.image}
            alt={mood.name}
            className="w-full h-32 object-cover group-hover:brightness-50 transition"
          />
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl bg-black bg-opacity-30">
            {mood.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoodSelector;
