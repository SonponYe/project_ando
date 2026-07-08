import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PlaybackProvider } from './context/PlaybackContext';
import { FavoritesProvider } from './context/FavoritesContext';

import Navbar from './components/Navbar';
import Player from './components/Player';
import PwaBanners from './components/PwaBanners';

import MusicPage from './pages/MusicPage';
import FavoritesPage from './pages/FavoritesPage';

function App() {
  return (
    <PlaybackProvider>
      <FavoritesProvider>
        <Router>
          <PwaBanners />
          <Navbar />
          <Routes>
            <Route path="/" element={<MusicPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Player />
        </Router>
      </FavoritesProvider>
    </PlaybackProvider>
  );
}

export default App;
