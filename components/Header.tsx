
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import { useAuth } from '../src/contexts/AuthContext';
import { Moon, Sun, LogOut, Menu } from './icons/Icons';

interface HeaderProps {
  onMenuClick?: () => void;
  showHamburger?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, showHamburger = false }) => {
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
    <header className={`${showHamburger ? 'h-14' : 'h-20'} flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30`}>
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Hamburger Menu - Mobile Only */}
        {showHamburger && (
          <motion.button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors touch-manipulation"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </motion.button>
        )}
        
        <h1 className={`${showHamburger ? 'text-lg' : 'text-xl sm:text-2xl'} font-bold font-heading text-slate-800 dark:text-slate-100 truncate`}>
          {getTitle()}
        </h1>
        
        {!showHamburger && user && (
          <span className="hidden sm:inline text-sm text-slate-600 dark:text-slate-400">
            Welcome, {user.displayName || user.email}
          </span>
        )}
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-4">
        <motion.button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors touch-manipulation"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="h-5 w-5 sm:h-6 sm:w-6" /> : <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-warm-yellow-400" />}
        </motion.button>
        
        {user && (
          <motion.button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400 touch-manipulation"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5 sm:h-6 sm:w-6" />
          </motion.button>
        )}
      </div>
    </header>
  );
};

export default Header;
