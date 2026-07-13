import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStockDetails } from '../redux/stocksSlice.js';
import { buyStockOrder, sellStockOrder, fetchPortfolio } from '../redux/portfolioSlice.js';
import { addToWatchlist, removeFromWatchlist, fetchWatchlist } from '../redux/watchlistSlice.js';
import { toast } from 'react-toastify';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Star,
  Wallet,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function StockDetails() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedStock: stock, loading } = useSelector((state) => state.stocks);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { holdings } = useSelector((state) => state.portfolio);
  const { items: watchlistItems } = useSelector((state) => state.watchlist);

  const [tradeType, setTradeType] = useState('BUY'); // 'BUY' | 'SELL'
  const [quantity, setQuantity] = useState(10);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    if (symbol) {
      dispatch(fetchStockDetails(symbol));
    }
    if (isAuthenticated) {
      dispatch(fetchPortfolio());
      dispatch(fetchWatchlist());
    }
  }, [dispatch, symbol, isAuthenticated]);

  if (loading || !stock) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-gray-400">Loading live stock data for {symbol}...</p>
      </div>
    );
  }

  const currentHolding = holdings.find((h) => h.stock?.symbol === stock.symbol);
  const ownedShares = currentHolding?.quantity || 0;
  const inWatchlist = watchlistItems.some((w) => w.stockId?._id === stock._id || w.stockId === stock._id);

  const currentPrice = Number(stock.currentPrice || 0);
  const previousClose = Number(stock.previousClose || currentPrice);
  const change = Number((currentPrice - previousClose).toFixed(2));
  const changePercent = previousClose > 0 ? Number(((change / previousClose) * 100).toFixed(2)) : 0;
  const isPos = change >= 0;

  const totalOrderAmount = Number((quantity * currentPrice).toFixed(2));
  const canBuy = user && user.balance >= totalOrderAmount && quantity > 0;
  const canSell = ownedShares >= quantity && quantity > 0;

  const handleWatchlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to manage your watchlist');
      return;
    }
    try {
      if (inWatchlist) {
        const item = watchlistItems.find((w) => w.stockId?._id === stock._id || w.stockId === stock._id);
        if (item) {
          await dispatch(removeFromWatchlist(item._id)).unwrap();
          toast.info(`Removed ${stock.symbol} from watchlist`);
        }
      } else {
        await dispatch(addToWatchlist(stock._id)).unwrap();
        toast.success(`Added ${stock.symbol} to watchlist!`);
      }
    } catch (err) {
      toast.error(err || 'Failed to update watchlist');
    }
  };

  const handleExecuteTrade = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to trade stocks');
      navigate('/login');
      return;
    }
    if (quantity <= 0) {
      toast.error('Enter a valid share quantity greater than 0');
      return;
    }

    setExecuting(true);
    try {
      if (tradeType === 'BUY') {
        await dispatch(buyStockOrder({ stockId: stock._id, quantity: Number(quantity) })).unwrap();
        toast.success(`🎉 Bought ${quantity} shares of ${stock.symbol} for $${totalOrderAmount.toLocaleString()}`);
      } else {
        await dispatch(sellStockOrder({ stockId: stock._id, quantity: Number(quantity) })).unwrap();
        toast.success(`💰 Sold ${quantity} shares of ${stock.symbol} for $${totalOrderAmount.toLocaleString()}`);
      }
    } catch (error) {
      toast.error(error || 'Trade execution failed');
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button & Title bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight font-mono">
                {stock.symbol}
              </h1>
              <span className="px-2.5 py-1 rounded-full bg-gray-800 text-gray-300 text-xs font-semibold">
                {stock.sector}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{stock.companyName} • {stock.exchange}</p>
          </div>
        </div>

        {/* Price & Watchlist Star */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-2xl md:text-3xl font-mono font-black text-white">
              ${currentPrice.toFixed(2)}
            </span>
            <span
              className={`block font-mono font-bold text-xs ${
                isPos ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isPos ? '+' : ''}${change} ({isPos ? '+' : ''}{changePercent}%)
            </span>
          </div>

          <button
            onClick={handleWatchlistToggle}
            className={`p-3 rounded-2xl border transition-all ${
              inWatchlist
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-md shadow-amber-500/10'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
            }`}
            title="Toggle Watchlist"
          >
            <Star className={`w-5 h-5 ${inWatchlist ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Split Layout: Chart (Left 2 cols) & Trading Terminal (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Chart & Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                30-Day Historical Price Chart
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                Simulated Live Stream Active
              </span>
            </div>

            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stock.chartHistory || []}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPos ? '#10B981' : '#F43F5E'} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={isPos ? '#10B981' : '#F43F5E'} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis dataKey="date" stroke="#6B7280" textAnchor="end" fontSize={10} />
                  <YAxis
                    stroke="#6B7280"
                    domain={['auto', 'auto']}
                    fontSize={10}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      borderColor: '#374151',
                      borderRadius: '0.75rem',
                      fontSize: '12px'
                    }}
                    formatter={(val) => [`$${val}`, 'Price']}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={isPos ? '#10B981' : '#F43F5E'}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Company Fundamentals */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800">
            <h3 className="text-sm font-bold text-white mb-4">Key Market Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <span className="text-gray-400 block mb-1">Previous Close</span>
                <span className="font-mono font-bold text-white">${stock.previousClose?.toFixed(2)}</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <span className="text-gray-400 block mb-1">Open Price</span>
                <span className="font-mono font-bold text-white">${stock.openPrice?.toFixed(2)}</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <span className="text-gray-400 block mb-1">Daily High</span>
                <span className="font-mono font-bold text-emerald-400">${stock.high?.toFixed(2)}</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <span className="text-gray-400 block mb-1">Daily Low</span>
                <span className="font-mono font-bold text-rose-400">${stock.low?.toFixed(2)}</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <span className="text-gray-400 block mb-1">Volume</span>
                <span className="font-mono font-bold text-white">{stock.volume?.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <span className="text-gray-400 block mb-1">Market Cap</span>
                <span className="font-mono font-bold text-white">
                  ${(stock.marketCap / 1e9).toFixed(1)}B
                </span>
              </div>
              <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <span className="text-gray-400 block mb-1">Industry</span>
                <span className="font-semibold text-white truncate block">{stock.industry}</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                <span className="text-gray-400 block mb-1">Exchange</span>
                <span className="font-bold text-white">{stock.exchange}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Ticket Execution Terminal */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-white">Order Execution Terminal</h2>
              <p className="text-xs text-gray-400 mt-1">Instant paper trading fill at market price</p>
            </div>

            {/* Buy / Sell Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-gray-900 p-1.5 rounded-2xl border border-gray-800">
              <button
                type="button"
                onClick={() => setTradeType('BUY')}
                className={`py-2.5 rounded-xl text-xs font-black transition-all ${
                  tradeType === 'BUY'
                    ? 'bg-emerald-500 text-gray-950 shadow-md shadow-emerald-500/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                BUY SHARES
              </button>
              <button
                type="button"
                onClick={() => setTradeType('SELL')}
                className={`py-2.5 rounded-xl text-xs font-black transition-all ${
                  tradeType === 'SELL'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                SELL SHARES
              </button>
            </div>

            {/* User Account Status inside terminal */}
            <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-400">
                <span>Buying Power:</span>
                <span className="font-mono font-bold text-emerald-400">
                  ${user ? Number(user.balance).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Owned Shares:</span>
                <span className="font-mono font-bold text-white">{ownedShares} shares</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-300">Share Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-lg font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
              />

              <div className="flex items-center gap-2 pt-1">
                {[1, 5, 10, 25, 50].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuantity(q)}
                    className="flex-1 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-[11px] font-bold text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    +{q}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Estimated Market Price:</span>
                <span className="font-mono font-bold text-white">${currentPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 border-t border-gray-800/80 pt-2">
                <span className="font-bold text-gray-200">Total Order Value:</span>
                <span className="font-mono font-black text-white text-sm">
                  ${totalOrderAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleExecuteTrade}
            disabled={executing || (tradeType === 'BUY' && !canBuy) || (tradeType === 'SELL' && !canSell)}
            className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg ${
              tradeType === 'BUY'
                ? 'bg-emerald-500 hover:bg-emerald-400 text-gray-950 shadow-emerald-500/20'
                : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {executing
              ? 'Executing Order...'
              : tradeType === 'BUY'
              ? `PLACE BUY ORDER • $${totalOrderAmount.toLocaleString()}`
              : `PLACE SELL ORDER • ${quantity} SHARES`}
          </button>
        </div>
      </div>
    </div>
  );
}
