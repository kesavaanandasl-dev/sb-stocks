import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPortfolio } from '../redux/portfolioSlice.js';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import Papa from 'papaparse';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import {
  Briefcase,
  TrendingUp,
  TrendingDown,
  Download,
  FileText,
  ArrowUpRight,
  Wallet
} from 'lucide-react';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#EAB308'];

export default function Portfolio() {
  const dispatch = useDispatch();
  const { holdings, summary, loading } = useSelector((state) => state.portfolio);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPortfolio());
  }, [dispatch]);

  const totalInvestment = summary?.totalInvestment || 0;
  const currentValue = summary?.totalCurrentValue || 0;
  const profitLoss = summary?.totalProfitLoss || 0;
  const percentageGain = summary?.totalPercentageGain || 0;
  const isPos = profitLoss >= 0;

  const pieData = holdings.map((h) => ({
    name: h.stock?.symbol || 'STOCK',
    value: h.currentValue
  }));

  const exportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('SB Stocks — Portfolio Performance Report', 14, 20);
      doc.setFontSize(11);
      doc.text(`Account Name: ${user?.name || 'Trader'} (${user?.email || ''})`, 14, 30);
      doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 14, 37);

      doc.text(`Total Invested Principal: $${totalInvestment.toLocaleString()}`, 14, 48);
      doc.text(`Current Portfolio Value: $${currentValue.toLocaleString()}`, 14, 55);
      doc.text(`Net Unrealized Profit/Loss: $${profitLoss.toLocaleString()} (${percentageGain}%)`, 14, 62);

      let y = 75;
      doc.setFontSize(12);
      doc.text('Holdings Breakdown:', 14, y);
      y += 8;

      doc.setFontSize(9);
      holdings.forEach((h, index) => {
        const symbol = h.stock?.symbol || 'UNKNOWN';
        const row = `${index + 1}. ${symbol} — Qty: ${h.quantity} | Avg Price: $${h.averagePrice} | Current: $${h.currentPrice} | Value: $${h.currentValue} | P&L: $${h.profitLoss} (${h.percentageGain}%)`;
        doc.text(row, 14, y);
        y += 7;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });

      doc.save('SB_Stocks_Portfolio_Report.pdf');
      toast.success('Portfolio PDF Report downloaded successfully!');
    } catch (err) {
      toast.error('Failed to generate PDF report');
    }
  };

  const exportCSV = () => {
    try {
      const data = holdings.map((h) => ({
        Symbol: h.stock?.symbol || '',
        CompanyName: h.stock?.companyName || '',
        Quantity: h.quantity,
        AveragePurchasePrice: h.averagePrice,
        CurrentPrice: h.currentPrice,
        InvestedAmount: h.investedAmount,
        CurrentValue: h.currentValue,
        ProfitLoss: h.profitLoss,
        PercentageGain: `${h.percentageGain}%`
      }));

      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'SB_Stocks_Portfolio.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Holdings CSV downloaded successfully!');
    } catch (err) {
      toast.error('Failed to export CSV');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top bar & export buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">My Portfolio</h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time valuation & performance metrics for your paper trading holdings
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-800 text-xs font-bold transition-all"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Export CSV
          </button>

          <button
            onClick={exportPDF}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            Export Report PDF
          </button>
        </div>
      </div>

      {/* 4 Performance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-2">
          <span className="text-xs font-semibold text-gray-400">TOTAL PORTFOLIO VALUE</span>
          <p className="text-2xl font-mono font-black text-white">
            ${Number(currentValue).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-gray-400">Current Market Worth</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-2">
          <span className="text-xs font-semibold text-gray-400">INVESTED PRINCIPAL</span>
          <p className="text-2xl font-mono font-black text-white">
            ${Number(totalInvestment).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-gray-400">Total Capital Deployed</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-2">
          <span className="text-xs font-semibold text-gray-400">UNREALIZED PROFIT / LOSS</span>
          <p className={`text-2xl font-mono font-black ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPos ? '+' : ''}${Number(profitLoss).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-gray-400">Real-time valuation</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-2">
          <span className="text-xs font-semibold text-gray-400">OVERALL RETURN (%)</span>
          <p className={`text-2xl font-mono font-black ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPos ? '+' : ''}{percentageGain}%
          </p>
          <span className="text-[10px] text-gray-400">Average Portfolio Return</span>
        </div>
      </div>

      {/* Chart & Table section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Holdings Table */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Holdings Breakdown</h2>
            <span className="text-xs text-gray-400">{holdings.length} active positions</span>
          </div>

          {holdings.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-xs text-gray-400">No active stock positions in your portfolio.</p>
              <Link
                to="/stocks"
                className="inline-block px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold"
              >
                Browse & Buy Stocks
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-[11px] uppercase tracking-wider text-gray-400 bg-gray-900/50">
                    <th className="py-3 px-4">Symbol</th>
                    <th className="py-3 px-4">Qty</th>
                    <th className="py-3 px-4 text-right">Avg Price</th>
                    <th className="py-3 px-4 text-right">Current</th>
                    <th className="py-3 px-4 text-right">Market Value</th>
                    <th className="py-3 px-4 text-right">P&L</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 text-xs">
                  {holdings.map((h) => {
                    const symbol = h.stock?.symbol || 'UNKNOWN';
                    const pos = h.profitLoss >= 0;
                    return (
                      <tr key={h._id} className="hover:bg-gray-900/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-white">{symbol}</td>
                        <td className="py-3.5 px-4 font-mono">{h.quantity}</td>
                        <td className="py-3.5 px-4 text-right font-mono">${h.averagePrice.toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                          ${h.currentPrice.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                          ${h.currentValue.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold">
                          <span className={pos ? 'text-emerald-400' : 'text-rose-400'}>
                            {pos ? '+' : ''}${h.profitLoss} ({pos ? '+' : ''}{h.percentageGain}%)
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            to={`/stocks/${symbol}`}
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
          )}
        </div>

        {/* Right Col: Allocation Donut Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-2">Asset Allocation</h3>
            <p className="text-xs text-gray-400 mb-6">Distribution across your portfolio holdings</p>

            {holdings.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400">No chart data available</div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111827',
                        borderColor: '#374151',
                        borderRadius: '0.75rem',
                        fontSize: '12px'
                      }}
                      formatter={(val) => [`$${Number(val).toFixed(2)}`, 'Market Value']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Legend */}
          {holdings.length > 0 && (
            <div className="space-y-2 border-t border-gray-800 pt-4 mt-4">
              {holdings.slice(0, 5).map((h, i) => (
                <div key={h._id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    ></span>
                    <span className="font-bold text-white">{h.stock?.symbol}</span>
                  </div>
                  <span className="font-mono text-gray-400">
                    {((h.currentValue / (currentValue || 1)) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
