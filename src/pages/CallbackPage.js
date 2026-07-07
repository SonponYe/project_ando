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
      background: 'linear-gradient(160deg, #141414 0%, #080808 100%)',
    }}>
      <p style={{ fontSize: '0.82rem', color: '#383838', letterSpacing: '0.5px' }}>
        Connecting to Spotify...
      </p>
    </div>
  );
}
