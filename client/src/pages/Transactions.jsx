import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import { toast } from 'react-toastify';
import Papa from 'papaparse';
import {
  History,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Filter
} from 'lucide-react';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'BUY' | 'SELL'

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const params = filterType === 'ALL' ? {} : { type: filterType };
      const response = await api.get('/transactions', { params });
      setTransactions(response.data || []);
    } catch (err) {
      toast.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [filterType]);

  const exportCSV = () => {
    try {
      const data = transactions.map((t) => ({
        Date: new Date(t.createdAt).toLocaleString(),
        Type: t.transactionType,
        Symbol: t.stockId?.symbol || '',
        Company: t.stockId?.companyName || '',
        Quantity: t.quantity,
        ExecutionPrice: t.price,
        TotalOrderAmount: t.totalAmount
      }));

      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'SB_Stocks_Transactions.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Transaction history exported as CSV');
    } catch (err) {
      toast.error('Failed to export CSV');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Transaction Ledger</h1>
          <p className="text-xs text-gray-400 mt-1">
            Complete immutable audit trail of your paper trading execution orders
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-900 border border-gray-800 rounded-xl p-1">
            {['ALL', 'BUY', 'SELL'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  filterType === type
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-800 text-xs font-bold transition-all"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-gray-400">Loading transaction records...</div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <p className="text-xs text-gray-400">No transactions recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-[11px] uppercase tracking-wider text-gray-400 bg-gray-900/50">
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Symbol</th>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4 text-right">Shares</th>
                  <th className="py-3.5 px-4 text-right">Fill Price</th>
                  <th className="py-3.5 px-4 text-right">Total Amount</th>
                  <th className="py-3.5 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-xs">
                {transactions.map((t) => {
                  const isBuy = t.transactionType === 'BUY';
                  return (
                    <tr key={t._id} className="hover:bg-gray-900/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[10px] ${
                            isBuy
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {isBuy ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          {t.transactionType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {t.stockId?.symbol || 'UNKNOWN'}
                      </td>
                      <td className="py-3.5 px-4 text-gray-300">
                        {t.stockId?.companyName || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold">
                        {t.quantity}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-gray-300">
                        ${Number(t.price).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                        ${Number(t.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-right text-gray-400 text-[11px]">
                        {new Date(t.createdAt).toLocaleString()}
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
