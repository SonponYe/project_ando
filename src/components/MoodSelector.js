// src/components/MoodSelector.js
import React from "react";


const moods = [
  { name: "Happy", image: "/images/happy.jpg" },
  { name: "Sad", image: "/images/sad.jpg" },
  { name: "Chill", image: "/images/chill.jpg" },
  { name: "Energetic", image: "/images/energetic.jpg" }
];

export default function MoodSelector({ onMoodSelect }) {
  return (
    <div className="mood-grid">
      {moods.map((mood) => (
        <div
          key={mood.name}
          className="mood-card"
          onClick={() => onMoodSelect(mood.name)}
          style={{
            backgroundImage: `url(${mood.image})`
          }}
        >
          <div className="mood-overlay">{mood.name}</div>
        </div>
      ))}
    </div>
  );
}
