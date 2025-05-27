// src/pages/CallbackPage.js
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleTokenExchange } from '../api/spotify/token';

export default function CallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const code = new URLSearchParams(location.search).get('code');
    const error = params.get('error');

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

  return <div>Authenticating with Spotify...</div>;
}
