import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const activeStyle = {
    fontWeight: '700',
    color: '#ffffff',
    borderBottom: '3px solid #f3f4f6',
  };

  const navStyle = {
    display: 'flex',
    gap: '2rem',
    padding: '1rem 2rem',
    borderBottom: '1px solid #2f2f2f',
    backgroundColor: 'rgba(8, 8, 8, 0.92)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(10px)',
  };

  const linkStyle = {
    padding: '0.5rem 0',
    color: '#9ca3af',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    borderBottom: '3px solid transparent',
    letterSpacing: '0.3px',
  };

  return (
    <nav style={navStyle}>
      <NavLink 
        to="/music" 
        style={({ isActive }) => ({
          ...linkStyle,
          ...(isActive ? activeStyle : {}),
        })}
      >
        Music
      </NavLink>
      <NavLink 
        to="/favorites" 
        style={({ isActive }) => ({
          ...linkStyle,
          ...(isActive ? activeStyle : {}),
        })}
      >
        Favorites
      </NavLink>
      <NavLink 
        to="/profile" 
        style={({ isActive }) => ({
          ...linkStyle,
          ...(isActive ? activeStyle : {}),
        })}
      >
        Profile
      </NavLink>
    </nav>
  );
};

export default Navbar;
