import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import { calculateLevel } from '../utils/xpCalculations';

interface XPBarProps {
  showLabel?: boolean;
  compact?: boolean;
}

const XPBar: React.FC<XPBarProps> = ({ showLabel = true, compact = false }) => {
  const totalXP = useAppStore((state) => state.totalXP);
  const levelInfo = calculateLevel(totalXP);
  
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-coral-500 to-warm-yellow-400"
            initial={{ width: 0 }}
            animate={{ width: `${levelInfo.progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
          {levelInfo.xpNeededForNextLevel > 0 ? `${levelInfo.xpNeededForNextLevel} XP` : 'MAX'}
        </span>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Level {levelInfo.level}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {levelInfo.xpNeededForNextLevel > 0 
              ? `${levelInfo.xpNeededForNextLevel} XP to level ${levelInfo.level + 1}`
              : 'Max Level Reached!'
            }
          </span>
        </div>
      )}
      <div className="relative bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-coral-500 via-warm-yellow-400 to-coral-500"
          initial={{ width: 0 }}
          animate={{ width: `${levelInfo.progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white drop-shadow-md">
            {Math.round(levelInfo.progressPercent)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default XPBar;

