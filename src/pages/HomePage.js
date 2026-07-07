import React from 'react';
import { initiateAuthFlow } from '../api/spotify/token';

const HomePage = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'linear-gradient(160deg, #181818 0%, #090909 55%, #060606 100%)',
  }}>
    <div style={{ maxWidth: 460, width: '100%' }}>
      <p style={{
        fontSize: '0.68rem', fontWeight: 600,
        letterSpacing: '1.5px', textTransform: 'uppercase',
        color: '#383838', marginBottom: '1.25rem',
      }}>
        Music Discovery
      </p>

      <h1 style={{
        fontSize: 'clamp(2.25rem, 6vw, 3rem)',
        fontWeight: 800, color: '#efefef',
        letterSpacing: '-1px', lineHeight: 1.1,
        marginBottom: '1rem',
      }}>
        Your sound,<br />your mood.
      </h1>

      <p style={{
        fontSize: '0.95rem', color: '#404040',
        lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 340,
      }}>
        Search by artist, track, or how you feel.
        Powered by Spotify.
      </p>

      <button
        onClick={() => initiateAuthFlow()}
        className="btn-primary"
        style={{ fontSize: '0.875rem', padding: '0.875rem 2rem' }}
      >
        Connect with Spotify
      </button>
    </div>
  </div>
);

export default HomePage;
