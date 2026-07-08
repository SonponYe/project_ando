import React, { useContext, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { LuArrowLeft, LuPencil, LuX } from 'react-icons/lu';
import { PlaybackContext } from '../context/PlaybackContext';
import { PlaylistsContext } from '../context/PlaylistsContext';
import TrackRow from '../components/TrackRow';

const PlaylistDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTrack, isPlaying, playTrack, pauseTrack } = useContext(PlaybackContext);
  const { playlists, renamePlaylist, removeTrackFromPlaylist } = useContext(PlaylistsContext);

  const playlist = playlists.find((p) => p.id === id);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(playlist?.name || '');

  if (!playlist) return <Navigate to="/playlists" />;

  const handlePlay = (track) => {
    if (!track.preview_url) return;
    if (currentTrack?.id === track.id && isPlaying) pauseTrack();
    else playTrack(track, playlist.tracks);
  };

  const saveName = () => {
    renamePlaylist(playlist.id, name);
    setEditing(false);
  };

  return (
    <div className="page-wrap">
      <button
        onClick={() => navigate('/playlists')}
        className="btn-ghost"
        style={{ marginBottom: '1.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
      >
        <LuArrowLeft size={14} style={{ marginRight: 6 }} />
        All Playlists
      </button>

      <div style={{ marginBottom: '2rem' }}>
        {editing ? (
          <input
            autoFocus
            className="search-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => e.key === 'Enter' && saveName()}
            style={{ fontSize: '1.4rem', fontWeight: 800, padding: '0.5rem 0.75rem', marginBottom: '0.2rem' }}
          />
        ) : (
          <h1
            onClick={() => setEditing(true)}
            style={{
              fontSize: '1.75rem', fontWeight: 800, color: '#efefef',
              letterSpacing: '-0.5px', marginBottom: '0.2rem',
              display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer',
            }}
          >
            {playlist.name}
            <LuPencil size={14} color="#3a3a3a" />
          </h1>
        )}
        <p style={{ color: '#383838', fontSize: '0.82rem' }}>
          {playlist.tracks.length} track{playlist.tracks.length !== 1 ? 's' : ''}
        </p>
      </div>

      {playlist.tracks.length === 0 ? (
        <div className="state-center">
          <p>This playlist is empty</p>
          <p>Add tracks from Discover or Favorites</p>
        </div>
      ) : (
        playlist.tracks.map((track) => {
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
                onClick={(e) => { e.stopPropagation(); removeTrackFromPlaylist(playlist.id, track.id); }}
                aria-label={`Remove ${track.name} from playlist`}
                title="Remove"
              >
                <LuX size={14} />
              </button>
            </TrackRow>
          );
        })
      )}
    </div>
  );
};

export default PlaylistDetailPage;
