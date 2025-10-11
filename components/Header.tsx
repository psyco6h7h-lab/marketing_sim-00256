
import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import { Moon, Sun } from './icons/Icons';

const Header: React.FC = () => {
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const location = useLocation();
  
  const getTitle = () => {
    const path = location.pathname.split('/').pop() || 'dashboard';
    return path
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0">
      <h1 className="text-2xl font-bold font-heading text-slate-800 dark:text-slate-100">{getTitle()}</h1>
      <div className="flex items-center space-x-4">
        <motion.button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6 text-warm-yellow-400" />}
        </motion.button>
        {/* Other header items can go here */}
      </div>
    </header>
  );
};

export default Header;
