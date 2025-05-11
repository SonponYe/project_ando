// src/pages/CallbackPage.js
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchAccessToken } from '../api/spotify/token';
import { setAccessToken } from '../api/spotify/api';

const CallbackPage = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const code = new URLSearchParams(search).get('code');
    if (!code) return navigate('/error');

    fetchAccessToken(code)
      .then((token) => {
        setAccessToken(token);
        navigate('/music');
      })
      .catch((err) => {
        console.error('[CallbackPage] Token exchange failed:', err);
        navigate('/error');
      });
  }, [navigate, search]);

  return <div>Authenticating...</div>;
};

export default CallbackPage;
