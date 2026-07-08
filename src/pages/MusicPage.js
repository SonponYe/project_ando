import React, { useState, useContext } from 'react';
import { LuPlay, LuPause, LuHeart, LuSearch } from 'react-icons/lu';
import { searchTracks, browseByTags } from '../api/jamendo/api';
import { PlaybackContext } from '../context/PlaybackContext';
import { FavoritesContext } from '../context/FavoritesContext';

const MOODS  = ['Happy', 'Chill', 'Energetic', 'Sad', 'Focus'];
const GENRES = ['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Afrobeats', 'Electronic'];

// Map ando's mood/genre labels to Jamendo's tag vocabulary
const MOOD_TAGS = {
  Happy: 'happy',
  Chill: 'chillout',
  Energetic: 'energetic',
  Sad: 'sad',
  Focus: 'instrumental',
};
const GENRE_TAGS = {
  Pop: 'pop',
  Rock: 'rock',
  'Hip-Hop': 'hiphop',
  Jazz: 'jazz',
  Afrobeats: 'afrobeat',
  Electronic: 'electronic',
};

const MusicPage = () => {
  const [query,         setQuery]         = useState('');
  const [selectedMood,  setSelectedMood]  = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [tracks,        setTracks]        = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [hasSearched,   setHasSearched]   = useState(false);

  const { currentTrack, isPlaying, playTrack, pauseTrack } = useContext(PlaybackContext);
  const { toggleFavorite, isFavorite }                     = useContext(FavoritesContext);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setHasSearched(true);
    const results = await searchTracks(query);
    setTracks(results);
    setLoading(false);
  };

  const handleExplore = async () => {
    const tags = [MOOD_TAGS[selectedMood], GENRE_TAGS[selectedGenre]].filter(Boolean);
    if (!tags.length) return;
    setLoading(true);
    setHasSearched(true);
    const results = await browseByTags(tags);
    setTracks(results);
    setLoading(false);
  };

  const handlePlay = (track) => {
    if (!track.preview_url) return;
    if (currentTrack?.id === track.id && isPlaying) pauseTrack();
    else playTrack(track, tracks);
  };

  return (
    <div className="page-wrap">
      {/* heading */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#efefef', letterSpacing: '-0.5px', marginBottom: '0.2rem' }}>
          Discover
        </h1>
        <p style={{ color: '#383838', fontSize: '0.82rem' }}>Search or pick a mood and genre</p>
      </div>

      {/* search */}
      <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '1.75rem' }}>
        <LuSearch style={{
          position: 'absolute', left: '0.9rem', top: '50%',
          transform: 'translateY(-50%)', color: '#383838',
          fontSize: '0.9rem', pointerEvents: 'none',
        }} />
        <input
          className="search-input"
          type="text"
          placeholder="Artists, songs, albums..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </form>

      {/* mood chips */}
      <div style={{ marginBottom: '1.25rem' }}>
        <p className="section-label">Mood</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {MOODS.map(m => (
            <button key={m}
              className={`chip${selectedMood === m ? ' chip--active' : ''}`}
              onClick={() => setSelectedMood(selectedMood === m ? '' : m)}
            >{m}</button>
          ))}
        </div>
      </div>

      {/* genre chips */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p className="section-label">Genre</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {GENRES.map(g => (
            <button key={g}
              className={`chip${selectedGenre === g ? ' chip--active' : ''}`}
              onClick={() => setSelectedGenre(selectedGenre === g ? '' : g)}
            >{g}</button>
          ))}
        </div>
      </div>

      {/* explore CTA */}
      {(selectedMood || selectedGenre) && (
        <button
          className="btn-primary"
          onClick={handleExplore}
          disabled={loading}
          style={{ width: '100%', marginBottom: '2rem' }}
        >
          {loading ? 'Searching...' : 'Explore'}
        </button>
      )}

      {/* states */}
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

      {/* track list */}
      {!loading && tracks.length > 0 && (
        <>
          <p className="section-label" style={{ marginBottom: '0.75rem' }}>{tracks.length} tracks</p>
          {tracks.map((track) => {
            const isCurrent          = currentTrack?.id === track.id;
            const isCurrentlyPlaying = isCurrent && isPlaying;
            const favorited          = isFavorite(track.id);

            return (
              <div
                key={track.id}
                className={`track-row${isCurrent ? ' track-row--active' : ''}`}
                onClick={() => handlePlay(track)}
              >
                {track.album?.images?.[0]?.url ? (
                  <img src={track.album.images[0].url} alt={track.name}
                    style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 48, height: 48, borderRadius: 8, background: '#191919', flexShrink: 0 }} />
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    fontSize: '0.88rem', fontWeight: 600,
                    color: isCurrent ? '#efefef' : '#c8c8c8',
                    lineHeight: 1.3,
                  }}>
                    {isCurrentlyPlaying && (
                      <span className="eq-bars"><span /><span /><span /></span>
                    )}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {track.name}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.76rem', color: '#444',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2,
                  }}>
                    {track.artists?.map(a => a.name).join(', ')}
                    {track.album?.name && <span style={{ color: '#303030' }}> · {track.album.name}</span>}
                  </div>
                </div>

                <button
                  className={`icon-btn${favorited ? ' icon-btn--active' : ''}`}
                  onClick={e => { e.stopPropagation(); toggleFavorite(track); }}
                  aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                  aria-pressed={favorited}
                >
                  <LuHeart size={14} style={{ fill: favorited ? 'currentColor' : 'none' }} />
                </button>

                <button
                  className="row-play-btn"
                  onClick={e => { e.stopPropagation(); handlePlay(track); }}
                  disabled={!track.preview_url}
                  aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
                  style={{ opacity: isCurrent ? 1 : undefined }}
                >
                  {isCurrentlyPlaying
                    ? <LuPause size={12} />
                    : <LuPlay  size={12} style={{ marginLeft: 1 }} />
                  }
                </button>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default MusicPage;
