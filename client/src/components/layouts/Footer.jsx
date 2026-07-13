import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 text-gray-400 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white tracking-wide">SB STOCKS</span>
          <span>— Production Full-Stack MERN Trading Simulation Platform</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/stocks" className="hover:text-white transition-colors">Stocks</Link>
          <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        </div>
        <p className="text-[11px] text-gray-400">
          © {new Date().getFullYear()} SB Stocks. Virtual Paper Trading Platform.
        </p>
      </div>
    </footer>
  );
}
