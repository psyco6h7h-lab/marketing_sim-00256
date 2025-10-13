
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateLevel, getXPReward } from '../utils/xpCalculations';
import { checkAchievements, type UnlockedAchievement, type AchievementStats, type Achievement } from '../utils/achievements';

type Theme = 'light' | 'dark';

interface Activity {
  id: string;
  type: 'lab_complete' | 'quiz_complete' | 'level_up' | 'achievement';
  title: string;
  timestamp: number;
  xpEarned?: number;
}

interface LeaderboardEntry {
  id: string;
  userName: string;
  concept: string;
  accuracy: number;
  timeTaken: number; // in seconds
  questionsAnswered: number;
  difficulty: string;
  mode: 'timed' | 'practice';
  timestamp: number;
}

interface QuizAnalytics {
  concept: string;
  totalQuizzes: number;
  totalQuestions: number;
  correctAnswers: number;
  totalTime: number;
  averageAccuracy: number;
  averageTimePerQuestion: number;
  bestAccuracy: number;
  fastestTime: number;
  difficultyBreakdown: { [difficulty: string]: number };
  lastQuizDate: number;
}

interface LabData {
  segmentation?: {
    selectedPersonas: Array<{id: string, name: string}>;
    segmentName: string;
    marketDescription: string;
  };
  targeting?: {
    targetSegments: string[];
    strategy: string;
    budgetAllocation: { [key: string]: number };
  };
  positioning?: {
    statement: string;
    priceLevel: number;
    qualityLevel: number;
    mapType: string;
  };
  product?: {
    name: string;
    coreValue: string;
    qualityLevel: number;
    features: string[];
    targetMarket: string;
  };
  pricing?: {
    price: number;
    strategy: string;
    margin: number;
    productName: string;
    targetMarket: string;
  };
  promotion?: {
    budget: number;
    mix: { [key: string]: number };
    tactics: string[];
    objective: string;
  };
}

interface ModuleProgress {
  progress: number;
  completed: boolean;
  completedAt?: number;
  timeSpent?: number;
  lastAccessed?: number;
}

interface CustomPersona {
  id: string;
  name: string;
  age: string;
  occupation: string;
  income: string;
  location: string;
  hobbies: string;
  painPoints: string;
  goals: string;
  createdAt: number;
  isAIGenerated?: boolean;
}

interface AppState {
  // Theme
  theme: Theme;
  toggleTheme: () => void;
  
  // Custom Personas
  customPersonas: CustomPersona[];
  addCustomPersona: (persona: Omit<CustomPersona, 'id' | 'createdAt'>) => void;
  
  // User Info
  userName: string;
  setUserName: (name: string) => void;
  
  // XP and Leveling
  totalXP: number;
  earnXP: (amount: number, source: string) => void;
  
  // Progress
  userProgress: { [key: string]: number };
  setProgress: (moduleId: string, progress: number) => void;
  moduleDetails: { [key: string]: ModuleProgress };
  completeModule: (moduleId: string) => void;
  updateModuleAccess: (moduleId: string) => void;
  
  // Achievements
  unlockedAchievements: UnlockedAchievement[];
  unlockAchievement: (achievementId: string) => void;
  checkAndUnlockAchievements: () => Achievement[];
  
  // Stats
  quizzesCompleted: number;
  incrementQuizzes: (perfect?: boolean) => void;
  aiInteractions: number;
  incrementAIInteractions: () => void;
  perfectQuizzes: number;
  
  // Streak
  streak: number;
  lastLogin: number;
  daysActive: number;
  updateStreak: () => void;
  
  // Activity Feed
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  
  // Notifications
  pendingNotifications: Array<{ type: 'error' | 'success'; data: any }>;
  addNotification: (notification: { type: 'error' | 'success'; data: any }) => void;
  clearNotification: (index: number) => void;
  
  // Leaderboards
  leaderboards: { [concept: string]: LeaderboardEntry[] };
  addLeaderboardEntry: (entry: Omit<LeaderboardEntry, 'id' | 'timestamp'>) => void;
  getLeaderboard: (concept: string, mode?: 'timed' | 'practice') => LeaderboardEntry[];
  
  // Quiz Analytics
  quizAnalytics: { [concept: string]: QuizAnalytics };
  updateQuizAnalytics: (concept: string, quizData: {
    questionsAnswered: number;
    correctAnswers: number;
    timeTaken: number;
    accuracy: number;
    difficulty: string;
  }) => void;
  getQuizAnalytics: (concept: string) => QuizAnalytics | null;
  
  // Cross-Lab Data Flow
  labData: LabData;
  saveLabData: (lab: keyof LabData, data: any) => void;
  getLabData: (lab: keyof LabData) => any;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      
      // Custom Personas
      customPersonas: [],
      addCustomPersona: (personaData) => {
        const newPersona: CustomPersona = {
          ...personaData,
          id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now()
        };
        set((state) => ({
          customPersonas: [...state.customPersonas, newPersona]
        }));
      },
      
