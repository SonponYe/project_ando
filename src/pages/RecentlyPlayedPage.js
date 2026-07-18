import React, { useContext } from 'react';
import { LuHeart, LuTrash2 } from 'react-icons/lu';
import { PlaybackContext } from '../context/PlaybackContext';
import { FavoritesContext } from '../context/FavoritesContext';
import TrackRow from '../components/TrackRow';
import PageHeader from '../components/PageHeader';
import AddToPlaylistMenu from '../components/AddToPlaylistMenu';

const RecentlyPlayedPage = () => {
  const {
    currentTrack, isPlaying, playTrack, pauseTrack,
    recentlyPlayed, clearRecentlyPlayed,
  } = useContext(PlaybackContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);

  const handlePlay = (track) => {
    if (!track.preview_url) return;
    if (currentTrack?.id === track.id && isPlaying) pauseTrack();
    else playTrack(track, recentlyPlayed);
  };

  return (
    <div className="page-wrap">
      <PageHeader
        title="Recently Played"
        subtitle={recentlyPlayed.length > 0
          ? `Last ${recentlyPlayed.length} track${recentlyPlayed.length !== 1 ? 's' : ''}`
          : 'Tracks you play will show up here'}
        action={recentlyPlayed.length > 0 && (
          <button
            className="btn-ghost"
            onClick={clearRecentlyPlayed}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
          >
            <LuTrash2 size={13} style={{ marginRight: 6 }} />
            Clear
          </button>
        )}
      />

      {recentlyPlayed.length === 0 ? (
        <div className="state-center">
          <p>No history yet</p>
          <p>Play something from Discover to start building this list</p>
        </div>
      ) : (
        recentlyPlayed.map((track) => {
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
                onClick={(e) => { e.stopPropagation(); toggleFavorite(track); }}
                aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                aria-pressed={favorited}
              >
                <LuHeart size={14} style={{ fill: favorited ? 'currentColor' : 'none' }} />
              </button>
              <AddToPlaylistMenu track={track} />
            </TrackRow>
          );
        })
      )}
    </div>
  );
};

export default RecentlyPlayedPage;
