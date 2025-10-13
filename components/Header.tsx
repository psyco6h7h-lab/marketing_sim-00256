
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import { useAuth } from '../src/contexts/AuthContext';
import { Moon, Sun, LogOut } from './icons/Icons';

const Header: React.FC = () => {
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const getTitle = () => {
    const path = location.pathname.split('/').pop() || 'dashboard';
    return path
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold font-heading text-slate-800 dark:text-slate-100">{getTitle()}</h1>
        {user && (
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Welcome, {user.displayName || user.email}
          </span>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <motion.button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6 text-warm-yellow-400" />}
        </motion.button>
        
        {user && (
          <motion.button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Logout"
          >
            <LogOut className="h-6 w-6" />
          </motion.button>
        )}
      </div>
    </header>
  );
};

export default Header;