      // User Info
      userName: 'Alex Doe',
      setUserName: (name) => set({ userName: name }),
      
      // XP and Leveling
      totalXP: 0,
      earnXP: (amount, source) => {
        const state = get();
        const oldLevel = calculateLevel(state.totalXP).level;
        const newTotalXP = state.totalXP + amount;
        const newLevel = calculateLevel(newTotalXP).level;
        
        set({ totalXP: newTotalXP });
        
        // Check for level up
        if (newLevel > oldLevel) {
          get().addActivity({
            type: 'level_up',
            title: `Reached Level ${newLevel}!`,
            xpEarned: 0,
          });
        }
        
        // Check for new achievements (but don't show notifications)
        get().checkAndUnlockAchievements();
      },
      
      // Progress
      userProgress: {
        'marketing-101': 35,
        'segmentation-lab': 70,
        'targeting-lab': 0,
        'pricing-lab': 15,
      },
      setProgress: (moduleId, progress) =>
        set((state) => ({
          userProgress: { ...state.userProgress, [moduleId]: progress },
        })),
      moduleDetails: {},
      completeModule: (moduleId) => {
        const state = get();
        const now = Date.now();
        const isFirstTime = !state.moduleDetails[moduleId]?.completed;
        
        set({
          moduleDetails: {
            ...state.moduleDetails,
            [moduleId]: {
              ...state.moduleDetails[moduleId],
              progress: 100,
              completed: true,
              completedAt: now,
            },
          },
          userProgress: {
            ...state.userProgress,
            [moduleId]: 100,
          },
        });
        
        // Award XP
        const xpReward = getXPReward('COMPLETE_LAB') + (isFirstTime ? getXPReward('FIRST_TIME_BONUS') : 0);
        get().earnXP(xpReward, `Completed ${moduleId}`);
        
        // Add activity
        get().addActivity({
          type: 'lab_complete',
          title: `Completed ${moduleId.replace(/-/g, ' ')}`,
          xpEarned: xpReward,
        });
      },
      updateModuleAccess: (moduleId) => {
        const state = get();
        set({
          moduleDetails: {
            ...state.moduleDetails,
            [moduleId]: {
              ...state.moduleDetails[moduleId],
              lastAccessed: Date.now(),
            },
          },
        });
      },
      
      // Achievements
      unlockedAchievements: [],
      unlockAchievement: (achievementId) => {
        const state = get();
        if (!state.unlockedAchievements.find(a => a.id === achievementId)) {
          set({
            unlockedAchievements: [
              ...state.unlockedAchievements,
              { id: achievementId, unlockedAt: Date.now() },
            ],
          });
        }
      },
      checkAndUnlockAchievements: () => {
        const state = get();
        const levelInfo = calculateLevel(state.totalXP);
        
        const stats: AchievementStats = {
          totalXP: state.totalXP,
          level: levelInfo.level,
          labsCompleted: Object.keys(state.moduleDetails).filter(
            key => state.moduleDetails[key].completed
          ),
          quizzesCompleted: state.quizzesCompleted,
          aiInteractions: state.aiInteractions,
          streak: state.streak,
          daysActive: state.daysActive,
          perfectQuizzes: state.perfectQuizzes,
        };
        
        const newAchievements = checkAchievements(stats, state.unlockedAchievements);
        
        newAchievements.forEach(achievement => {
          get().unlockAchievement(achievement.id);
          get().addActivity({
            type: 'achievement',
            title: `Unlocked: ${achievement.title}`,
          });
        });
        
        return newAchievements;
      },
      
      // Stats
      quizzesCompleted: 0,
      incrementQuizzes: (perfect = false) => {
        set((state) => ({
          quizzesCompleted: state.quizzesCompleted + 1,
          perfectQuizzes: perfect ? state.perfectQuizzes + 1 : state.perfectQuizzes,
        }));
        
        const xpReward = getXPReward('COMPLETE_QUIZ') + (perfect ? getXPReward('PERFECT_QUIZ') : 0);
        get().earnXP(xpReward, 'Completed quiz');
        
        get().addActivity({
          type: 'quiz_complete',
          title: perfect ? 'Aced a quiz!' : 'Completed a quiz',
          xpEarned: xpReward,
        });
      },
      aiInteractions: 0,
      incrementAIInteractions: () => {
        set((state) => ({ aiInteractions: state.aiInteractions + 1 }));
        get().earnXP(getXPReward('AI_INTERACTION'), 'AI Analysis');
      },
      perfectQuizzes: 0,
      
