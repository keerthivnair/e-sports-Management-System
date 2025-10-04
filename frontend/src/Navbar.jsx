import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/stats", name: "Stats", icon: "📊" },
    { path: "/events", name: "Events", icon: "🎮" },
    // { path: "/matches", name: "Matches", icon: "⚔️" },
    { path: "/rankings/na", name: "Rankings", icon: "🏆" },
    { path: "/recommendations", name: "Recommendations", icon: "💡" },
  ];

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-gradient-to-r from-black via-gray-900 to-black border-b-2 border-red-500 sticky top-0 z-50 shadow-2xl shadow-red-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-black text-white">E</span>
            </div>
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-red-400 hidden sm:block">
              ESPORTS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ path, name, icon }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105 ${
                  isActive(path)
                    ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/50"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                
                {name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map(({ path, name, icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
                  isActive(path)
                    ? "bg-gradient-to-r from-red-600 to-red-500 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                
                {name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

