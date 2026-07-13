import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { applyLiveTicks } from '../../redux/stocksSlice.js';
import { TrendingUp, TrendingDown, Radio } from 'lucide-react';

export default function LiveTickerBar() {
  const dispatch = useDispatch();
  const [ticks, setTicks] = useState([
    { symbol: 'AAPL', currentPrice: 228.50, change: 3.20, changePercent: 1.42 },
    { symbol: 'NVDA', currentPrice: 128.40, change: 4.80, changePercent: 3.88 },
    { symbol: 'MSFT', currentPrice: 442.80, change: 2.10, changePercent: 0.48 },
    { symbol: 'TSLA', currentPrice: 248.50, change: -4.20, changePercent: -1.66 },
    { symbol: 'AMZN', currentPrice: 198.70, change: 1.90, changePercent: 0.97 },
    { symbol: 'GOOGL', currentPrice: 182.15, change: 1.15, changePercent: 0.64 },
    { symbol: 'META', currentPrice: 504.60, change: 8.40, changePercent: 1.69 },
    { symbol: 'AMD', currentPrice: 162.30, change: -1.80, changePercent: -1.10 }
  ]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource('/api/stocks/live-ticker');

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data) && data.length > 0) {
          setTicks(data);
          dispatch(applyLiveTicks(data));
        }
      } catch (err) {
        // Ignore parse errors
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, [dispatch]);

  return (
    <div className="bg-gray-950 border-b border-gray-800/80 text-xs py-1.5 px-4 flex items-center overflow-hidden">
      <div className="flex items-center gap-2 pr-4 border-r border-gray-800 shrink-0 font-semibold text-gray-400">
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
        </span>
        LIVE MARKET TICKER
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
          {[...ticks, ...ticks, ...ticks].map((tick, index) => {
            const isPos = tick.change >= 0;
            return (
              <div key={`${tick.symbol}-${index}`} className="inline-flex items-center gap-2 text-gray-300">
                <span className="font-bold text-white tracking-wider">{tick.symbol}</span>
                <span className="font-mono">${Number(tick.currentPrice).toFixed(2)}</span>
                <span
                  className={`inline-flex items-center font-mono font-medium ${
                    isPos ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPos ? '+' : ''}{tick.changePercent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
