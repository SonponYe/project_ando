// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { retrieveValidToken } from './api/spotify/token';

import { PlaybackProvider } from './context/PlaybackContext';
import Player from './components/Player';
import ProfilePage from './pages/ProfilePage';

import HomePage from './pages/HomePage';
import CallbackPage from './pages/CallbackPage';
import MusicPage from './pages/MusicPage';
import MusicListPage from './pages/MusicListPage';
import FavoritesPage from './pages/FavoritesPage';
import ErrorPage from './pages/ErrorPage';
import Navbar from './components/Navbar';

function App() {
  const isAuthenticated = !!retrieveValidToken();

  return (
    <PlaybackProvider>
      <Router>
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/music" /> : <HomePage />} />
          <Route path="/callback" element={<CallbackPage />} />
          <Route path="/music" element={isAuthenticated ? <MusicPage /> : <Navigate to="/" />} />
          <Route path="/music-list" element={isAuthenticated ? <MusicListPage /> : <Navigate to="/" />} />
          <Route path="/favorites" element={isAuthenticated ? <FavoritesPage /> : <Navigate to="/" />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/" />} />
        </Routes>
        {isAuthenticated && <Player />} {/* Render Player when authenticated */}
      </Router>
    </PlaybackProvider>
  );
}

export default App;
