import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PlaybackProvider } from './context/PlaybackContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { PlaylistsProvider } from './context/PlaylistsContext';
import { LocalLibraryProvider } from './context/LocalLibraryContext';

import Navbar from './components/Navbar';
import Player from './components/Player';
import PwaBanners from './components/PwaBanners';

import MusicPage from './pages/MusicPage';
import FavoritesPage from './pages/FavoritesPage';
import PlaylistsPage from './pages/PlaylistsPage';
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import LocalLibraryPage from './pages/LocalLibraryPage';
import RecentlyPlayedPage from './pages/RecentlyPlayedPage';

function App() {
  return (
    <PlaybackProvider>
      <FavoritesProvider>
        <PlaylistsProvider>
          <LocalLibraryProvider>
            <Router>
              <PwaBanners />
              <Navbar />
              <Routes>
                <Route path="/" element={<MusicPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/playlists" element={<PlaylistsPage />} />
                <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
                <Route path="/local" element={<LocalLibraryPage />} />
                <Route path="/recent" element={<RecentlyPlayedPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
              <Player />
            </Router>
          </LocalLibraryProvider>
        </PlaylistsProvider>
      </FavoritesProvider>
    </PlaybackProvider>
  );
}

export default App;
