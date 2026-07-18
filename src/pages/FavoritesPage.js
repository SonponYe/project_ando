import React, { useContext } from 'react';
import { LuX } from 'react-icons/lu';
import { PlaybackContext } from '../context/PlaybackContext';
import { FavoritesContext } from '../context/FavoritesContext';
import TrackRow from '../components/TrackRow';
import PageHeader from '../components/PageHeader';
import AddToPlaylistMenu from '../components/AddToPlaylistMenu';

const FavoritesPage = () => {
  const { currentTrack, isPlaying, playTrack, pauseTrack } = useContext(PlaybackContext);
  const { favorites, toggleFavorite }                      = useContext(FavoritesContext);

  const handlePlay = (track) => {
    if (!track.preview_url) return;
    if (currentTrack?.id === track.id && isPlaying) pauseTrack();
    else playTrack(track, favorites);
  };

  return (
    <div className="page-wrap">
      <PageHeader
        title="Favorites"
        subtitle={favorites.length > 0
          ? `${favorites.length} saved track${favorites.length !== 1 ? 's' : ''}`
          : 'Your saved tracks'}
      />

      {favorites.length === 0 ? (
        <div className="state-center">
          <p>No favorites yet</p>
          <p>Save tracks from the Discover page</p>
        </div>
      ) : (
        favorites.map((track) => {
          const isCurrent          = currentTrack?.id === track.id;
          const isCurrentlyPlaying = isCurrent && isPlaying;

          return (
            <TrackRow
              key={track.id}
              track={track}
              isCurrent={isCurrent}
              isCurrentlyPlaying={isCurrentlyPlaying}
              onPlay={() => handlePlay(track)}
            >
              <button
                className="icon-btn"
                onClick={e => { e.stopPropagation(); toggleFavorite(track); }}
                aria-label={`Remove ${track.name} from favorites`}
                title="Remove"
              >
                <LuX size={14} />
              </button>
              <AddToPlaylistMenu track={track} />
            </TrackRow>
          );
        })
      )}
    </div>
  );
};

export default FavoritesPage;
