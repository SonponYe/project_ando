// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import CallbackPage from './pages/CallbackPage';
import MusicPage from './pages/MusicPage';
import FavoritesPage from './pages/FavoritesPage';
import ErrorPage from './pages/ErrorPage';

import { getStoredToken, isTokenExpired, clearStoredToken } from './api/spotify/token';
import { setAccessToken } from './api/spotify/api';

function App() {
  const token = getStoredToken();
  const expired = isTokenExpired();

  useEffect(() => {
    if (token && expired) {
      clearStoredToken();
      window.location.href = '/';
    } else if (token && !expired) {
      setAccessToken(token);
    }
  }, [token, expired]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/music" element={token && !expired ? <MusicPage /> : <Navigate to="/" />} />
        <Route path="/favorites" element={token && !expired ? <FavoritesPage /> : <Navigate to="/" />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
