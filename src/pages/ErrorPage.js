import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
      background: 'radial-gradient(ellipse at 30% 20%, #1a1a1a 0%, #090909 50%, #060606 100%)',
    }}>
      <p style={{
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '1.2px',
        textTransform: 'uppercase',
        color: '#3a3a3a',
        marginBottom: '1rem',
      }}>
        Error
      </p>
      <h1 style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#f0f0f0',
        marginBottom: '0.75rem',
        letterSpacing: '-0.3px',
      }}>
        Something went wrong
      </h1>
      <p style={{
        color: '#555',
        fontSize: '0.9rem',
        marginBottom: '2rem',
        maxWidth: 320,
        lineHeight: 1.6,
      }}>
        Could not complete authentication or load the app.
      </p>
      <button
        className="btn-ghost"
        onClick={() => navigate('/')}
      >
        Try again
      </button>
    </div>
  );
};

export default ErrorPage;
