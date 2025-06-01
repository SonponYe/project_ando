const { playTrack, pause, currentTrack, isPlaying } = useContext(PlaybackContext);

<button
  onClick={() => (isCurrent && isPlaying ? pause() : playTrack(track))}
  disabled={!track.preview_url}
  style={{
    backgroundColor: isCurrent ? '#2563eb' : '#4F46E5',
    border: 'none',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: track.preview_url ? 'pointer' : 'not-allowed',
  }}
  aria-label={track.preview_url ? `${isCurrent && isPlaying ? 'Pause' : 'Play'} ${track.name}` : 'Preview not available'}
>
  {isCurrent && isPlaying ? 'Pause' : 'Play'}
</button>
