# Ando 🎵

A modern, intuitive music discovery application powered by the Spotify API. Ando helps users explore music through mood-based selections, genre filtering, and intelligent search capabilities.

## Overview

Ando provides a seamless music discovery experience without requiring users to create an account. Simply authenticate with Spotify and start exploring music tailored to your mood and preferences.

## Features

### 🎭 Mood-Based Discovery
- Select from curated mood cards (Happy, Chill, Energetic, Sad)
- Get personalized track recommendations based on your emotional state
- Visual mood selection with beautiful imagery

### 🎸 Genre Filtering
- Browse music by popular genres (Pop, Rock, Hip-Hop, Jazz, Afrobeats)
- Combine mood and genre for refined results
- Extensive genre catalog

### 🔍 Smart Search
- Search for songs, artists, and albums
- Real-time search results
- Preview tracks before adding to favorites

### ❤️ Favorites Management
- Save your favorite tracks for quick access
- Persistent favorites across sessions
- Easy add/remove functionality

### 🎧 Integrated Music Player
- Built-in audio player for track previews
- Continuous playback controls
- Track information display with album artwork

### 👤 User Profile
- View your Spotify profile information
- See recently played tracks
- Access to Spotify account details

## Technology Stack

- **Frontend**: React 19.1.0
- **Routing**: React Router DOM 7.5.3
- **API Integration**: Axios 1.9.0
- **Authentication**: Firebase 11.6.1
- **Audio Playback**: React Howler 5.2.0
- **Icons**: React Icons 5.5.0
- **Styling**: Modern CSS with custom design system

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Spotify Developer Account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SonponYe-shuaChief/ando.git
cd ando
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory and add your Spotify API credentials:
```
REACT_APP_SPOTIFY_CLIENT_ID=your_client_id
REACT_APP_SPOTIFY_CLIENT_SECRET=your_client_secret
REACT_APP_REDIRECT_URI=http://localhost:3000/callback
```

4. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ando/
├── public/              # Static files
├── src/
│   ├── api/            # API integration
│   │   └── spotify/    # Spotify API utilities
│   ├── components/     # Reusable components
│   ├── context/        # React Context providers
│   ├── firebase/       # Firebase configuration
│   ├── pages/          # Page components
│   └── App.js          # Main application component
└── package.json
```

## Available Scripts

- **`npm start`** - Runs the app in development mode
- **`npm build`** - Builds the app for production
- **`npm test`** - Runs the test suite
- **`npm eject`** - Ejects from Create React App (irreversible)

## Features in Detail

### Authentication Flow
The application uses Spotify's OAuth 2.0 authentication flow to securely access user data and provide personalized recommendations.

### Context Management
- **PlaybackContext**: Manages current track, play/pause states
- **FavoritesContext**: Handles favorite tracks persistence

### Responsive Design
Fully responsive layout that works seamlessly across:
- Desktop computers
- Tablets
- Mobile devices

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Acknowledgments

- Spotify Web API for music data
- Create React App for project bootstrapping
- React community for excellent libraries and tools

## Support

For issues or questions, please open an issue on the GitHub repository.

---

**Built with ❤️ by the Ando Team**
