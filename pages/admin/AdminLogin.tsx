import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../../services/storage';
import { useStore } from '../../context/StoreContext';
import { Lock } from 'lucide-react';
import { User } from '../../types';

export const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { refreshAuth } = useStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded demo credentials
    if (username === 'admin' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin-user',
        username: 'admin',
        name: 'Admin',
        role: 'admin'
      };
      StorageService.login(adminUser);
      refreshAuth();
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. (Try: admin / admin123)');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-primary-100 p-3 rounded-full text-primary-600 mb-3">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-sm text-gray-500">Please sign in to continue</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text" required
              value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
            />
          </div>
          <button type="submit" className="w-full bg-earth-800 text-white py-3 rounded-lg font-bold hover:bg-earth-900 transition-colors mt-2">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};