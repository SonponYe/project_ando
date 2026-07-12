import React, { useContext, useMemo, useState, useEffect } from 'react';
import { LuHeart, LuTrash2 } from 'react-icons/lu';
import { PlaybackContext } from '../context/PlaybackContext';
import { FavoritesContext } from '../context/FavoritesContext';
import TrackRow from '../components/TrackRow';
import AddToPlaylistMenu from '../components/AddToPlaylistMenu';
import { computeStats, eventToTrack } from '../lib/stats';
import { rehydrateLocalTrack } from '../api/local/db';

// One playable top-track entry: the logged event rebuilt into a track object,
// with local-file tracks' blob URLs refreshed from IndexedDB (kept visible
// but unplayable if the file was removed from the local library).
const useTopTracks = (topTracks) => {
  const [resolved, setResolved] = useState([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const tracks = await Promise.all(
        topTracks.map(async ({ event, count }) => {
          const base = eventToTrack(event);
          const fresh = await rehydrateLocalTrack(base);
          return { track: fresh || { ...base, preview_url: null }, count };
        }),
      );
      if (!cancelled) setResolved(tracks);
    })();
    return () => { cancelled = true; };
  }, [topTracks]);
  return resolved;
};

const StatsPage = () => {
  const {
    currentTrack, isPlaying, playTrack, pauseTrack,
    playLog, clearPlayLog,
  } = useContext(PlaybackContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);

  const stats = useMemo(() => computeStats(playLog), [playLog]);
  const topTracks = useTopTracks(stats.topTracks);
  const maxDay = Math.max(...stats.daily.map((d) => d.count), 1);
  const maxArtist = stats.topArtists[0]?.count || 1;
  const todayIdx = stats.daily.length - 1;

  const handlePlay = (track) => {
    if (!track.preview_url) return;
    if (currentTrack?.id === track.id && isPlaying) pauseTrack();
    else playTrack(track, topTracks.map((t) => t.track));
  };

  return (
    <div className="page-wrap">
      {/* heading */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: '2rem', gap: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#efefef', letterSpacing: '-0.5px', marginBottom: '0.2rem' }}>
            Your Stats
          </h1>
          <p style={{ color: '#383838', fontSize: '0.82rem' }}>
            {stats.totalPlays > 0
              ? `Based on ${stats.totalPlays} play${stats.totalPlays !== 1 ? 's' : ''}`
              : 'Your listening habits, once you start playing'}
          </p>
        </div>
        {stats.totalPlays > 0 && (
          <button
            className="btn-ghost"
            onClick={clearPlayLog}
            style={{ flexShrink: 0, padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
          >
            <LuTrash2 size={13} style={{ marginRight: 6 }} />
            Reset
          </button>
        )}
      </div>

      {stats.totalPlays === 0 ? (
        <div className="state-center">
          <p>Nothing to count yet</p>
          <p>Play some tracks and your stats will build up here</p>
        </div>
      ) : (
        <>
          {/* stat tiles */}
          <div className="stat-grid" style={{ marginBottom: '2rem' }}>
            <div className="stat-tile">
              <div className="stat-tile__value">{stats.playsThisWeek}</div>
              <div className="stat-tile__label">Plays this week</div>
            </div>
            <div className="stat-tile">
              <div className="stat-tile__value">{stats.totalPlays}</div>
              <div className="stat-tile__label">All-time plays</div>
            </div>
            <div className="stat-tile">
              <div className="stat-tile__value">{stats.uniqueArtists}</div>
              <div className="stat-tile__label">Artists explored</div>
            </div>
            <div className="stat-tile">
              <div className="stat-tile__value">{stats.streak}</div>
              <div className="stat-tile__label">Day streak</div>
            </div>
          </div>

          {/* last 7 days activity */}
          <section style={{ marginBottom: '2.25rem' }}>
            <p className="section-label">This week's activity</p>
            <div
              className="week-chart"
              role="img"
              aria-label={`Plays per day, last 7 days: ${stats.daily.map((d) => `${d.label} ${d.count}`).join(', ')}`}
            >
              {stats.daily.map((day, i) => (
                <div
                  key={day.date.getTime()}
                  className={`week-chart__col${i === todayIdx ? ' week-chart__col--today' : ''}`}
                >
                  <span className="week-chart__value">{day.count}</span>
                  <div
                    className="week-chart__bar"
                    style={{ height: `${(day.count / maxDay) * 100}%` }}
                  />
                  <span className="week-chart__label">{i === todayIdx ? 'Today' : day.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* top tracks */}
          {topTracks.length > 0 && (
            <section style={{ marginBottom: '2.25rem' }}>
              <p className="section-label" style={{ marginBottom: '0.75rem' }}>Most played tracks</p>
              {topTracks.map(({ track, count }) => {
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
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 600, color: '#555',
                      flexShrink: 0, whiteSpace: 'nowrap',
                    }}>
                      {count} play{count !== 1 ? 's' : ''}
                    </span>
                    <button
                      className={`icon-btn${favorited ? ' icon-btn--active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(track); }}
                      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                      aria-pressed={favorited}
                    >
                      <LuHeart size={14} style={{ fill: favorited ? 'currentColor' : 'none' }} />
                    </button>
                    <AddToPlaylistMenu track={track} />
                  </TrackRow>
                );
              })}
            </section>
          )}

          {/* top artists */}
          {stats.topArtists.length > 0 && (
            <section>
              <p className="section-label" style={{ marginBottom: '0.75rem' }}>Top artists</p>
              {stats.topArtists.map(({ event, count }, i) => (
                <div key={event.artist} className="rank-row">
                  <span className="rank-row__num">{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', gap: '0.75rem',
                      fontSize: '0.85rem',
                    }}>
                      <span style={{
                        fontWeight: 600, color: '#c8c8c8',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {event.artist}
                      </span>
                      <span style={{ color: '#555', fontSize: '0.75rem', flexShrink: 0 }}>
                        {count} play{count !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="rank-row__bar-track">
                      <div
                        className="rank-row__bar"
                        style={{ width: `${(count / maxArtist) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default StatsPage;
