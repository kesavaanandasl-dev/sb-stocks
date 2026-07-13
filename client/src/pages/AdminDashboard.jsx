import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdminAnalytics,
  fetchAllUsers,
  deleteUserAccount,
  changeUserRole
} from '../redux/adminSlice.js';
import { toast } from 'react-toastify';
import {
  ShieldAlert,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Trash2,
  UserCheck
} from 'lucide-react';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { analytics, users, loading } = useSelector((state) => state.admin);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users'

  useEffect(() => {
    dispatch(fetchAdminAnalytics());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await dispatch(changeUserRole({ userId, role: newRole })).unwrap();
      toast.success(`User role updated to ${newRole}`);
    } catch (err) {
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to delete account for ${name}?`)) return;
    try {
      await dispatch(deleteUserAccount(userId)).unwrap();
      toast.info(`Deleted user account: ${name}`);
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-amber-400 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6" />
            Platform Admin Console
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            System-wide trading analytics and user management controls
          </p>
        </div>

        <div className="flex items-center bg-gray-900 p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'overview' ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400'
            }`}
          >
            System Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'users' ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400'
            }`}
          >
            Manage Users ({users.length})
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-6">
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-2">
              <span className="text-xs font-bold text-gray-400">TOTAL REGISTERED USERS</span>
              <p className="text-2xl font-mono font-black text-white">{analytics?.totalUsers || 0}</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-2">
              <span className="text-xs font-bold text-gray-400">LISTED STOCKS</span>
              <p className="text-2xl font-mono font-black text-emerald-400">{analytics?.totalStocks || 0}</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-2">
              <span className="text-xs font-bold text-gray-400">TOTAL TRADE EXECUTIONS</span>
              <p className="text-2xl font-mono font-black text-white">{analytics?.totalTrades || 0}</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-2">
              <span className="text-xs font-bold text-gray-400">TOTAL CUMULATIVE VOLUME</span>
              <p className="text-2xl font-mono font-black text-amber-400">
                ${Number(analytics?.totalVolume || 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Recent System Trades */}
          <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-sm font-bold text-white">Recent Platform-Wide Trades</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-800 text-[11px] uppercase tracking-wider text-gray-400 bg-gray-900/50">
                    <th className="py-3 px-4">Trader</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Symbol</th>
                    <th className="py-3 px-4 text-right">Shares</th>
                    <th className="py-3 px-4 text-right">Fill Price</th>
                    <th className="py-3 px-4 text-right">Order Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {analytics?.recentTransactions?.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-900/60">
                      <td className="py-3 px-4 font-semibold text-gray-200">
                        {t.userId?.name || 'User'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            t.transactionType === 'BUY'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {t.transactionType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        {t.stockId?.symbol || 'STOCK'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono">{t.quantity}</td>
                      <td className="py-3 px-4 text-right font-mono">${t.price}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-white">
                        ${Number(t.totalAmount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Users Table */
        <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-sm font-bold text-white">Registered Users Account Directory</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-800 text-[11px] uppercase tracking-wider text-gray-400 bg-gray-900/50">
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4 text-right">Cash Balance</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-900/60">
                    <td className="py-3.5 px-4 font-bold text-white">{u.name}</td>
                    <td className="py-3.5 px-4 text-gray-400">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'ADMIN'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                      ${Number(u.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleRoleChange(u._id, u.role)}
                        className="px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-[11px] font-semibold text-gray-300"
                      >
                        Toggle Role
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u._id, u.name)}
                        className="p-1.5 rounded-lg bg-gray-900 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 border border-gray-800"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
