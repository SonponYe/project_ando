import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from '../api/spotify/api';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      const data = await fetchUserProfile();
      setProfile(data);
      setLoading(false);
    };
    getProfile();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading profile...</div>;

  if (!profile) return <div style={{ padding: '2rem' }}>Failed to load profile.</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
      {profile.images && profile.images.length > 0 && (
        <img
          src={profile.images[0].url}
          alt="Profile"
          style={{ width: 150, height: 150, borderRadius: '50%', marginBottom: '1rem' }}
        />
      )}
      <h1>{profile.display_name || 'Spotify User'}</h1>
      <p><strong>Email:</strong> {profile.email || 'Not available'}</p>
      <p><strong>Followers:</strong> {profile.followers?.total || 0}</p>
      <p><strong>Country:</strong> {profile.country || 'N/A'}</p>
      <p><strong>Product:</strong> {profile.product || 'N/A'}</p>
    </div>
  );
};

export default ProfilePage;
