import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-6 px-4">
      <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
        <TrendingUp className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-black text-white">404 — Page Not Found</h1>
        <p className="text-sm text-gray-400 max-w-md">
          The page or stock symbol you are looking for does not exist or has been moved.
        </p>
      </div>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Trading Terminal
      </Link>
    </div>
  );
}
