import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const activeStyle = {
    fontWeight: 'bold',
    color: '#4F46E5', // Indigo color for active link
  };

  return (
    <nav
      style={{
        display: 'flex',
        gap: '1.5rem',
        padding: '1rem 2rem',
        borderBottom: '1px solid #ccc',
        backgroundColor: '#f9f9f9',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <NavLink to="/music" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        Music
      </NavLink>
      <NavLink to="/favorites" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        Favorites
      </NavLink>
      <NavLink to="/error" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        Error
      </NavLink>
    </nav>
  );
};

export default Navbar;
