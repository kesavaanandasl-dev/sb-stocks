import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  TrendingUp,
  Briefcase,
  Star,
  History,
  User,
  ShieldAlert,
  Info,
  HelpCircle
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Stock Explorer', path: '/stocks', icon: TrendingUp },
    { label: 'My Portfolio', path: '/portfolio', icon: Briefcase },
    { label: 'Watchlist', path: '/watchlist', icon: Star },
    { label: 'Transactions', path: '/transactions', icon: History },
    { label: 'Profile Settings', path: '/profile', icon: User }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-full lg:h-auto w-64 bg-gray-900/90 border-r border-gray-800 p-4 flex flex-col justify-between z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          <div className="mb-4 px-3 py-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Navigation
            </span>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/80'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}

            {user?.role === 'ADMIN' && (
              <div className="pt-4 mt-4 border-t border-gray-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/80 px-3 block mb-2">
                  Admin Controls
                </span>
                <NavLink
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'text-gray-400 hover:text-amber-300 hover:bg-gray-800/80'
                    }`
                  }
                >
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Admin Dashboard
                </NavLink>
              </div>
            )}
          </nav>
        </div>

        {/* Bottom Trading info pill */}
        <div className="mt-6 p-3.5 rounded-xl bg-gray-950/80 border border-gray-800/80">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
            <TrendingUp className="w-4 h-4" />
            Paper Trading Active
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Practice buying & selling 100 US stocks risk-free with live simulated market prices.
          </p>
        </div>
      </aside>
    </>
  );
}
