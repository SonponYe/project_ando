// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { retrieveValidToken } from './api/spotify/token';

import HomePage from './pages/HomePage';
import CallbackPage from './pages/CallbackPage';
import MusicPage from './pages/MusicPage';
import MusicListPage from './pages/MusicListPage'; // Import the new page
import FavoritesPage from './pages/FavoritesPage';
import ErrorPage from './pages/ErrorPage';

function App() {
  const isAuthenticated = !!retrieveValidToken();

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/music" /> : <HomePage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/music" element={isAuthenticated ? <MusicPage /> : <Navigate to="/" />} />
        <Route path="/music-list" element={isAuthenticated ? <MusicListPage /> : <Navigate to="/" />} />
        <Route path="/favorites" element={isAuthenticated ? <FavoritesPage /> : <Navigate to="/" />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
