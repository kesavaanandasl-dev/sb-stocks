import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStocks } from '../redux/stocksSlice.js';
import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';

const SECTORS = [
  'All',
  'Technology',
  'Financial Services',
  'Healthcare',
  'Consumer Cyclical',
  'Communication Services',
  'Consumer Defensive',
  'Industrials',
  'Energy',
  'Utilities',
  'Real Estate'
];

export default function Stocks() {
  const dispatch = useDispatch();
  const { list, pagination, loading } = useSelector((state) => state.stocks);

  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('All');
  const [sort, setSort] = useState('marketCap_desc');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  useEffect(() => {
    dispatch(fetchStocks({ page, limit: 20, search, sector: sector === 'All' ? '' : sector, sort }));
  }, [dispatch, page, search, sector, sort]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSectorChange = (s) => {
    setSector(s);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Market Explorer</h1>
          <p className="text-xs text-gray-400 mt-1">
            Browse and trade 100 US stocks with live simulated prices
          </p>
        </div>

        {/* View mode toggle & sort */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-900 border border-gray-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-gray-800 text-emerald-400' : 'text-gray-400'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-gray-800 text-emerald-400' : 'text-gray-400'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-gray-300 focus:outline-none focus:border-emerald-500 pr-8"
            >
              <option value="marketCap_desc">Sort by: Market Cap (Highest)</option>
              <option value="price_desc">Sort by: Price (High to Low)</option>
              <option value="price_asc">Sort by: Price (Low to High)</option>
              <option value="symbol_asc">Sort by: Symbol (A-Z)</option>
              <option value="volume_desc">Sort by: Volume</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search & Sector Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-gray-800 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by Symbol (e.g. AAPL, NVDA) or Company Name..."
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Sector tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {SECTORS.map((s) => (
            <button
              key={s}
              onClick={() => handleSectorChange(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                sector === s
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stocks Display */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-xs">Loading market data...</div>
      ) : list.length === 0 ? (
        <div className="glass-panel py-16 text-center rounded-2xl border border-gray-800 space-y-3">
          <p className="text-gray-400 text-sm">No stocks found matching your criteria.</p>
          <button
            onClick={() => {
              setSearch('');
              setSector('All');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-[11px] uppercase tracking-wider text-gray-400 bg-gray-900/50">
                  <th className="py-3.5 px-4">Symbol</th>
                  <th className="py-3.5 px-4">Company Name</th>
                  <th className="py-3.5 px-4">Sector</th>
                  <th className="py-3.5 px-4 text-right">Price</th>
                  <th className="py-3.5 px-4 text-right">24h Change</th>
                  <th className="py-3.5 px-4 text-right">Volume</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-xs">
                {list.map((st) => {
                  const change = Number((st.currentPrice - st.previousClose).toFixed(2));
                  const changePercent = Number((((st.currentPrice - st.previousClose) / st.previousClose) * 100).toFixed(2));
                  const pos = change >= 0;

                  return (
                    <tr key={st._id} className="hover:bg-gray-900/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-white">{st.symbol}</td>
                      <td className="py-3.5 px-4 font-semibold text-gray-200">{st.companyName}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-gray-800 text-gray-300 text-[10px] font-semibold">
                          {st.sector}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                        ${Number(st.currentPrice).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold">
                        <span className={pos ? 'text-emerald-400' : 'text-rose-400'}>
                          {pos ? '+' : ''}{changePercent}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-gray-400">
                        {st.volume?.toLocaleString() || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
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
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {list.map((st) => {
            const change = Number((st.currentPrice - st.previousClose).toFixed(2));
            const changePercent = Number((((st.currentPrice - st.previousClose) / st.previousClose) * 100).toFixed(2));
            const pos = change >= 0;

            return (
              <div
                key={st._id}
                className="glass-panel glass-panel-hover p-5 rounded-2xl border border-gray-800 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-white text-base">{st.symbol}</span>
                    <span className="px-2 py-0.5 rounded bg-gray-800 text-[10px] text-gray-400 font-semibold">
                      {st.sector}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-medium truncate">{st.companyName}</p>
                </div>

                <div className="flex items-end justify-between border-t border-gray-800 pt-3">
                  <div>
                    <span className="block text-[10px] text-gray-500 uppercase">PRICE</span>
                    <span className="font-mono font-black text-white text-lg">
                      ${Number(st.currentPrice).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`block font-mono text-xs font-bold ${pos ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {pos ? '+' : ''}{changePercent}%
                    </span>
                    <Link
                      to={`/stocks/${st.symbol}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:underline mt-1"
                    >
                      Trade Now →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between glass-panel px-6 py-4 rounded-2xl border border-gray-800 text-xs">
          <span className="text-gray-400">
            Showing Page <span className="font-bold text-white">{pagination.page}</span> of{' '}
            <span className="font-bold text-white">{pagination.pages}</span> ({pagination.total} stocks)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 disabled:opacity-40 hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-bold font-mono text-emerald-400">{page}</span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 disabled:opacity-40 hover:bg-gray-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
