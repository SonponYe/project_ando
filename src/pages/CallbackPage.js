// src/pages/CallbackPage.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTokenFromUrl, storeToken } from '../api/spotify/token';
import { setAccessToken } from '../api/spotify/api';

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const tokenData = getTokenFromUrl();
    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in;

    if (accessToken) {
      console.log('[CallbackPage] Access token received:', accessToken);
      storeToken(accessToken, expiresIn);
      setAccessToken(accessToken);
      navigate('/music');
    } else {
      console.error('[CallbackPage] No access token found in URL');
      navigate('/error');
    }
  }, [navigate]);

  return (
    <div className="p-4 text-center text-gray-600">
      Authenticating with Spotify...
    </div>
  );
};

export default CallbackPage;
