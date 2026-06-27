import React, { useEffect, useState, useContext } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { fetchUserProfile, fetchRecentlyPlayed } from '../api/spotify/api';
import { PlaybackContext } from '../context/PlaybackContext';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [recentTracks, setRecentTracks] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  const { currentTrack, isPlaying, playTrack, pauseTrack } = useContext(PlaybackContext);

  useEffect(() => {
    fetchUserProfile()
      .then(data => { setProfile(data); setLoadingProfile(false); })
      .catch(() => setLoadingProfile(false));

    fetchRecentlyPlayed()
      .then(data => { setRecentTracks(data.items || []); setLoadingRecent(false); })
      .catch(() => setLoadingRecent(false));
  }, []);

  const handleTrackPlay = (track) => {
    if (!track.preview_url) return;
    if (currentTrack?.id === track.id && isPlaying) {
      pauseTrack();
    } else {
      playTrack(track);
    }
  };

  if (loadingProfile) {
    return (
      <div className="page-wrap">
        <div className="state-center">
          <p>Loading profile</p>
          <p>Connecting to Spotify...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page-wrap">
        <div className="state-center">
          <p>Could not load profile</p>
          <p>Check your connection and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      {/* Profile card */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        marginBottom: '2.5rem',
        padding: '1.5rem',
        background: '#111111',
        borderRadius: 14,
        border: '1px solid #1c1c1c',
      }}>
        {profile.images?.[0]?.url ? (
          <img
            src={profile.images[0].url}
            alt={profile.display_name}
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0,
              border: '2px solid #2a2a2a',
            }}
          />
        ) : (
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: '#1c1c1c',
            border: '2px solid #2a2a2a',
            flexShrink: 0,
          }} />
        )}

        <div style={{ minWidth: 0 }}>
          <h1 style={{
            fontSize: '1.3rem',
            fontWeight: 700,
            color: '#f0f0f0',
            letterSpacing: '-0.3px',
            marginBottom: '0.5rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {profile.display_name || 'Spotify User'}
          </h1>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Followers', value: profile.followers?.total ?? 0 },
              { label: 'Country', value: profile.country || 'N/A' },
              { label: 'Plan', value: profile.product || 'N/A' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: '0.7rem', color: '#444', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  {label}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: 2, textTransform: 'capitalize' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recently played */}
      <div>
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

        {!loadingRecent && recentTracks.length > 0 && (
          <div>
            {recentTracks.map(({ track }, index) => {
              if (!track?.id) return null;
              const isCurrent = currentTrack?.id === track.id;
              const isCurrentlyPlaying = isCurrent && isPlaying;

              return (
                <div
                  key={`${track.id}-${index}`}
                  className={`track-row${isCurrent ? ' track-row--active' : ''}`}
                  onClick={() => handleTrackPlay(track)}
                >
                  {track.album?.images?.[0]?.url ? (
                    <img
                      src={track.album.images[0].url}
                      alt={track.name}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        objectFit: 'cover',
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      background: '#1a1a1a',
                      flexShrink: 0,
                    }} />
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: isCurrent ? '#f5f5f5' : '#d4d4d4',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.3,
                    }}>
                      {track.name}
                    </div>
                    <div style={{
                      fontSize: '0.78rem',
                      color: '#555',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      marginTop: 2,
                    }}>
                      {track.artists?.map(a => a.name).join(', ')}
                    </div>
                  </div>

                  <button
                    className="row-play-btn"
                    onClick={e => { e.stopPropagation(); handleTrackPlay(track); }}
                    disabled={!track.preview_url}
                    aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
                    style={{ opacity: isCurrent ? 1 : undefined }}
                  >
                    {isCurrentlyPlaying
                      ? <FaPause size={11} />
                      : <FaPlay size={11} style={{ marginLeft: 1 }} />
                    }
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
