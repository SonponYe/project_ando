import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '2rem',
      background: 'linear-gradient(160deg, #141414 0%, #080808 100%)',
    }}>
      <p style={{
        fontSize: '0.68rem', fontWeight: 600,
        letterSpacing: '1.2px', textTransform: 'uppercase',
        color: '#303030', marginBottom: '1rem',
      }}>
        Error
      </p>
      <h1 style={{
        fontSize: '1.5rem', fontWeight: 700, color: '#efefef',
        marginBottom: '0.75rem', letterSpacing: '-0.3px',
      }}>
        Something went wrong
      </h1>
      <p style={{
        color: '#404040', fontSize: '0.88rem',
        marginBottom: '2rem', maxWidth: 300, lineHeight: 1.6,
      }}>
        Could not complete authentication or load the app.
      </p>
      <button className="btn-ghost" onClick={() => navigate('/')}>
        Try again
      </button>
    </div>
  );
};

export default ErrorPage;
