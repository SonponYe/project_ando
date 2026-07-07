import React, { useEffect, useState, useContext } from 'react';
import { LuPlay, LuPause } from 'react-icons/lu';
import { fetchUserProfile, fetchRecentlyPlayed } from '../api/spotify/api';
import { PlaybackContext } from '../context/PlaybackContext';

const ProfilePage = () => {
  const [profile,        setProfile]        = useState(null);
  const [recentTracks,   setRecentTracks]   = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingRecent,  setLoadingRecent]  = useState(true);

  const { currentTrack, isPlaying, playTrack, pauseTrack } = useContext(PlaybackContext);

  useEffect(() => {
    fetchUserProfile()
      .then(data => { setProfile(data); setLoadingProfile(false); })
      .catch(()  => setLoadingProfile(false));

    fetchRecentlyPlayed()
      .then(data => { setRecentTracks(data.items || []); setLoadingRecent(false); })
      .catch(()  => setLoadingRecent(false));
  }, []);

  const handlePlay = (track) => {
    if (!track.preview_url) return;
    if (currentTrack?.id === track.id && isPlaying) pauseTrack();
    else playTrack(track);
  };

  if (loadingProfile) {
    return (
      <div className="page-wrap">
        <div className="state-center"><p>Loading profile</p><p>Connecting to Spotify...</p></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page-wrap">
        <div className="state-center"><p>Could not load profile</p><p>Check your connection and try again</p></div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      {/* profile card */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '1.25rem',
        marginBottom: '2.5rem', padding: '1.5rem',
        background: 'linear-gradient(135deg, #131313 0%, #0e0e0e 100%)',
        borderRadius: 14, border: '1px solid #1a1a1a',
      }}>
        {profile.images?.[0]?.url ? (
          <img
            src={profile.images[0].url}
            alt={profile.display_name}
            style={{ width: 68, height: 68, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #242424' }}
          />
        ) : (
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: '#1c1c1c', border: '2px solid #242424', flexShrink: 0 }} />
        )}

        <div style={{ minWidth: 0 }}>
          <h1 style={{
            fontSize: '1.25rem', fontWeight: 700, color: '#efefef',
            letterSpacing: '-0.3px', marginBottom: '0.5rem',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {profile.display_name || 'Spotify User'}
          </h1>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Followers', value: profile.followers?.total ?? 0 },
              { label: 'Country',   value: profile.country  || 'N/A' },
              { label: 'Plan',      value: profile.product  || 'N/A' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: '0.68rem', color: '#343434', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  {label}
                </div>
                <div style={{ fontSize: '0.84rem', color: '#888', marginTop: 2, textTransform: 'capitalize' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* recently played */}
      <p className="section-label" style={{ marginBottom: '0.75rem' }}>Recently Played</p>

      {loadingRecent && (
        <div className="state-center" style={{ padding: '2rem' }}>
          <p>Loading recent tracks...</p>
        </div>
      )}

      {!loadingRecent && recentTracks.length === 0 && (
        <div className="state-center" style={{ padding: '2rem' }}>
          <p>No recent tracks</p>
          <p>Start listening to see your history</p>
        </div>
      )}

      {!loadingRecent && recentTracks.map(({ track }, i) => {
        if (!track?.id) return null;
        const isCurrent          = currentTrack?.id === track.id;
        const isCurrentlyPlaying = isCurrent && isPlaying;

        return (
          <div
            key={`${track.id}-${i}`}
            className={`track-row${isCurrent ? ' track-row--active' : ''}`}
            onClick={() => handlePlay(track)}
          >
            {track.album?.images?.[0]?.url ? (
              <img src={track.album.images[0].url} alt={track.name}
                style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <div style={{ width: 48, height: 48, borderRadius: 8, background: '#191919', flexShrink: 0 }} />
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                fontSize: '0.88rem', fontWeight: 600,
                color: isCurrent ? '#efefef' : '#c8c8c8',
                lineHeight: 1.3,
              }}>
                {isCurrentlyPlaying && (
                  <span className="eq-bars"><span /><span /><span /></span>
                )}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {track.name}
                </span>
              </div>
              <div style={{
                fontSize: '0.76rem', color: '#444',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2,
              }}>
                {track.artists?.map(a => a.name).join(', ')}
              </div>
            </div>

            <button
              className="row-play-btn"
              onClick={e => { e.stopPropagation(); handlePlay(track); }}
              disabled={!track.preview_url}
              aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
              style={{ opacity: isCurrent ? 1 : undefined }}
            >
              {isCurrentlyPlaying
                ? <LuPause size={12} />
                : <LuPlay  size={12} style={{ marginLeft: 1 }} />
              }
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ProfilePage;
