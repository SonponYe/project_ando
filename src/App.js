// src/App.js
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MusicPage from './pages/MusicPage';
import CallbackPage from './pages/CallbackPage';
import ErrorPage from './pages/ErrorPage';
import { getStoredToken } from './api/spotify/token';
import { setAccessToken } from './api/spotify/api';

function App() {
  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken) {
      console.log('[App] Loaded token from localStorage');
      setAccessToken(storedToken);
    } else {
      console.warn('[App] No token found in localStorage');
    }
  }, []);

  return (
    <Router>
     <Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/callback" element={<CallbackPage />} />
  <Route path="/music" element={<MusicPage />} />
  <Route path="/error" element={<ErrorPage />} />
  <Route path="*" element={<ErrorPage />} />
</Routes>

    </Router>
  );
}

export default App;
