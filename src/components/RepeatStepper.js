import React, { useContext } from 'react';
import { LuMinus, LuPlus, LuRepeat1 } from 'react-icons/lu';
import { PlaybackContext } from '../context/PlaybackContext';

// Compact stepper for a track's play count: how many times the song plays
// before the queue moves on (×1 = no repeat). Used in the now-playing view
// and on each Up Next queue row.
const RepeatStepper = ({ trackId, showIcon = false }) => {
  const { trackRepeats, setTrackRepeat } = useContext(PlaybackContext);
  const count = trackRepeats[trackId] || 1;

  return (
    <div
      className={`repeat-stepper${count > 1 ? ' repeat-stepper--active' : ''}`}
      onClick={(e) => e.stopPropagation()}
      title="How many times this song plays before the next one"
    >
      <button
        onClick={() => setTrackRepeat(trackId, count - 1)}
        disabled={count <= 1}
        aria-label="Play this song one fewer time"
      >
        <LuMinus size={11} />
      </button>
      <span>
        {showIcon && <LuRepeat1 size={12} style={{ marginRight: 4, verticalAlign: -2 }} />}
        ×{count}
      </span>
      <button
        onClick={() => setTrackRepeat(trackId, count + 1)}
        disabled={count >= 9}
        aria-label="Play this song one more time"
      >
        <LuPlus size={11} />
      </button>
    </div>
  );
};

export default RepeatStepper;
