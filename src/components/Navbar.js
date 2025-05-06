// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold tracking-wide">
        Ando 🎶
      </Link>
      <div className="space-x-4">
        <Link to="/" className="hover:text-green-400">Home</Link>
        <Link to="/favorites" className="hover:text-green-400">Favorites</Link>
      </div>
    </nav>
  );
};

export default Navbar;
