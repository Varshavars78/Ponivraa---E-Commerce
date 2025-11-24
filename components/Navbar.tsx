import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User as UserIcon, LogOut, Globe } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { StorageService } from '../services/storage';
import { Logo } from './Logo';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, user, isAdmin, refreshAuth } = useStore();
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    StorageService.logout();
    refreshAuth();
    navigate('/');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  const NavLink = ({ to, children }: { to: string; children?: React.ReactNode }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`${
          isActive ? 'text-primary-700 font-bold' : 'text-gray-600 hover:text-primary-600'
        } transition-colors`}
        onClick={() => setIsOpen(false)}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <Logo className="w-10 h-10" />
            <span className="text-2xl font-bold text-earth-900 tracking-tight">Ponivraa</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/">{t('Home')}</NavLink>
            <NavLink to="/shop">{t('Shop')}</NavLink>
            <NavLink to="/about">{t('About Us')}</NavLink>
            {isAdmin && <NavLink to="/admin/dashboard">{t('Admin Panel')}</NavLink>}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
                onClick={toggleLanguage}
                className="flex items-center space-x-1 text-gray-600 hover:text-primary-700 px-2 py-1 rounded-md hover:bg-gray-100"
                title="Toggle Language"
            >
                <Globe size={18} />
                <span className="text-sm font-medium uppercase">{language}</span>
            </button>

            {user ? (
               <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-700 group relative">
                     <Link to="/profile" className="flex items-center space-x-2 hover:bg-gray-100 px-2 py-1 rounded-full transition-colors">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="hidden lg:inline font-medium">{user.name}</span>
                     </Link>
                  </div>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-red-600" title={t('Logout')}>
                    <LogOut size={20} />
                  </button>
               </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 text-gray-600 hover:text-primary-700">
                <UserIcon size={20} />
                <span className="text-sm font-medium">{t('Login')}</span>
              </Link>
            )}
            
            <Link to="/cart" className="relative text-gray-600 hover:text-primary-700">
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-earth-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
             <button onClick={toggleLanguage} className="text-gray-600 font-bold uppercase text-xs border border-gray-300 px-2 py-1 rounded">
                {language}
             </button>
             <Link to="/cart" className="relative text-gray-600 hover:text-primary-700">
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-earth-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-primary-700">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <NavLink to="/">{t('Home')}</NavLink>
            <NavLink to="/shop">{t('Shop')}</NavLink>
            <NavLink to="/about">{t('About Us')}</NavLink>
            {isAdmin && <NavLink to="/admin/dashboard">{t('Admin Panel')}</NavLink>}
            
            <div className="border-t pt-2 mt-2">
               {user ? (
                  <>
                    <Link to="/profile" className="flex items-center space-x-2 text-gray-700 px-3 py-2 hover:bg-gray-50" onClick={() => setIsOpen(false)}>
                         <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-primary-700">{t('My Profile')}</span>
                    </Link>
                    <button onClick={handleLogout} className="flex items-center space-x-2 text-red-600 w-full px-3 py-2 hover:bg-red-50">
                      <LogOut size={18} /> <span>{t('Logout')}</span>
                    </button>
                  </>
               ) : (
                  <Link to="/login" className="flex items-center space-x-2 text-gray-600 px-3 py-2" onClick={() => setIsOpen(false)}>
                    <UserIcon size={18} /> <span>{t('Login')}</span>
                  </Link>
               )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};