      // Streak
      streak: 0,
      lastLogin: Date.now(),
      daysActive: 1,
      updateStreak: () => {
        const state = get();
        const now = Date.now();
        const lastLoginDate = new Date(state.lastLogin).setHours(0, 0, 0, 0);
        const todayDate = new Date(now).setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((todayDate - lastLoginDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) {
          // Same day, do nothing
          return;
        } else if (daysDiff === 1) {
          // Consecutive day
          const newStreak = state.streak + 1;
          set({
            streak: newStreak,
            lastLogin: now,
            daysActive: state.daysActive + 1,
          });
          
          get().earnXP(getXPReward('DAILY_LOGIN'), 'Daily login');
          
          if (newStreak === 7) {
            get().earnXP(getXPReward('WEEK_STREAK'), '7-day streak bonus!');
          }
        } else {
          // Streak broken
          set({
            streak: 1,
            lastLogin: now,
            daysActive: state.daysActive + 1,
          });
          get().earnXP(getXPReward('DAILY_LOGIN'), 'Daily login');
        }
      },
      
      // Activity Feed
      activities: [],
      addActivity: (activity) => {
        set((state) => ({
          activities: [
            {
              ...activity,
              id: `${Date.now()}-${Math.random()}`,
              timestamp: Date.now(),
            },
            ...state.activities.slice(0, 49), // Keep last 50 activities
          ],
        }));
      },
      
      // Notifications
      pendingNotifications: [],
      addNotification: (notification) => {
        set((state) => ({
          pendingNotifications: [...state.pendingNotifications, notification],
        }));
      },
      clearNotification: (index) => {
        set((state) => ({
          pendingNotifications: state.pendingNotifications.filter((_, i) => i !== index),
        }));
      },
      
      // Leaderboards
      leaderboards: {},
      addLeaderboardEntry: (entry) => {
        const state = get();
        const newEntry: LeaderboardEntry = {
          ...entry,
          id: `${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
        };
        
        const conceptLeaderboard = state.leaderboards[entry.concept] || [];
        const updatedLeaderboard = [...conceptLeaderboard, newEntry]
          .sort((a, b) => {
            // Sort by accuracy first, then by time taken (for timed mode)
            if (a.accuracy !== b.accuracy) {
              return b.accuracy - a.accuracy;
            }
            if (entry.mode === 'timed') {
              return a.timeTaken - b.timeTaken;
            }
            return b.questionsAnswered - a.questionsAnswered;
          })
          .slice(0, 10); // Keep top 10
        
        set({
          leaderboards: {
            ...state.leaderboards,
            [entry.concept]: updatedLeaderboard,
          },
        });
      },
      getLeaderboard: (concept, mode) => {
        const state = get();
        const conceptLeaderboard = state.leaderboards[concept] || [];
        
        if (mode) {
          return conceptLeaderboard.filter(entry => entry.mode === mode);
        }
        
        return conceptLeaderboard;
      },
      
      // Quiz Analytics
      quizAnalytics: {},
      updateQuizAnalytics: (concept, quizData) => {
        const state = get();
        const existing = state.quizAnalytics[concept];
        
        if (existing) {
          const updated = {
            ...existing,
            totalQuizzes: existing.totalQuizzes + 1,
            totalQuestions: existing.totalQuestions + quizData.questionsAnswered,
            correctAnswers: existing.correctAnswers + quizData.correctAnswers,
            totalTime: existing.totalTime + quizData.timeTaken,
            averageAccuracy: ((existing.averageAccuracy * existing.totalQuizzes) + quizData.accuracy) / (existing.totalQuizzes + 1),
            averageTimePerQuestion: (existing.totalTime + quizData.timeTaken) / (existing.totalQuestions + quizData.questionsAnswered),
            bestAccuracy: Math.max(existing.bestAccuracy, quizData.accuracy),
            fastestTime: existing.fastestTime === 0 ? quizData.timeTaken : Math.min(existing.fastestTime, quizData.timeTaken),
            difficultyBreakdown: {
              ...existing.difficultyBreakdown,
              [quizData.difficulty]: (existing.difficultyBreakdown[quizData.difficulty] || 0) + 1
            },
            lastQuizDate: Date.now()
          };
          
          set({
            quizAnalytics: {
              ...state.quizAnalytics,
              [concept]: updated
            }
          });
        } else {
          const newAnalytics: QuizAnalytics = {
            concept,
            totalQuizzes: 1,
            totalQuestions: quizData.questionsAnswered,
            correctAnswers: quizData.correctAnswers,
            totalTime: quizData.timeTaken,
            averageAccuracy: quizData.accuracy,
            averageTimePerQuestion: quizData.timeTaken / quizData.questionsAnswered,
            bestAccuracy: quizData.accuracy,
            fastestTime: quizData.timeTaken,
            difficultyBreakdown: {
              [quizData.difficulty]: 1
            },
            lastQuizDate: Date.now()
          };
          
          set({
            quizAnalytics: {
              ...state.quizAnalytics,
              [concept]: newAnalytics
            }
          });
        }
      },
      getQuizAnalytics: (concept) => {
        const state = get();
        return state.quizAnalytics[concept] || null;
      },
      
      // Cross-Lab Data Flow
      labData: {},
      saveLabData: (lab, data) => {
        set((state) => ({
          labData: {
            ...state.labData,
            [lab]: data
          }
        }));
      },
      getLabData: (lab) => {
        const state = get();
        return state.labData[lab] || null;
      },
    }),
    {
      name: 'marketing-simulator-storage',
    }
  )
);
