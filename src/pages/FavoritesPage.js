import React, { useContext } from 'react';
import { LuX } from 'react-icons/lu';
import { PlaybackContext } from '../context/PlaybackContext';
import { FavoritesContext } from '../context/FavoritesContext';
import TrackRow from '../components/TrackRow';
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
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#efefef', letterSpacing: '-0.5px', marginBottom: '0.2rem' }}>
          Favorites
        </h1>
        <p style={{ color: '#383838', fontSize: '0.82rem' }}>
          {favorites.length > 0
            ? `${favorites.length} saved track${favorites.length !== 1 ? 's' : ''}`
            : 'Your saved tracks'}
        </p>
      </div>

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
