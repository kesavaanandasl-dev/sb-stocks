import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/authSlice.js';
import { toast } from 'react-toastify';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart3,
  ArrowRight,
  Wallet,
  Play
} from 'lucide-react';

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleDemoLogin = async (email, password, label) => {
    try {
      const res = await dispatch(loginUser({ email, password })).unwrap();
      toast.success(`Logged in as ${label}! Welcome back.`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err || 'Failed to log in to demo account');
    }
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900/90 to-emerald-950/40 border border-emerald-500/20 p-8 md:p-14 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            Next-Gen MERN Paper Trading Terminal
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Master the Market with{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              $100,000 Virtual Cash
            </span>
          </h1>

          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            Practice buying and selling 100 real US stocks with simulated live price ticks, interactive charts, and zero financial risk. Build your portfolio, analyze performance, and become a sharper trader.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all"
              >
                Go to Trading Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all"
                >
                  Start Trading Free ($100k Balance)
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleDemoLogin('trader@sbstocks.com', 'Trader@12345', 'Demo Trader')}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-gray-800 hover:bg-gray-750 text-emerald-400 border border-emerald-500/30 font-bold text-sm transition-all"
                >
                  <Play className="w-4 h-4" />
                  Instant Demo Trader Login
                </button>
              </>
            )}
          </div>
        </div>

        {/* Floating Terminal Preview Card */}
        <div className="w-full lg:w-96 glass-panel rounded-2xl p-6 border border-gray-700/80 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <span className="text-xs font-bold text-gray-400">MARKET SNAPSHOT</span>
            <span className="text-xs font-bold text-emerald-400">LIVE ENGINE</span>
          </div>

          <div className="space-y-3">
            {[
              { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 128.40, change: '+3.88%' },
              { symbol: 'AAPL', name: 'Apple Inc.', price: 228.50, change: '+1.42%' },
              { symbol: 'MSFT', name: 'Microsoft Corp.', price: 442.80, change: '+0.48%' },
              { symbol: 'AMZN', name: 'Amazon.com', price: 198.70, change: '+0.97%' }
            ].map((st) => (
              <div key={st.symbol} className="flex items-center justify-between p-3 rounded-xl bg-gray-900/80 border border-gray-800">
                <div>
                  <span className="font-bold text-white text-sm">{st.symbol}</span>
                  <span className="block text-[11px] text-gray-400">{st.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-white text-sm">${st.price.toFixed(2)}</span>
                  <span className="block text-xs font-mono text-emerald-400">{st.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: BarChart3,
            title: '100 US Stocks & Live Ticker',
            desc: 'Explore blue chips across Tech, Healthcare, Finance, and Energy with simulated real-time candlestick charts.'
          },
          {
            icon: Wallet,
            title: 'Instant Execution & P&L',
            desc: 'Buy and sell instantly. Track average purchase price, portfolio value, percentage gains, and transaction history.'
          },
          {
            icon: ShieldCheck,
            title: 'Role-Based Admin Controls',
            desc: 'Includes full Admin capabilities to inspect user balances, manage stocks CRUD, and view system volume metrics.'
          }
        ].map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">{f.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
