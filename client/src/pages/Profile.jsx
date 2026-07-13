import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../redux/authSlice.js';
import { toast } from 'react-toastify';
import { User, Mail, Shield, Image, Save } from 'lucide-react';

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Profile Settings</h1>
        <p className="text-xs text-gray-400 mt-1">Manage your account credentials and trading profile</p>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-800">
          <img
            src={
              formData.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
            }
            alt={user?.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
          />
          <div>
            <h2 className="text-lg font-bold text-white">{user?.name}</h2>
            <p className="text-xs text-gray-400">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 uppercase">
              {user?.role} ACCOUNT
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">Display Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">Email Address (Read-Only)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">Avatar Image URL</label>
            <div className="relative">
              <Image className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Profile Changes
          </button>
        </form>
      </div>
    </div>
  );
}
