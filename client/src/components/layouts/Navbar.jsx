import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice.js';
import {
  TrendingUp,
  Wallet,
  User,
  LogOut,
  ShieldAlert,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({ isDark, setIsDark, toggleSidebar }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left section: Hamburger + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 lg:hidden"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                SB STOCKS
              </span>
              <span className="block text-[10px] font-semibold text-emerald-400 tracking-widest uppercase">
                TRADING TERMINAL
              </span>
            </div>
          </Link>
        </div>

        {/* Right section: Balance pill, Theme toggle, Profile */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user && (
            <div className="hidden sm:flex items-center gap-2 bg-gray-950/80 border border-emerald-500/30 px-3.5 py-1.5 rounded-full shadow-inner">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-semibold text-gray-400">Virtual Buying Power</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  ${Number(user.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}

          {/* Theme Switcher Button */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-blue-400" />}
          </button>

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-750 p-1.5 pr-3 rounded-full border border-gray-700 transition-colors"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-emerald-500/40"
                />
                <span className="text-xs font-semibold text-gray-200 hidden md:inline">{user.name}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-800">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 uppercase">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    My Profile
                  </Link>

                  {user.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-amber-400 hover:bg-gray-800 transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-gray-800 transition-colors border-t border-gray-800/80 mt-1"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-1.5 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-lg shadow-md shadow-emerald-600/20 transition-all"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
