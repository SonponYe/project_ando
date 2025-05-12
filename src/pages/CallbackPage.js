// src/pages/CallbackPage.js
import { useEffect } from 'react';
import { exchangeToken } from '../api/spotify/token';
import { setAccessToken } from '../api/spotify/api';

const CallbackPage = () => {
  useEffect(() => {
    const handleAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      console.log('[CallbackPage] Code from URL:', code);

      if (code) {
        try {
          const token = await exchangeToken(code);
          setAccessToken(token.access_token);
          window.location.href = '/music'; // Refresh app with new token
        } catch (err) {
          console.error('[CallbackPage] Token exchange failed:', err);
          window.location.href = '/error';
        }
      }
    };

    handleAuth();
  }, []);

  return <div className="text-white text-center mt-10">Processing authentication...</div>;
};

export default CallbackPage;
