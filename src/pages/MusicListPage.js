import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlaybackContext } from '../context/PlaybackContext';
import { saveTrackToFavorites, removeTrackFromFavorites, getSavedTracks } from '../api/spotify/api';

const MusicListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tracks = location.state?.tracks || [];
  const { playTrack, currentTrack, isPlaying } = useContext(PlaybackContext);

  const [favorites, setFavorites] = useState(new Set());
  const [loadingFav, setLoadingFav] = useState(false);

  // Fetch user's saved tracks on mount to know favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoadingFav(true);
      try {
        const saved = await getSavedTracks();
        // Use a Set of track IDs for quick lookup
        setFavorites(new Set(saved.map((t) => t.id)));
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        setLoadingFav(false);
      }
    };
    fetchFavorites();
  }, []);

  const toggleFavorite = async (trackId) => {
    if (loadingFav) return; // prevent multiple simultaneous requests
    setLoadingFav(true);
    try {
      if (favorites.has(trackId)) {
        await removeTrackFromFavorites(trackId);
        setFavorites((prev) => {
          const newFav = new Set(prev);
          newFav.delete(trackId);
          return newFav;
        });
      } else {
        await saveTrackToFavorites(trackId);
        setFavorites((prev) => new Set(prev).add(trackId));
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    } finally {
      setLoadingFav(false);
    }
  };

  if (!tracks.length) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>No tracks found.</h2>
        <button
          onClick={() => navigate('/music')}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#4F46E5',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h1>🎶 Search Results</h1>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        {tracks.map((track) => {
          const isCurrent = currentTrack?.id === track.id && isPlaying;
          const isFavorite = favorites.has(track.id);

          return (
            <div
              key={track.id}
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                backgroundColor: isCurrent ? '#e0e7ff' : 'white',
                userSelect: 'none',
              }}
            >
              {/* Clicking image or info plays track */}
              <div
                onClick={() => playTrack(track)}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    playTrack(track);
                  }
                }}
                role="button"
                aria-label={`Play ${track.name} by ${track.artists.map(a => a.name).join(', ')}`}
              >
                {track.album?.images?.[0]?.url && (
                  <img
                    src={track.album.images[0].url}
                    alt={track.name}
                    style={{ width: 64, height: 64, borderRadius: '8px' }}
                  />
                )}
                <div>
                  <strong>{track.name}</strong>
                  <br />
                  <em>{track.artists.map((a) => a.name).join(', ')}</em>
                  <br />
                  <small>{track.album?.name}</small>
                </div>
              </div>

              {/* Play/Pause indicator */}
              <div style={{ fontWeight: 'bold', color: '#4F46E5', minWidth: '70px', textAlign: 'center' }}>
                {isCurrent ? '▶️ Playing' : '▶️ Play'}
              </div>

              {/* Favorite toggle button */}
              <button
                onClick={() => toggleFavorite(track.id)}
                disabled={loadingFav}
                aria-pressed={isFavorite}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                style={{
                  backgroundColor: isFavorite ? '#dc2626' : '#9ca3af',
                  border: 'none',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: loadingFav ? 'not-allowed' : 'pointer',
                  userSelect: 'none',
                  fontWeight: 'bold',
                }}
              >
                {isFavorite ? '♥ Remove' : '♡ Add'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MusicListPage;
