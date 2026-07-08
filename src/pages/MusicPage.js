import React, { useState, useContext } from 'react';
import { LuHeart, LuSearch } from 'react-icons/lu';
import * as jamendo from '../api/jamendo/api';
import * as audius from '../api/audius/api';
import { PlaybackContext } from '../context/PlaybackContext';
import { FavoritesContext } from '../context/FavoritesContext';
import TrackRow from '../components/TrackRow';
import AddToPlaylistMenu from '../components/AddToPlaylistMenu';
import mark from '../images/ando-mark.png';

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

// Alternate results from two sources so neither catalog dominates the list
const interleave = (a, b) => {
  const out = [];
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i++) {
    if (a[i]) out.push(a[i]);
    if (b[i]) out.push(b[i]);
  }
  return out;
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

  const runSearch = async (jamendoResults, audiusQuery) => {
    setLoading(true);
    setHasSearched(true);
    const [jamendoTracks, audiusTracks] = await Promise.all([
      jamendoResults,
      audius.searchTracks(audiusQuery),
    ]);
    setTracks(interleave(jamendoTracks, audiusTracks));
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    runSearch(jamendo.searchTracks(query), query);
  };

  const handleExplore = () => {
    const tags = [MOOD_TAGS[selectedMood], GENRE_TAGS[selectedGenre]].filter(Boolean);
    const plainQuery = [selectedMood, selectedGenre].filter(Boolean).join(' ');
    if (!tags.length) return;
    runSearch(jamendo.browseByTags(tags), plainQuery);
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
          <img
            src={mark}
            alt=""
            aria-hidden="true"
            style={{ width: 40, height: 40, opacity: 0.35, filter: 'grayscale(1)', marginBottom: '0.5rem' }}
          />
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
              <TrackRow
                key={track.id}
                track={track}
                isCurrent={isCurrent}
                isCurrentlyPlaying={isCurrentlyPlaying}
                onPlay={() => handlePlay(track)}
              >
                <button
                  className={`icon-btn${favorited ? ' icon-btn--active' : ''}`}
                  onClick={e => { e.stopPropagation(); toggleFavorite(track); }}
                  aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                  aria-pressed={favorited}
                >
                  <LuHeart size={14} style={{ fill: favorited ? 'currentColor' : 'none' }} />
                </button>
                <AddToPlaylistMenu track={track} />
              </TrackRow>
            );
          })}
        </>
      )}
    </div>
  );
};

export default MusicPage;
