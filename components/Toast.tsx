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
            {notification.type === 'xp' && (
              <div className="bg-gradient-to-r from-coral-500 to-coral-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                <div>
                  <p className="font-semibold">+{notification.data.amount} XP</p>
                  <p className="text-xs opacity-90">{notification.data.source}</p>
                </div>
              </div>
            )}
            
            {notification.type === 'level' && (
              <div className="bg-gradient-to-r from-warm-yellow-400 to-warm-yellow-500 text-slate-900 px-4 py-3 rounded-lg shadow-lg">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="font-bold text-lg">Level Up!</p>
                    <p className="text-sm">You reached Level {notification.data.level}</p>
                  </div>
                </motion.div>
              </div>
            )}
            
            {notification.type === 'achievement' && (
              <div className="bg-gradient-to-r from-deep-blue-500 to-deep-blue-600 text-white px-4 py-3 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{notification.data.icon}</span>
                  <div>
                    <p className="font-semibold">Achievement Unlocked!</p>
                    <p className="text-sm">{notification.data.title}</p>
                  </div>
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
      
      {/* Confetti for level up */}
      <AnimatePresence>
        {notifications.some(n => n.type === 'level') && <Confetti />}
      </AnimatePresence>
    </div>
  );
};

// Simple confetti effect
const Confetti: React.FC = () => {
  const colors = ['#ff6d4d', '#facc15', '#4fabf7', '#ff8f72'];
  const confettiPieces = Array.from({ length: 50 });
  
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {confettiPieces.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            left: `${Math.random() * 100}%`,
            top: '-10px',
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 100,
            opacity: 0,
            rotate: Math.random() * 720,
            x: (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            ease: 'easeIn',
            delay: Math.random() * 0.3,
          }}
        />
      ))}
    </div>
  );
};

export default Toast;

