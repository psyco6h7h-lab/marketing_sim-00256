import React from 'react';
import { motion } from 'framer-motion';
import type { Achievement } from '../utils/achievements';

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
  progress?: number;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  unlocked,
  progress = 0,
  size = 'md',
  showProgress = false,
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 text-4xl',
    lg: 'w-32 h-32 text-5xl',
  };
  
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      whileHover={{ scale: unlocked ? 1.05 : 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Badge Icon */}
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-xl flex items-center justify-center ${
            unlocked
              ? 'bg-gradient-to-br from-coral-400 to-warm-yellow-400 shadow-lg'
              : 'bg-slate-200 dark:bg-slate-700 grayscale opacity-50'
          } transition-all duration-300`}
        >
          <span className={unlocked ? '' : 'opacity-30'}>
            {achievement.icon}
          </span>
        </div>
        
        {/* Lock overlay for locked achievements */}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 rounded-xl">
            <span className="text-2xl">🔒</span>
          </div>
        )}
        
        {/* Progress ring for partially completed achievements */}
        {!unlocked && showProgress && progress > 0 && (
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-coral-500"
              strokeDasharray={`${progress * 2.83} 283`}
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      
      {/* Achievement Info */}
      <div className="text-center max-w-[120px]">
        <h4 className={`${textSizes[size]} font-semibold ${unlocked ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-500'}`}>
          {achievement.title}
        </h4>
        <p className={`${textSizes[size]} text-slate-500 dark:text-slate-400 mt-1`}>
          {achievement.description}
        </p>
        {!unlocked && showProgress && progress > 0 && (
          <p className="text-xs text-coral-500 dark:text-coral-400 mt-1 font-semibold">
            {Math.round(progress)}%
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default AchievementBadge;

