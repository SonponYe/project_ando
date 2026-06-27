import React, { useState, useContext } from 'react';
import { FaPlay, FaPause, FaHeart, FaRegHeart, FaSearch } from 'react-icons/fa';
import { searchTracks } from '../api/spotify/api';
import { isAuthenticated, initiateAuthFlow } from '../api/spotify/token';
import { PlaybackContext } from '../context/PlaybackContext';
import { FavoritesContext } from '../context/FavoritesContext';

const MOODS = ['Happy', 'Chill', 'Energetic', 'Sad', 'Focus'];
const GENRES = ['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Afrobeats', 'Electronic'];

const MusicPage = () => {
  const [query, setQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { currentTrack, isPlaying, playTrack, pauseTrack } = useContext(PlaybackContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);

  const runSearch = async (q) => {
    if (!q.trim()) return;
    if (!isAuthenticated()) {
      await initiateAuthFlow();
      return;
    }
    setLoading(true);
    setHasSearched(true);
    const results = await searchTracks(q);
    setTracks(results);
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    runSearch(query);
  };

  const handleExplore = () => {
    const q = [selectedMood, selectedGenre].filter(Boolean).join(' ');
    runSearch(q);
  };

  const handleTrackPlay = (track) => {
    if (!track.preview_url) return;
    if (currentTrack?.id === track.id && isPlaying) {
      pauseTrack();
    } else {
      playTrack(track);
    }
  };

  const canExplore = selectedMood || selectedGenre;

  return (
    <div className="page-wrap">
      {/* Heading */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: '#f0f0f0',
          letterSpacing: '-0.5px',
          marginBottom: '0.25rem',
        }}>
          Discover
        </h1>
        <p style={{ color: '#444', fontSize: '0.85rem' }}>
          Search or pick a mood and genre
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '1.75rem' }}>
        <FaSearch style={{
          position: 'absolute',
          left: '0.9rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#444',
          fontSize: '0.8rem',
          pointerEvents: 'none',
        }} />
        <input
          className="search-input"
          type="text"
          placeholder="Artists, songs, albums..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </form>

      {/* Mood chips */}
      <div style={{ marginBottom: '1.25rem' }}>
        <p className="section-label">Mood</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {MOODS.map(mood => (
            <button
              key={mood}
              className={`chip${selectedMood === mood ? ' chip--active' : ''}`}
              onClick={() => setSelectedMood(selectedMood === mood ? '' : mood)}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Genre chips */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p className="section-label">Genre</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {GENRES.map(genre => (
            <button
              key={genre}
              className={`chip${selectedGenre === genre ? ' chip--active' : ''}`}
              onClick={() => setSelectedGenre(selectedGenre === genre ? '' : genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Explore CTA */}
      {canExplore && (
        <button
          className="btn-primary"
          onClick={handleExplore}
          disabled={loading}
          style={{ width: '100%', marginBottom: '2rem' }}
        >
          {loading ? 'Searching...' : 'Explore'}
        </button>
      )}

      {/* States */}
      {loading && (
        <div className="state-center">
          <p>Finding tracks</p>
          <p>Just a moment...</p>
        </div>
      )}

      {!loading && !hasSearched && (
        <div className="state-center">
          <p>Search for something</p>
          <p>Use the bar above or pick a mood and genre</p>
        </div>
      )}

      {!loading && hasSearched && tracks.length === 0 && (
        <div className="state-center">
          <p>No tracks found</p>
          <p>Try a different search or filter</p>
        </div>
      )}

      {/* Track list */}
      {!loading && tracks.length > 0 && (
        <div>
          <p className="section-label" style={{ marginBottom: '0.75rem' }}>
            {tracks.length} tracks
          </p>
          <div>
            {tracks.map((track) => {
              const isCurrent = currentTrack?.id === track.id;
              const isCurrentlyPlaying = isCurrent && isPlaying;
              const favorited = isFavorite(track.id);

              return (
                <div
                  key={track.id}
                  className={`track-row${isCurrent ? ' track-row--active' : ''}`}
                  onClick={() => handleTrackPlay(track)}
                >
                  {/* Album art */}
                  {track.album?.images?.[0]?.url ? (
                    <img
                      src={track.album.images[0].url}
                      alt={track.name}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        objectFit: 'cover',
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      background: '#1a1a1a',
                      flexShrink: 0,
                    }} />
                  )}

                  {/* Track info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: isCurrent ? '#f5f5f5' : '#d4d4d4',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.3,
                    }}>
                      {track.name}
                    </div>
                    <div style={{
                      fontSize: '0.78rem',
                      color: '#555',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      marginTop: 2,
                    }}>
                      {track.artists?.map(a => a.name).join(', ')}
                      {track.album?.name && (
                        <span style={{ color: '#3a3a3a' }}> · {track.album.name}</span>
                      )}
                    </div>
                  </div>

                  {/* Favorite button */}
                  <button
                    className={`icon-btn${favorited ? ' icon-btn--active' : ''}`}
                    onClick={e => { e.stopPropagation(); toggleFavorite(track); }}
                    aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                    aria-pressed={favorited}
                  >
                    {favorited ? <FaHeart size={13} /> : <FaRegHeart size={13} />}
                  </button>

                  {/* Play/pause button */}
                  <button
                    className="row-play-btn"
                    onClick={e => { e.stopPropagation(); handleTrackPlay(track); }}
                    disabled={!track.preview_url}
                    aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
                    style={{ opacity: isCurrent ? 1 : undefined }}
                  >
                    {isCurrentlyPlaying
                      ? <FaPause size={11} />
                      : <FaPlay size={11} style={{ marginLeft: 1 }} />
                    }
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPage;
