import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/authSlice.js';
import { toast } from 'react-toastify';
import { Lock, Mail, TrendingUp, Play, ShieldAlert } from 'lucide-react';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      toast.success('Welcome back to SB Stocks!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error || 'Invalid credentials');
    }
  };

  const quickDemoLogin = async (demoEmail, demoPassword, label) => {
    try {
      await dispatch(loginUser({ email: demoEmail, password: demoPassword })).unwrap();
      toast.success(`Logged in as ${label}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(`Demo login failed: ${error}`);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 border border-gray-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">Welcome Back</h2>
          <p className="text-xs text-gray-400">Sign in to manage your $100k paper trading portfolio</p>
        </div>

        {/* Instant Demo Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => quickDemoLogin('trader@sbstocks.com', 'Trader@12345', 'Demo Trader')}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            Demo Trader
          </button>

          <button
            type="button"
            onClick={() => quickDemoLogin('admin@sbstocks.com', 'Admin@12345', 'Platform Admin')}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Demo Admin
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <span className="h-px w-full bg-gray-800"></span>
          <span className="absolute bg-gray-900 px-3 text-[11px] font-semibold text-gray-500 uppercase">OR</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="trader@sbstocks.com"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-400 hover:underline font-semibold">
            Register for Free
          </Link>
        </p>
      </div>
    </div>
  );
}
