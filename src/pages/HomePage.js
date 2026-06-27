import React from 'react';
import { initiateAuthFlow } from '../api/spotify/token';

const HomePage = () => {
  const handleLogin = async () => {
    await initiateAuthFlow();
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'radial-gradient(ellipse at 20% 30%, #1c1c1c 0%, #0a0a0a 55%, #060606 100%)',
    }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <p style={{
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: '#444',
          marginBottom: '1.25rem',
        }}>
          Music Discovery
        </p>

        <h1 style={{
          fontSize: 'clamp(2.25rem, 6vw, 3rem)',
          fontWeight: 800,
          color: '#f0f0f0',
          letterSpacing: '-1px',
          lineHeight: 1.1,
          marginBottom: '1rem',
        }}>
          Your sound,<br />your mood.
        </h1>

        <p style={{
          fontSize: '1rem',
          color: '#666',
          lineHeight: 1.7,
          marginBottom: '2.5rem',
          maxWidth: 360,
        }}>
          Search by artist, track, or how you feel.
          Powered by Spotify.
        </p>

        <button
          onClick={handleLogin}
          className="btn-primary"
          style={{ fontSize: '0.9rem', padding: '0.875rem 2rem' }}
        >
          Connect with Spotify
        </button>
      </div>
    </div>
  );
};

export default HomePage;
