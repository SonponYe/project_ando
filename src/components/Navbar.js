import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/music', label: 'Music' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/profile', label: 'Profile' },
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
    <span style={{
      fontWeight: 800,
      fontSize: '1.05rem',
      color: '#f0f0f0',
      letterSpacing: '-0.5px',
    }}>
      ando
    </span>

    <div style={{ display: 'flex', gap: '0.125rem' }}>
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
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
