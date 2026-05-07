// src/pages/CallbackPage.js
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleTokenExchange } from '../api/spotify/token';

export default function CallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Spotify auth error:', error);
      navigate('/error');
      return;
    }

    if (!code) {
      console.error('No code found in callback URL');
      navigate('/error');
      return;
    }

    const handleAuth = async () => {
      try {
        await handleTokenExchange(code);
        navigate('/');
      } catch (err) {
        console.error('Failed to exchange code for token:', err);
        navigate('/error');
      }
    };

    handleAuth();
  }, [navigate, location]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#f5f5f5',
      background: 'radial-gradient(circle at top, #2f2f2f 0%, #111111 45%, #060606 100%)',
      letterSpacing: '0.3px',
    }}>
      Authenticating with Spotify...
    </div>
  );
}
