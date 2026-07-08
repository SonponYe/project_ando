import React, { useContext, useRef, useState } from 'react';
import { LuUpload, LuHeart, LuTrash2 } from 'react-icons/lu';
import { PlaybackContext } from '../context/PlaybackContext';
import { FavoritesContext } from '../context/FavoritesContext';
import { LocalLibraryContext } from '../context/LocalLibraryContext';
import TrackRow from '../components/TrackRow';
import AddToPlaylistMenu from '../components/AddToPlaylistMenu';

const LocalLibraryPage = () => {
  const { currentTrack, isPlaying, playTrack, pauseTrack } = useContext(PlaybackContext);
  const { toggleFavorite, isFavorite }                     = useContext(FavoritesContext);
  const { tracks, loading, importFiles, removeTrack }      = useContext(LocalLibraryContext);

  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);

  const handlePlay = (track) => {
    if (!track.preview_url) return;
    if (currentTrack?.id === track.id && isPlaying) pauseTrack();
    else playTrack(track, tracks);
  };

  const handleFilesSelected = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setImporting(true);
    await importFiles(files);
    setImporting(false);
    e.target.value = ''; // allow re-selecting the same file later
  };

  return (
    <div className="page-wrap">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#efefef', letterSpacing: '-0.5px', marginBottom: '0.2rem' }}>
          Local Files
        </h1>
        <p style={{ color: '#383838', fontSize: '0.82rem' }}>
          {tracks.length > 0
            ? `${tracks.length} imported track${tracks.length !== 1 ? 's' : ''} · stored on this device`
            : 'Import audio files from this device'}
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        onChange={handleFilesSelected}
        style={{ display: 'none' }}
      />
      <button
        className="btn-primary"
        onClick={() => fileInputRef.current?.click()}
        disabled={importing}
        style={{ width: '100%', marginBottom: '2rem' }}
      >
        <LuUpload size={15} style={{ marginRight: 6 }} />
        {importing ? 'Importing...' : 'Import Audio Files'}
      </button>

      {loading ? (
        <div className="state-center">
          <p>Loading your library...</p>
        </div>
      ) : tracks.length === 0 ? (
        <div className="state-center">
          <p>No local tracks yet</p>
          <p>Imported files stay on this device only — nothing is uploaded</p>
        </div>
      ) : (
        tracks.map((track) => {
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
              <button
                className="icon-btn"
                onClick={(e) => { e.stopPropagation(); removeTrack(track.id); }}
                aria-label={`Remove ${track.name} from local library`}
                title="Remove from device"
              >
                <LuTrash2 size={14} />
              </button>
            </TrackRow>
          );
        })
      )}
    </div>
  );
};

export default LocalLibraryPage;
