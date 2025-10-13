import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import { Sparkles } from './icons/Icons';

const Toast: React.FC = () => {
  const notifications = useAppStore((state) => state.pendingNotifications);
  const clearNotification = useAppStore((state) => state.clearNotification);
  
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        clearNotification(0);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [notifications, clearNotification]);
  
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.slice(0, 3).map((notification, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative"
          >
            {notification.type === 'error' && (
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="font-semibold">Error</p>
                  <p className="text-sm">{notification.data.message}</p>
                </div>
              </div>
            )}
            
            {notification.type === 'success' && (
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
                <span className="text-xl">✅</span>
                <div>
                  <p className="font-semibold">Success</p>
                  <p className="text-sm">{notification.data.message}</p>
                </div>
              </div>
            )}
            
            {/* Close button */}
            <button
              onClick={() => clearNotification(index)}
              className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center text-white/70 hover:text-white rounded-full hover:bg-black/10 transition-colors"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      
    </div>
  );
};


export default Toast;

