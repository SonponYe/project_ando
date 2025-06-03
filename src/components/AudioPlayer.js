import React, { useState, useEffect } from 'react';
import ReactHowler from 'react-howler';

const AudioPlayer = ({ track }) => {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (track?.preview_url) {
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }, [track]);

  if (!track?.preview_url) {
    return <p>No preview available for this track.</p>;
  }

  return (
    <div className="audio-player">
      <ReactHowler
        src={track.preview_url}
        playing={playing}
        onEnd={() => setPlaying(false)}
        html5={true}
      />
      <button onClick={() => setPlaying(!playing)}>
        {playing ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

export default AudioPlayer;
