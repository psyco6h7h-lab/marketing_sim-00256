import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import { calculateLevel } from '../utils/xpCalculations';

interface LevelBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showXP?: boolean;
  animated?: boolean;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ 
  size = 'md', 
  showXP = false,
  animated = true 
}) => {
  const totalXP = useAppStore((state) => state.totalXP);
  const levelInfo = calculateLevel(totalXP);
  
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-20 h-20 text-2xl',
  };
  
  const BadgeContent = (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
      {/* Animated background glow */}
      {animated && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-coral-400 to-warm-yellow-400 rounded-full blur-sm opacity-50"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
      
      {/* Badge circle */}
      <div className="relative w-full h-full bg-gradient-to-br from-coral-500 to-warm-yellow-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-lg">
        <span className="font-bold text-white drop-shadow-md">
          {levelInfo.level}
        </span>
      </div>
    </div>
  );
  
  if (showXP) {
    return (
      <div className="flex flex-col items-center gap-1">
        {BadgeContent}
        <div className="text-center">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Level {levelInfo.level}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {totalXP.toLocaleString()} XP
          </p>
        </div>
      </div>
    );
  }
  
  return BadgeContent;
};

export default LevelBadge;

