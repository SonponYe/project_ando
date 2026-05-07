// src/pages/ErrorPage.js
import React from "react";
import { useNavigate } from "react-router-dom";

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
      color: '#f5f5f5',
      padding: '2rem',
      background: 'radial-gradient(circle at top, #2f2f2f 0%, #111111 45%, #060606 100%)',
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong</h1>
      <p style={{ marginBottom: '1.25rem', color: '#b3b3b3' }}>Could not authenticate or load the app properly.</p>
      <button onClick={() => navigate('/')}>
        Try Again
      </button>
    </div>
  );
};

export default ErrorPage;
