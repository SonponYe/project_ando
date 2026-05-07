// src/pages/HomePage.js
import React from 'react';
import { initiateAuthFlow } from '../api/spotify/token';

const HomePage = () => {
  const handleLogin = async () => {
    await initiateAuthFlow();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '2rem',
      background: 'radial-gradient(circle at 30% 20%, #323232 0%, #141414 48%, #050505 100%)',
      color: '#ffffff',
    }}>
      <div style={{
        maxWidth: '600px',
        padding: '3rem 2rem',
        borderRadius: '24px',
        background: 'rgba(18, 18, 18, 0.76)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        border: '1px solid #323232',
      }}>        <h1 style={{
          fontSize: '3rem',
          fontWeight: '800',
          marginBottom: '1.5rem',
          letterSpacing: '-1px',
          textShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        }}>
          Welcome to Ando 🎵
        </h1>
        <p style={{
          fontSize: '1.15rem',
          marginBottom: '2.5rem',
          lineHeight: '1.7',
          opacity: '0.95',
          fontWeight: '400',
        }}>
          Discover music by mood, genre, or search — personalized recommendations powered by Spotify.
        </p>
        <button
          onClick={handleLogin}
          style={{
            background: 'linear-gradient(135deg, #ffffff, #d4d4d4)',
            color: '#0a0a0a',
            padding: '1rem 2.5rem',
            borderRadius: '14px',
            border: 'none',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            letterSpacing: '0.5px',
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-4px)';
            e.target.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.7)';
          }}          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
          }}
        >
          🎧 Start Listening
        </button>
      </div>
    </div>
  );
};

export default HomePage;
