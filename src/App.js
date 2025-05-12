// src/App.js
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getStoredToken } from './api/spotify/token';
import { setAccessToken } from './api/spotify/api';

import HomePage from './pages/HomePage';
import CallbackPage from './pages/CallbackPage';
import MusicPage from './pages/MusicPage';
import FavoritesPage from './pages/FavoritesPage';
import ErrorPage from './pages/ErrorPage';

function App() {
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      console.log('[App] Setting stored access token');
      setAccessToken(token);
    } else {
      console.log('[App] No token found in localStorage');
    }
  }, []);

  const isAuthenticated = !!getStoredToken();

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/music" /> : <HomePage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/music" element={isAuthenticated ? <MusicPage /> : <Navigate to="/" />} />
        <Route path="/favorites" element={isAuthenticated ? <FavoritesPage /> : <Navigate to="/" />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
