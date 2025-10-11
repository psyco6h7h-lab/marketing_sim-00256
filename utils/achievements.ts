// Achievement System

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: AchievementStats) => boolean;
  hidden?: boolean;
}

export interface AchievementStats {
  totalXP: number;
  level: number;
  labsCompleted: string[];
  quizzesCompleted: number;
  aiInteractions: number;
  streak: number;
  daysActive: number;
  perfectQuizzes: number;
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first lab',
    icon: '🎯',
    condition: (stats) => stats.labsCompleted.length >= 1,
  },
  {
    id: 'segmentation-master',
    title: 'Segmentation Master',
    description: 'Complete the Segmentation Lab',
    icon: '🧪',
    condition: (stats) => stats.labsCompleted.includes('segmentation-lab'),
  },
  {
    id: 'targeting-expert',
    title: 'Targeting Expert',
    description: 'Complete the Targeting Lab',
    icon: '🎯',
    condition: (stats) => stats.labsCompleted.includes('targeting-lab'),
  },
  {
    id: 'positioning-pro',
    title: 'Positioning Pro',
    description: 'Complete the Positioning Studio',
    icon: '💎',
    condition: (stats) => stats.labsCompleted.includes('positioning-studio'),
  },
  {
    id: 'product-genius',
    title: 'Product Genius',
    description: 'Complete the Product Strategy module',
    icon: '📦',
    condition: (stats) => stats.labsCompleted.includes('product-strategy'),
  },
  {
    id: 'pricing-wizard',
    title: 'Pricing Wizard',
    description: 'Complete the Pricing Lab',
    icon: '💰',
    condition: (stats) => stats.labsCompleted.includes('pricing-lab'),
  },
  {
    id: 'promotion-champion',
    title: 'Promotion Champion',
    description: 'Complete the Promotion Lab',
    icon: '📢',
    condition: (stats) => stats.labsCompleted.includes('promotion-lab'),
  },
  {
    id: 'knowledge-seeker',
    title: 'Knowledge Seeker',
    description: 'Complete Marketing 101',
    icon: '📚',
    condition: (stats) => stats.labsCompleted.includes('marketing-101'),
  },
  {
    id: 'lab-completion',
    title: 'Lab Master',
    description: 'Complete all 7 labs',
    icon: '🏆',
    condition: (stats) => stats.labsCompleted.length >= 7,
  },
  {
    id: 'marketing-master',
    title: 'Marketing Master',
    description: 'Complete all modules',
    icon: '👑',
    condition: (stats) => stats.labsCompleted.length >= 8,
  },
  {
    id: 'quiz-enthusiast',
    title: 'Quiz Enthusiast',
    description: 'Complete 10 quizzes',
    icon: '✅',
    condition: (stats) => stats.quizzesCompleted >= 10,
  },
  {
    id: 'perfect-score',
    title: 'Perfect Score',
    description: 'Get a perfect score on any quiz',
    icon: '💯',
    condition: (stats) => stats.perfectQuizzes >= 1,
  },
  {
    id: 'ai-collaborator',
    title: 'AI Collaborator',
    description: 'Use AI analysis 10 times',
    icon: '🤖',
    condition: (stats) => stats.aiInteractions >= 10,
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    condition: (stats) => stats.streak >= 7,
  },
  {
    id: 'dedicated-learner',
    title: 'Dedicated Learner',
    description: 'Be active for 14 days',
    icon: '📅',
    condition: (stats) => stats.daysActive >= 14,
  },
  {
    id: 'level-5',
    title: 'Rising Star',
    description: 'Reach Level 5',
    icon: '⭐',
    condition: (stats) => stats.level >= 5,
  },
  {
    id: 'level-10',
    title: 'Marketing Pro',
    description: 'Reach Level 10',
    icon: '🌟',
    condition: (stats) => stats.level >= 10,
  },
  {
    id: 'level-15',
    title: 'Elite Marketer',
    description: 'Reach Level 15',
    icon: '💫',
    condition: (stats) => stats.level >= 15,
  },
  {
    id: 'level-20',
    title: 'Marketing Legend',
    description: 'Reach Level 20',
    icon: '🏅',
    condition: (stats) => stats.level >= 20,
  },
  {
    id: 'xp-1000',
    title: 'XP Collector',
    description: 'Earn 1,000 XP',
    icon: '💎',
    condition: (stats) => stats.totalXP >= 1000,
  },
];

export function checkAchievements(
  stats: AchievementStats,
  currentUnlocked: UnlockedAchievement[]
): Achievement[] {
  const unlockedIds = new Set(currentUnlocked.map(a => a.id));
  const newlyUnlocked: Achievement[] = [];
  
  for (const achievement of ACHIEVEMENTS) {
    if (!unlockedIds.has(achievement.id) && achievement.condition(stats)) {
      newlyUnlocked.push(achievement);
    }
  }
  
  return newlyUnlocked;
}

export function getAchievementProgress(achievement: Achievement, stats: AchievementStats): number {
  // Simple progress calculation for numeric achievements
  if (achievement.id === 'quiz-enthusiast') {
    return Math.min((stats.quizzesCompleted / 10) * 100, 100);
  }
  if (achievement.id === 'ai-collaborator') {
    return Math.min((stats.aiInteractions / 10) * 100, 100);
  }
  if (achievement.id === 'week-warrior') {
    return Math.min((stats.streak / 7) * 100, 100);
  }
  if (achievement.id === 'dedicated-learner') {
    return Math.min((stats.daysActive / 14) * 100, 100);
  }
  
  return achievement.condition(stats) ? 100 : 0;
}

