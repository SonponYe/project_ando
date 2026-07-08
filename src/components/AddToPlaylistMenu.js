import React, { useContext, useState, useEffect, useRef } from 'react';
import { LuListPlus, LuCheck, LuPlus } from 'react-icons/lu';
import { PlaylistsContext } from '../context/PlaylistsContext';

const AddToPlaylistMenu = ({ track }) => {
  const {
    playlists, createPlaylist, addTrackToPlaylist,
    removeTrackFromPlaylist, isTrackInPlaylist,
  } = useContext(PlaylistsContext);

  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const toggle = (playlistId) => {
    if (isTrackInPlaylist(playlistId, track.id)) removeTrackFromPlaylist(playlistId, track.id);
    else addTrackToPlaylist(playlistId, track);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const id = createPlaylist(newName);
    addTrackToPlaylist(id, track);
    setNewName('');
  };

  return (
    <div ref={menuRef} style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
      <button
        className={`icon-btn${open ? ' icon-btn--active' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Add to playlist"
        aria-expanded={open}
      >
        <LuListPlus size={14} />
      </button>

      {open && (
        <div style={popoverStyle}>
          {playlists.length === 0 && (
            <p style={{ fontSize: '0.78rem', color: '#4a4a4a', padding: '0.35rem 0.25rem 0.6rem' }}>
              No playlists yet
            </p>
          )}

          {playlists.length > 0 && (
            <div style={{ maxHeight: 160, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {playlists.map((p) => {
                const inPlaylist = isTrackInPlaylist(p.id, track.id);
                return (
                  <button key={p.id} onClick={() => toggle(p.id)} style={popoverItemStyle}>
                    <span style={{ ...checkboxStyle, ...(inPlaylist ? checkboxCheckedStyle : {}) }}>
                      {inPlaylist && <LuCheck size={10} color="#0a0a0a" />}
                    </span>
                    <span style={{
                      flex: 1, textAlign: 'left',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {p.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <form
            onSubmit={handleCreate}
            style={{
              display: 'flex', gap: 6,
              marginTop: playlists.length ? 8 : 0,
              borderTop: playlists.length ? '1px solid #232323' : 'none',
              paddingTop: playlists.length ? 8 : 0,
            }}
          >
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New playlist"
              style={miniInputStyle}
              onClick={(e) => e.stopPropagation()}
            />
            <button type="submit" style={miniAddBtnStyle} aria-label="Create playlist">
              <LuPlus size={13} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const popoverStyle = {
  position: 'absolute',
  top: 'calc(100% + 6px)',
  right: 0,
  width: 200,
  background: '#141414',
  border: '1px solid #262626',
  borderRadius: 12,
  padding: '0.6rem',
  boxShadow: '0 12px 32px rgba(0,0,0,0.55)',
  zIndex: 50,
};

const popoverItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  width: '100%',
  background: 'none',
  border: 'none',
  color: '#d0d0d0',
  fontSize: '0.82rem',
  padding: '0.4rem 0.3rem',
  borderRadius: 6,
  cursor: 'pointer',
  textAlign: 'left',
};

const checkboxStyle = {
  width: 15,
  height: 15,
  borderRadius: 4,
  border: '1.5px solid #3a3a3a',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const checkboxCheckedStyle = {
  background: '#e14b3f',
  borderColor: '#e14b3f',
};

const miniInputStyle = {
  flex: 1,
  background: '#0d0d0d',
  border: '1px solid #262626',
  borderRadius: 7,
  padding: '0.4rem 0.5rem',
  fontSize: '0.78rem',
  color: '#e8e8e8',
  minWidth: 0,
};

const miniAddBtnStyle = {
  width: 28,
  height: 28,
  borderRadius: 7,
  border: 'none',
  background: '#242424',
  color: '#ccc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  flexShrink: 0,
};

export default AddToPlaylistMenu;
