import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const activeStyle = {
    fontWeight: '700',
    color: '#6366f1',
    borderBottom: '3px solid #6366f1',
  };

  const navStyle = {
    display: 'flex',
    gap: '2rem',
    padding: '1rem 2rem',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
    backdropFilter: 'blur(10px)',
  };

  const linkStyle = {
    padding: '0.5rem 0',
    color: '#6b7280',
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
