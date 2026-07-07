# ANDO — vibe to the rhythm

A modern, minimalist music discovery app powered by the Jamendo API. Ando helps you explore independent, freely-licensed music through mood-based selections, genre filtering, and search — with full-length playback, no login required.

## Overview

Ando is a no-login music discovery experience. Open the app and start exploring immediately — search, browse by mood/genre, and play full tracks.

## Features

### Mood-Based Discovery
- Select from mood chips (Happy, Chill, Energetic, Sad, Focus)
- Combine with genre filters for refined results

### Genre Filtering
- Browse by genre (Pop, Rock, Hip-Hop, Jazz, Afrobeats, Electronic)
- Combine mood and genre for a tag-based search

### Smart Search
- Search for songs and artists
- Full-length streaming playback (not just previews)

### Favorites
- Save tracks for quick access, persisted in localStorage across sessions

### Integrated Player
- Full-length audio playback via a circular now-playing view
- Seekable progress ring, mini-player bar with live progress

## Technology Stack

- **Frontend**: React 19
- **Routing**: React Router DOM 7
- **API Integration**: Axios, [Jamendo API](https://developer.jamendo.com/)
- **Audio Playback**: React Howler
- **Icons**: React Icons (Lucide set)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A free Jamendo API client ID

### Getting a Jamendo Client ID

1. Sign up at [devportal.jamendo.com](https://devportal.jamendo.com/)
2. Create an app — you only need the **Client ID** (no client secret, no OAuth — all read-only public catalog access)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SonponYe/project_ando.git
cd project_ando
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables — create a `.env` file in the root:
```
REACT_APP_JAMENDO_CLIENT_ID=your_client_id
```

4. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
ando/
├── public/              # Static files
├── src/
│   ├── api/
│   │   └── jamendo/     # Jamendo API integration
│   ├── components/      # Navbar, Player
│   ├── context/         # PlaybackContext, FavoritesContext
│   ├── pages/           # MusicPage, FavoritesPage
│   └── App.js
└── package.json
```

## Available Scripts

- **`npm start`** — Runs the app in development mode
- **`npm run build`** — Builds the app for production
- **`npm test`** — Runs the test suite

## Context Management

- **PlaybackContext** — current track, play/pause state
- **FavoritesContext** — favorite tracks, persisted to localStorage

## Notes

Jamendo's catalog is independent/Creative-Commons music, not mainstream chart tracks — the trade-off for free, full-length, legal playback with no login wall.

## License

This project is private and proprietary.
