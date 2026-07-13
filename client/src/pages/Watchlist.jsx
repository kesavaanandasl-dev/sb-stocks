import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWatchlist, removeFromWatchlist } from '../redux/watchlistSlice.js';
import { toast } from 'react-toastify';
import { Star, Trash2, ArrowUpRight } from 'lucide-react';

export default function Watchlist() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.watchlist);

  useEffect(() => {
    dispatch(fetchWatchlist());
  }, [dispatch]);

  const handleRemove = async (id, symbol) => {
    try {
      await dispatch(removeFromWatchlist(id)).unwrap();
      toast.info(`Removed ${symbol} from watchlist`);
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Saved Watchlist</h1>
        <p className="text-xs text-gray-400 mt-1">
          Keep tabs on your favorite stocks before making trade execution decisions
        </p>
      </div>

      <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-gray-400">Loading watchlist...</div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-xs text-gray-400">Your watchlist is currently empty.</p>
            <Link
              to="/stocks"
              className="inline-block px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold"
            >
              Explore Stocks to Watch
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-[11px] uppercase tracking-wider text-gray-400 bg-gray-900/50">
                  <th className="py-3.5 px-4">Symbol</th>
                  <th className="py-3.5 px-4">Company Name</th>
                  <th className="py-3.5 px-4">Sector</th>
                  <th className="py-3.5 px-4 text-right">Live Price</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-xs">
                {items.map((item) => {
                  const stock = item.stockId;
                  if (!stock) return null;
                  return (
                    <tr key={item._id} className="hover:bg-gray-900/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-white">{stock.symbol}</td>
                      <td className="py-3.5 px-4 font-semibold text-gray-200">{stock.companyName}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-gray-800 text-gray-300 text-[10px] font-semibold">
                          {stock.sector}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                        ${Number(stock.currentPrice).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <Link
                          to={`/stocks/${stock.symbol}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold transition-colors"
                        >
                          Trade
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleRemove(item._id, stock.symbol)}
                          className="p-1.5 rounded-lg bg-gray-900 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 border border-gray-800 transition-colors"
                          title="Remove from Watchlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
