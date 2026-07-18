import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LuHeart, LuSearch, LuArrowLeft } from 'react-icons/lu';
import * as jamendo from '../api/jamendo/api';
import * as audius from '../api/audius/api';
import { PlaybackContext } from '../context/PlaybackContext';
import { FavoritesContext } from '../context/FavoritesContext';
import TrackRow from '../components/TrackRow';
import TrackCard from '../components/TrackCard';
import PageHeader from '../components/PageHeader';
import AddToPlaylistMenu from '../components/AddToPlaylistMenu';
import { computeStats } from '../lib/stats';

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

const RAIL_SIZE = 14;

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

const dedupeById = (tracks) => {
  const seen = new Set();
  return tracks.filter((t) => (seen.has(t.id) ? false : seen.add(t.id)));
};

// Section wrapper for a horizontally scrolling row of cards
const Rail = ({ title, action, children }) => (
  <section style={{ marginBottom: '1.75rem' }}>
    <div className="rail-head">
      <h2>{title}</h2>
      {action}
    </div>
    <div className="rail">{children}</div>
  </section>
);

const RailSkeleton = () => (
  <>
    {Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="track-card track-card--skel" aria-hidden="true">
        <div className="track-card__art" />
        <div className="skel-line" />
        <div className="skel-line" />
      </div>
    ))}
  </>
);

const MusicPage = () => {
  const [query,         setQuery]         = useState('');
  const [selectedMood,  setSelectedMood]  = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [tracks,        setTracks]        = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [hasSearched,   setHasSearched]   = useState(false);
  const [trending,      setTrending]      = useState(null); // null = still loading
  const [madeForYou,    setMadeForYou]    = useState(null);

  const {
    currentTrack, isPlaying, playTrack, pauseTrack,
    recentlyPlayed, playLog,
  } = useContext(PlaybackContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);

  const stats = useMemo(() => computeStats(playLog), [playLog]);

  // Trending rail: both sources' weekly charts, interleaved
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [jam, aud] = await Promise.all([
        jamendo.getPopularTracks(),
        audius.getTrendingTracks(),
      ]);
      if (!cancelled) setTrending(dedupeById(interleave(jam, aud)).slice(0, RAIL_SIZE));
    })();
    return () => { cancelled = true; };
  }, []);

  // "Made for you" rail: more tracks from the user's most-played artists.
  // Seeded once per visit (not on every play) so the rail doesn't reshuffle
  // under the user mid-session.
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    const topArtists = computeStats(playLog, { topCount: 2 }).topArtists;
    if (!topArtists.length) {
      setMadeForYou([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const playedIds = new Set(playLog.map((ev) => ev.id));
      const results = await Promise.all(
        topArtists.flatMap(({ event }) => [
          jamendo.searchTracks(event.artist),
          audius.searchTracks(event.artist),
        ]),
      );
      const merged = dedupeById(results.reduce(interleave, []))
        .filter((t) => !playedIds.has(t.id)) // keep it fresh — skip what they've already heard
        .slice(0, RAIL_SIZE);
      if (!cancelled) setMadeForYou(merged);
    })();
    return () => { cancelled = true; };
  }, [playLog]);

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

  const backToHome = () => {
    setHasSearched(false);
    setTracks([]);
    setQuery('');
    setSelectedMood('');
    setSelectedGenre('');
  };

  // Play a track with `list` as the queue; tapping the playing track pauses it
  const handlePlay = (track, list) => {
    if (!track.preview_url) return;
    if (currentTrack?.id === track.id && isPlaying) pauseTrack();
    else playTrack(track, list);
  };

  const renderCards = (list) => list.map((track) => (
    <TrackCard
      key={track.id}
      track={track}
      isCurrent={currentTrack?.id === track.id}
      isCurrentlyPlaying={currentTrack?.id === track.id && isPlaying}
      onPlay={() => handlePlay(track, list)}
    />
  ));

  return (
    <div className="page-wrap">
      <PageHeader title="Discover" subtitle="Search or pick a mood and genre" />

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

      {/* ── Home sections (shown until a search happens) ── */}
      {!hasSearched && (
        <>
          {/* listening stats strip */}
          {stats.totalPlays > 0 && (
            <section style={{ marginBottom: '1.75rem' }}>
              <div className="rail-head">
                <h2>Your listening</h2>
                <Link to="/stats">See all stats →</Link>
              </div>
              <div className="stat-grid">
                <div className="stat-tile">
                  <div className="stat-tile__value">{stats.playsThisWeek}</div>
                  <div className="stat-tile__label">Plays this week</div>
                </div>
                <div className="stat-tile">
                  <div className="stat-tile__value">
                    {stats.streak} day{stats.streak !== 1 ? 's' : ''}
                  </div>
                  <div className="stat-tile__label">Listening streak</div>
                </div>
                <div className="stat-tile">
                  <div className="stat-tile__value">
                    {stats.topArtists[0]?.event.artist || '—'}
                  </div>
                  <div className="stat-tile__label">Top artist</div>
                </div>
              </div>
            </section>
          )}

          {/* jump back in */}
          {recentlyPlayed.length > 0 && (
            <Rail
              title="Jump back in"
              action={<Link to="/recent">See all →</Link>}
            >
              {renderCards(recentlyPlayed.slice(0, RAIL_SIZE))}
            </Rail>
          )}

          {/* made for you — seeded from most-played artists */}
          {(madeForYou === null || madeForYou.length > 0) && stats.totalPlays > 0 && (
            <Rail title="Made for you">
              {madeForYou === null ? <RailSkeleton /> : renderCards(madeForYou)}
            </Rail>
          )}

          {/* trending */}
          {(trending === null || trending.length > 0) && (
            <Rail title="Trending now">
              {trending === null ? <RailSkeleton /> : renderCards(trending)}
            </Rail>
          )}
        </>
      )}

      {/* ── Search states ── */}
      {loading && (
        <div className="state-center">
          <p>Finding tracks</p>
          <p>Just a moment...</p>
        </div>
      )}
      {!loading && hasSearched && tracks.length === 0 && (
        <div className="state-center">
          <p>No tracks found</p>
          <p>Try a different search or filter</p>
        </div>
      )}

      {/* search results */}
      {!loading && hasSearched && tracks.length > 0 && (
        <>
          <div className="rail-head" style={{ marginBottom: '0.75rem' }}>
            <p className="section-label" style={{ marginBottom: 0 }}>{tracks.length} tracks</p>
            <button onClick={backToHome}>
              <LuArrowLeft size={11} style={{ marginRight: 4, verticalAlign: -1 }} />
              Back to home
            </button>
          </div>
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
                onPlay={() => handlePlay(track, tracks)}
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
