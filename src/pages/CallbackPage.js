// src/pages/CallbackPage.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeToken } from '../api/spotify/token';
import { setAccessToken } from '../api/spotify/api';

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    console.log('[CallbackPage] Code from URL:', code);

    if (!code) {
      console.error('[CallbackPage] No code found in URL');
      navigate('/error');
      return;
    }

    exchangeToken(code)
      .then(token => {
        setAccessToken(token);
        navigate('/music');
      })
      .catch(err => {
        console.error('[CallbackPage] Token exchange failed:', err);
        navigate('/error');
      });
  }, [navigate]);

  return (
    <div className="p-4 text-center text-gray-600">
      Authenticating with Spotify...
    </div>
  );
};

export default CallbackPage;
