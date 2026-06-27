import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { retrieveValidToken } from './api/spotify/token';
import { PlaybackProvider } from './context/PlaybackContext';
import { FavoritesProvider } from './context/FavoritesContext';

import Navbar from './components/Navbar';
import Player from './components/Player';

import HomePage from './pages/HomePage';
import CallbackPage from './pages/CallbackPage';
import MusicPage from './pages/MusicPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import ErrorPage from './pages/ErrorPage';

function App() {
  const isAuthenticated = !!retrieveValidToken();

  return (
    <PlaybackProvider>
      <FavoritesProvider>
        <Router>
          {isAuthenticated && <Navbar />}
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/music" /> : <HomePage />} />
            <Route path="/callback" element={<CallbackPage />} />
            <Route path="/music" element={isAuthenticated ? <MusicPage /> : <Navigate to="/" />} />
            <Route path="/favorites" element={isAuthenticated ? <FavoritesPage /> : <Navigate to="/" />} />
            <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/" />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          {isAuthenticated && <Player />}
        </Router>
      </FavoritesProvider>
    </PlaybackProvider>
  );
}

export default App;
