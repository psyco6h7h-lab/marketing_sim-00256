// XP and Leveling System

export const XP_PER_LEVEL = [
  0,     // Level 1
  100,   // Level 2
  250,   // Level 3
  450,   // Level 4
  700,   // Level 5
  1000,  // Level 6
  1350,  // Level 7
  1750,  // Level 8
  2200,  // Level 9
  2700,  // Level 10
  3250,  // Level 11
  3850,  // Level 12
  4500,  // Level 13
  5200,  // Level 14
  5950,  // Level 15
  6750,  // Level 16
  7600,  // Level 17
  8500,  // Level 18
  9450,  // Level 19
  10450, // Level 20
];

export const MAX_LEVEL = 20;

export interface LevelInfo {
  level: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpNeededForNextLevel: number;
  progressPercent: number;
}

export function calculateLevel(totalXP: number): LevelInfo {
  let level = 1;
  
  for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
    if (totalXP >= XP_PER_LEVEL[i]) {
      level = i + 1;
      break;
    }
  }
  
  if (level >= MAX_LEVEL) {
    return {
      level: MAX_LEVEL,
      currentXP: totalXP,
      xpForCurrentLevel: XP_PER_LEVEL[MAX_LEVEL - 1],
      xpForNextLevel: XP_PER_LEVEL[MAX_LEVEL - 1],
      xpNeededForNextLevel: 0,
      progressPercent: 100,
    };
  }
  
  const xpForCurrentLevel = XP_PER_LEVEL[level - 1];
  const xpForNextLevel = XP_PER_LEVEL[level];
  const xpNeededForNextLevel = xpForNextLevel - totalXP;
  const xpInCurrentLevel = totalXP - xpForCurrentLevel;
  const xpRequiredForCurrentLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercent = (xpInCurrentLevel / xpRequiredForCurrentLevel) * 100;
  
  return {
    level,
    currentXP: totalXP,
    xpForCurrentLevel,
    xpForNextLevel,
    xpNeededForNextLevel,
    progressPercent,
  };
}

// XP Rewards
export const XP_REWARDS = {
  COMPLETE_LAB: 100,
  COMPLETE_QUIZ: 50,
  AI_INTERACTION: 25,
  FIRST_TIME_BONUS: 50,
  PERFECT_QUIZ: 25,
  DAILY_LOGIN: 10,
  WEEK_STREAK: 50,
};

export function getXPReward(action: keyof typeof XP_REWARDS): number {
  return XP_REWARDS[action];
}

