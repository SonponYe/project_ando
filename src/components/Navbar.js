import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import wordmark from '../images/ando-wordmark.png';

const links = [
  { to: '/', label: 'Discover' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/playlists', label: 'Playlists' },
  { to: '/local', label: 'Local' },
];

const Navbar = () => (
  <nav style={{
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    background: 'rgba(8, 8, 8, 0.96)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid #181818',
    padding: '0 1.5rem',
    height: 54,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }}>
    <Link to="/" aria-label="Ando home" style={{ display: 'flex', alignItems: 'center' }}>
      <img src={wordmark} alt="Ando" style={{ height: 20, width: 'auto', display: 'block' }} />
    </Link>

    <div style={{ display: 'flex', gap: '0.125rem' }}>
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          style={({ isActive }) => ({
            display: 'inline-block',
            padding: '0.375rem 0.75rem',
            borderRadius: 8,
            fontSize: '0.85rem',
            fontWeight: 500,
            color: isActive ? '#f0f0f0' : '#555',
            background: isActive ? '#1c1c1c' : 'transparent',
            transition: 'color 0.15s ease, background 0.15s ease',
            textDecoration: 'none',
          })}
        >
          {label}
        </NavLink>
      ))}
    </div>
  </nav>
);

export default Navbar;
