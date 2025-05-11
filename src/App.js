// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import CallbackPage from './pages/CallbackPage';
import MusicPage from './pages/MusicPage';
import FavoritesPage from './pages/FavoritesPage';
import ErrorPage from './pages/ErrorPage';

import { getStoredToken, clearStoredToken } from './api/spotify/token';
import { setAccessToken } from './api/spotify/api';

function App() {
  const token = getStoredToken();

  useEffect(() => {
    if (!token) {
      console.warn('[App] No token found in localStorage');
      clearStoredToken();
    } else {
      setAccessToken(token);
    }
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/music" element={token ? <MusicPage /> : <Navigate to="/" />} />
        <Route path="/favorites" element={token ? <FavoritesPage /> : <Navigate to="/" />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
