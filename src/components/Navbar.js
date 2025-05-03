import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../firebase/auth";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">🎵 Ando</div>
      <div className="space-x-4">
        <Link to="/" className="hover:text-yellow-300">Home</Link>
        <Link to="/music" className="hover:text-yellow-300">Music</Link>
        <Link to="/favorites" className="hover:text-yellow-300">Favorites</Link>
        <button onClick={handleLogout} className="hover:text-red-400">Logout</button>
      </div>
    </nav>
  );
}
