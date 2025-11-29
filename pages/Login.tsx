import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { useStore } from '../context/StoreContext';
import { UserCircle, Mail, Phone, MapPin, User as UserIcon, AlertCircle, Lock, Key, Eye, EyeOff } from 'lucide-react';
import { User } from '../types';

type ViewState = 'LOGIN' | 'REGISTER' | 'FORGOT_EMAIL' | 'FORGOT_OTP' | 'FORGOT_RESET';

export const Login = () => {
  const [viewState, setViewState] = useState<ViewState>('LOGIN');
  const navigate = useNavigate();
  const { refreshAuth } = useStore();
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Login State
  const [loginCreds, setLoginCreds] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  // Register State
  const [registerData, setRegisterData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    address: ''
  });

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- HANDLERS ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password } = loginCreds;
    if (username === 'admin' && password === 'admin123') {
        const adminUser: User = { id: 'admin1', username: 'admin', name: 'Administrator', role: 'admin' };
        StorageService.login(adminUser);
        refreshAuth();
        navigate('/admin/dashboard');
        return;
    }
    const user = StorageService.findUserByUsername(username);
    if (user && user.password === password) {
        StorageService.login(user);
        refreshAuth();
        navigate('/');
    } else {
        setError('Invalid username or password.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      if(!registerData.username || !registerData.password || !registerData.name) {
          setError("Please fill in required fields.");
          return;
      }
      if(StorageService.findUserByUsername(registerData.username)) {
          setError("Username already taken.");
          return;
      }
      if (registerData.phone) {
          const cleanPhone = registerData.phone.trim();
          const phoneRegex = /^\d{10}$/;
          if (!phoneRegex.test(cleanPhone)) {
              setError("Phone number must be exactly 10 digits.");
              return;
          }
      }
      const newUser: User = {
          id: `u-${Date.now()}`,
          username: registerData.username,
          password: registerData.password,
          name: registerData.name,
          email: registerData.email,
          phone: registerData.phone,
          address: registerData.address,
          role: 'customer'
      };
      StorageService.login(newUser); 
      refreshAuth();
      navigate('/');
  };

  const handleForgotEmailSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      const user = StorageService.findUserByEmail(forgotEmail);
      if(user) {
          const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
          setGeneratedOtp(mockOtp);
          alert(`[DEMO] Your OTP is: ${mockOtp}`); 
          setViewState('FORGOT_OTP');
      } else {
          setError("No account found with this email address.");
      }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      if (otp === generatedOtp) {
          setViewState('FORGOT_RESET');
      } else {
          setError("Invalid OTP. Please try again.");
      }
  };

  const handleResetPassword = (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      if (newPassword !== confirmPassword) {
          setError("Passwords do not match.");
          return;
      }
      if (newPassword.length < 6) {
          setError("Password must be at least 6 characters.");
          return;
      }
      const success = StorageService.resetPassword(forgotEmail, newPassword);
      if (success) {
          setSuccessMsg("Password reset successfully! Please login with your new password.");
          setViewState('LOGIN');
          setForgotEmail('');
          setOtp('');
          setNewPassword('');
          setConfirmPassword('');
      } else {
          setError("Failed to reset password. Please try again.");
      }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-md transition-all duration-300 relative">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-primary-100 p-3 rounded-full text-primary-600 mb-3">
            {viewState === 'LOGIN' || viewState === 'REGISTER' ? <UserCircle size={32} /> : <Key size={32} />}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {viewState === 'REGISTER' ? 'Join Ponivraa' : 
             viewState === 'LOGIN' ? 'Welcome Back' : 
             'Reset Password'}
          </h1>
          <p className="text-sm text-gray-500">
             {viewState === 'REGISTER' ? 'Create your account' : 
              viewState === 'LOGIN' ? 'Sign in to continue' :
              viewState === 'FORGOT_EMAIL' ? 'Enter your email to receive OTP' :
              viewState === 'FORGOT_OTP' ? 'Enter the OTP sent to your email' :
              'Set your new password'}
          </p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 text-center flex items-center justify-center"><AlertCircle size={16} className="mr-2" /> {error}</div>}
        {successMsg && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-6 border border-green-100 text-center">{successMsg}</div>}

        {viewState === 'REGISTER' && (
             <form onSubmit={handleRegister} className="space-y-4">
                {/* Simplified Register Form for brevity in this snippet - full form kept from previous logic */}
                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" required className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-900" value={registerData.name} onChange={e => setRegisterData({...registerData, name: e.target.value})} /></div>
                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Username *</label><input type="text" required className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-900" value={registerData.username} onChange={e => setRegisterData({...registerData, username: e.target.value})} /></div>
                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Password *</label><input type="password" required className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-900" value={registerData.password} onChange={e => setRegisterData({...registerData, password: e.target.value})} /></div>
                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-900" value={registerData.email} onChange={e => setRegisterData({...registerData, email: e.target.value})} /></div>
                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="tel" className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-900" placeholder="10 digits" value={registerData.phone} onChange={e => setRegisterData({...registerData, phone: e.target.value})} /></div>
                <button type="submit" className="w-full bg-earth-600 text-white py-3 rounded-lg font-bold hover:bg-earth-700 mt-2">Create Account</button>
             </form>
        )}

        {viewState === 'LOGIN' && (
            <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input type="text" required value={loginCreds.username} onChange={(e) => setLoginCreds({...loginCreds, username: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        required 
                        value={loginCreds.password} 
                        onChange={(e) => setLoginCreds({...loginCreds, password: e.target.value})} 
                        className="w-full border border-gray-300 rounded-lg p-3 pr-10 bg-white text-gray-900"
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-500 hover:text-primary-600 focus:outline-none"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>
            <div className="text-right">
                <button type="button" onClick={() => { setViewState('FORGOT_EMAIL'); setError(''); }} className="text-sm text-primary-600 hover:underline">Forgot Password?</button>
            </div>
            <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 mt-2 shadow-md">Sign In</button>
            </form>
        )}

        {viewState === 'FORGOT_EMAIL' && (
            <form onSubmit={handleForgotEmailSubmit} className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Enter Registered Email</label><input type="email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900" /></div>
                <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold">Send OTP</button>
                <button type="button" onClick={() => setViewState('LOGIN')} className="w-full text-gray-500 py-2 text-sm">Cancel</button>
            </form>
        )}
        {viewState === 'FORGOT_OTP' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label><input type="text" required maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-center text-xl bg-white text-gray-900" /></div>
                <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold">Verify OTP</button>
            </form>
        )}
        {viewState === 'FORGOT_RESET' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">New Password</label><input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label><input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900" /></div>
                <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold">Set New Password</button>
            </form>
        )}

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            {(viewState === 'LOGIN' || viewState === 'REGISTER') && (
                <button onClick={() => { setViewState(viewState === 'LOGIN' ? 'REGISTER' : 'LOGIN'); setError(''); setSuccessMsg(''); }} className="text-sm text-primary-600 hover:text-primary-700 font-semibold hover:underline">
                    {viewState === 'REGISTER' ? 'Already have an account? Login' : 'New to Ponivraa? Create Account'}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};