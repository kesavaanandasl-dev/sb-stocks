import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPortfolio } from '../redux/portfolioSlice.js';
import { fetchTopMovers } from '../redux/stocksSlice.js';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Briefcase,
  ArrowUpRight,
  ArrowRight,
  Search,
  Zap,
  DollarSign
} from 'lucide-react';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { summary, holdings, loading: portfolioLoading } = useSelector((state) => state.portfolio);
  const { topMovers } = useSelector((state) => state.stocks);
  const [activeTab, setActiveTab] = useState('gainers'); // 'gainers' | 'losers' | 'active'

  useEffect(() => {
    dispatch(fetchPortfolio());
    dispatch(fetchTopMovers());
  }, [dispatch]);

  const totalBalance = user?.balance || 0;
  const netPortfolioValue = summary?.totalCurrentValue || 0;
  const netProfitLoss = summary?.totalProfitLoss || 0;
  const isPos = netProfitLoss >= 0;

  const currentList =
    activeTab === 'gainers'
      ? topMovers.topGainers
      : activeTab === 'losers'
      ? topMovers.topLosers
      : topMovers.mostActive;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-900 via-gray-900 to-emerald-950/30 p-6 rounded-2xl border border-gray-800">
        <div>
          <h1 className="text-2xl font-black text-white">
            Welcome back, {user?.name || 'Trader'} 👋
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time paper trading account status & market overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/stocks"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            Trade Stocks
          </Link>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-750 text-gray-200 border border-gray-700 text-xs font-bold transition-all"
          >
            View Holdings
          </Link>
        </div>
      </div>

      {/* 4 Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Virtual Cash */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>AVAILABLE CASH</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-mono font-black text-white">
            ${Number(totalBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="inline-block text-[10px] text-gray-400">Ready to buy stocks</span>
        </div>

        {/* Card 2: Holdings Value */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>HOLDINGS VALUE</span>
            <Briefcase className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-mono font-black text-white">
            ${Number(netPortfolioValue).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="inline-block text-[10px] text-gray-400">{holdings.length} Active Positions</span>
        </div>

        {/* Card 3: Total P&L */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>NET PROFIT / LOSS</span>
            {isPos ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <p className={`text-2xl font-mono font-black ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPos ? '+' : ''}${Number(netProfitLoss).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span
            className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded ${
              isPos ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            }`}
          >
            {isPos ? '+' : ''}{summary?.totalPercentageGain || 0}% Overall Return
          </span>
        </div>

        {/* Card 4: Net Equity */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>TOTAL ACCOUNT EQUITY</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-mono font-black text-white">
            ${Number(totalBalance + netPortfolioValue).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="inline-block text-[10px] text-gray-400">Cash + Holdings</span>
        </div>
      </div>

      {/* Main Grid: Top Movers & Portfolio Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Market Movers */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">Market Movers</h2>
              <p className="text-xs text-gray-400">Real-time leaders across 100 US stocks</p>
            </div>

            <div className="flex items-center gap-1.5 bg-gray-900 p-1 rounded-xl border border-gray-800">
              {[
                { key: 'gainers', label: 'Top Gainers' },
                { key: 'losers', label: 'Top Losers' },
                { key: 'active', label: 'Most Active' }
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    activeTab === t.key
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-[11px] uppercase tracking-wider text-gray-400">
                  <th className="py-3 px-3">Symbol</th>
                  <th className="py-3 px-3">Company</th>
                  <th className="py-3 px-3">Sector</th>
                  <th className="py-3 px-3 text-right">Price</th>
                  <th className="py-3 px-3 text-right">Change</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-xs">
                {currentList?.map((st) => {
                  const pos = st.change >= 0;
                  return (
                    <tr key={st._id} className="hover:bg-gray-900/60 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-white font-mono">{st.symbol}</td>
                      <td className="py-3.5 px-3 font-medium text-gray-300 truncate max-w-[150px]">
                        {st.companyName}
                      </td>
                      <td className="py-3.5 px-3 text-gray-400">
                        <span className="px-2 py-0.5 rounded-full bg-gray-800 text-[10px] font-semibold">
                          {st.sector}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-white">
                        ${Number(st.currentPrice).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold">
                        <span className={pos ? 'text-emerald-400' : 'text-rose-400'}>
                          {pos ? '+' : ''}{st.changePercent}%
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <Link
                          to={`/stocks/${st.symbol}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold transition-colors"
                        >
                          Trade
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Current Portfolio Snapshot */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-white">My Active Holdings</h3>
              <Link to="/portfolio" className="text-xs text-emerald-400 hover:underline">
                View All →
              </Link>
            </div>

            {holdings.length === 0 ? (
              <div className="py-10 text-center space-y-3">
                <p className="text-xs text-gray-400">You don't own any stocks yet.</p>
                <Link
                  to="/stocks"
                  className="inline-block px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold"
                >
                  Explore 100 Stocks
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {holdings.slice(0, 5).map((h) => {
                  const symbol = h.stock?.symbol || 'UNKNOWN';
                  const pos = h.profitLoss >= 0;
                  return (
                    <div
                      key={h._id}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-900/60 border border-gray-800/80"
                    >
                      <div>
                        <span className="font-bold text-white text-xs block">{symbol}</span>
                        <span className="text-[10px] text-gray-400">{h.quantity} shares</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-white text-xs block">
                          ${Number(h.currentValue).toFixed(2)}
                        </span>
                        <span className={`text-[10px] font-mono font-bold ${pos ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {pos ? '+' : ''}${h.profitLoss} ({pos ? '+' : ''}{h.percentageGain}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-800">
            <Link
              to="/stocks"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-750 text-white font-bold text-xs transition-colors"
            >
              Browse Full Stock Market
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
