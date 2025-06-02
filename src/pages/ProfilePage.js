import React, { useEffect, useState } from 'react';
import { fetchUserProfile, fetchRecentlyPlayed } from '../api/spotify/api';
import profile from './profile.css';
const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [recentTracks, setRecentTracks] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      const data = await fetchUserProfile();
      setProfile(data);
      setLoadingProfile(false);
    };

    const getRecentTracks = async () => {
      const data = await fetchRecentlyPlayed();
      setRecentTracks(data.items || []);
      setLoadingRecent(false);
    };

    getProfile();
    getRecentTracks();
  }, []);

  if (loadingProfile) return <div className="profile loading">Loading profile...</div>;

  if (!profile) return <div className="profile fail">Failed to load profile.</div>;

  return (
    <div className="whole profile">
      {/* Profile Picture */}
      {profile.images && profile.images.length > 0 && (
        <img
          src={profile.images[0].url}
          alt="Profile"
          className="profile image"
        />
      )}

      {/* User Info */}
      <h1 className="name">{profile.display_name || 'Spotify User'}</h1>
      <p className="email"><strong>Email:</strong> {profile.email || 'Not available'}</p>
      <p className="followers"><strong>Followers:</strong> {profile.followers?.total || 0}</p>
      <p className="country"><strong>Country:</strong> {profile.country || 'N/A'}</p>
      <p className="product"><strong>Product:</strong> {profile.product || 'N/A'}</p>

      {/* Social Buttons */}
      <div className="socials">
        <button className="f">Share on Facebook</button>
        <button className="t">Share on Twitter</button>
        <button className="i">Share on Instagram</button>
      </div>

      {/* Recently Played Tracks */}
      <section className="recent">
        <h2 className="">Recently Played Tracks</h2>
        {loadingRecent ? (
          <p className="no recent load">Loading recently played...</p>
        ) : recentTracks.length === 0 ? (
          <p className="no recent">No recently played tracks found.</p>
        ) : (
          <ul className="list">
            {recentTracks.map(({ track }) => (
              <li key={track.id} className="">
                {track.album?.images?.[0]?.url && (
                  <img
                    src={track.album.images[0].url}
                    alt={track.name}
                    className="recent image"
                  />
                )}
                <div className="recent name">
                  <p className="actual name">{track.name}</p>
                  <p className="track name">{track.artists.map((a) => a.name).join(', ')}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
