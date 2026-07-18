import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPlus, LuTrash2, LuListMusic } from 'react-icons/lu';
import { PlaylistsContext } from '../context/PlaylistsContext';
import PageHeader from '../components/PageHeader';

const PlaylistsPage = () => {
  const { playlists, createPlaylist, deletePlaylist } = useContext(PlaylistsContext);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const id = createPlaylist(name);
    setName('');
    navigate(`/playlists/${id}`);
  };

  const handleDelete = (e, id, playlistName) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${playlistName}"? This can't be undone.`)) {
      deletePlaylist(id);
    }
  };

  return (
    <div className="page-wrap">
      <PageHeader
        title="Playlists"
        subtitle={playlists.length > 0
          ? `${playlists.length} playlist${playlists.length !== 1 ? 's' : ''}`
          : 'Create your first playlist'}
      />

      <form onSubmit={handleCreate} style={{ display: 'flex', gap: '0.6rem', marginBottom: '2rem' }}>
        <input
          className="search-input"
          type="text"
          placeholder="New playlist name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ paddingLeft: '1.1rem' }}
        />
        <button type="submit" className="btn-primary" disabled={!name.trim()} style={{ flexShrink: 0 }}>
          <LuPlus size={15} style={{ marginRight: 6 }} />
          Create
        </button>
      </form>

      {playlists.length === 0 ? (
        <div className="state-center">
          <p>No playlists yet</p>
          <p>Give one a name above to get started</p>
        </div>
      ) : (
        playlists.map((p) => (
          <div
            key={p.id}
            className="track-row"
            onClick={() => navigate(`/playlists/${p.id}`)}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 8, background: '#191919',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, overflow: 'hidden',
            }}>
              {p.tracks[0]?.album?.images?.[0]?.url ? (
                <img src={p.tracks[0].album.images[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <LuListMusic size={18} color="#3a3a3a" />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.9rem', fontWeight: 600, color: '#d8d8d8',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {p.name}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#444', marginTop: 2 }}>
                {p.tracks.length} track{p.tracks.length !== 1 ? 's' : ''}
              </div>
            </div>

            <button
              className="icon-btn"
              onClick={(e) => handleDelete(e, p.id, p.name)}
              aria-label={`Delete ${p.name}`}
            >
              <LuTrash2 size={14} />
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default PlaylistsPage;
