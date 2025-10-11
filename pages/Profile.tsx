import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import { calculateLevel } from '../utils/xpCalculations';
import { ACHIEVEMENTS } from '../utils/achievements';
import AchievementBadge from '../components/AchievementBadge';
import LevelBadge from '../components/LevelBadge';
import XPBar from '../components/XPBar';
import ProgressRing from '../components/ProgressRing';

const Profile: React.FC = () => {
  const userName = useAppStore((state) => state.userName);
  const setUserName = useAppStore((state) => state.setUserName);
  const totalXP = useAppStore((state) => state.totalXP);
  const streak = useAppStore((state) => state.streak);
  const daysActive = useAppStore((state) => state.daysActive);
  const unlockedAchievements = useAppStore((state) => state.unlockedAchievements);
  const activities = useAppStore((state) => state.activities);
  const moduleDetails = useAppStore((state) => state.moduleDetails);
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userName);
  const [activeTab, setActiveTab] = useState<'progress' | 'achievements' | 'activity' | 'settings'>('progress');
  
  const levelInfo = calculateLevel(totalXP);
  
  const handleSaveName = () => {
    if (editedName.trim()) {
      setUserName(editedName.trim());
      setIsEditing(false);
    }
  };
  
  const modules = [
    { id: 'marketing-101', name: 'Marketing 101', icon: '📚' },
    { id: 'segmentation-lab', name: 'Segmentation Lab', icon: '🧪' },
    { id: 'targeting-lab', name: 'Targeting Lab', icon: '🎯' },
    { id: 'positioning-studio', name: 'Positioning Studio', icon: '💎' },
    { id: 'product-strategy', name: 'Product Strategy', icon: '📦' },
    { id: 'pricing-lab', name: 'Pricing Lab', icon: '💰' },
    { id: 'promotion-lab', name: 'Promotion Lab', icon: '📢' },
  ];
  
  const totalModules = modules.length;
  const completedModules = modules.filter(m => moduleDetails[m.id]?.completed).length;
  const overallProgress = (completedModules / totalModules) * 100;
  
  return (
    <div>
      <h1 className="text-3xl font-bold font-heading mb-8">Profile & Progress</h1>
      
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-coral-500 to-warm-yellow-500 p-8 rounded-2xl shadow-xl mb-8 text-white">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <img
              src="https://picsum.photos/seed/alex/150/150"
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="px-4 py-2 bg-white/20 border-2 border-white/50 rounded-lg text-white placeholder-white/70 outline-none focus:border-white"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="px-4 py-2 bg-white text-coral-500 font-semibold rounded-lg hover:bg-white/90 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditedName(userName);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <h2 className="text-3xl font-bold mb-2">
                {userName}
                <button
                  onClick={() => setIsEditing(true)}
                  className="ml-3 text-sm px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  Edit
                </button>
              </h2>
            )}
            <p className="text-white/90 mb-4">Marketing Enthusiast</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="font-semibold">{streak} Day Streak</p>
                  <p className="text-white/80 text-xs">Keep it going!</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="font-semibold">{daysActive} Days Active</p>
                  <p className="text-white/80 text-xs">Total engagement</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="font-semibold">{unlockedAchievements.length} Achievements</p>
                  <p className="text-white/80 text-xs">Keep collecting!</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <LevelBadge size="lg" showXP animated />
          </div>
        </div>
        
        <div className="mt-6">
          <XPBar />
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {(['progress', 'achievements', 'activity', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-coral-500 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'progress' && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Overall Progress */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold font-heading mb-6">Overall Progress</h3>
              <div className="flex items-center justify-center mb-4">
                <ProgressRing progress={overallProgress} size={200} strokeWidth={15} />
              </div>
              <p className="text-center text-slate-600 dark:text-slate-400">
                {completedModules} of {totalModules} modules completed
              </p>
            </div>
            
            {/* Module Breakdown */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold font-heading mb-6">Module Progress</h3>
              <div className="space-y-4">
                {modules.map((module) => {
                  const details = moduleDetails[module.id];
                  const progress = details?.progress || 0;
                  const completed = details?.completed || false;
                  const lastAccessed = details?.lastAccessed;
                  
                  return (
                    <div key={module.id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{module.icon}</span>
                          <div>
                            <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                              {module.name}
                            </h4>
                            {lastAccessed && (
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Last accessed: {new Date(lastAccessed).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        {completed && (
                          <span className="text-green-500 text-2xl">✓</span>
                        )}
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-coral-500 to-warm-yellow-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <p className="text-xs text-right mt-1 text-slate-500 dark:text-slate-400">
                        {progress}%
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg"
          >
            <h3 className="text-xl font-bold font-heading mb-6">
              Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {ACHIEVEMENTS.map((achievement) => {
                const unlocked = unlockedAchievements.some(a => a.id === achievement.id);
                return (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    unlocked={unlocked}
                    size="md"
                  />
                );
              })}
            </div>
          </motion.div>
        )}
        
        {activeTab === 'activity' && (
          <motion.div
            key="activity"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg"
          >
            <h3 className="text-xl font-bold font-heading mb-6">Recent Activity</h3>
            {activities.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                No activity yet. Complete labs and quizzes to see your progress here!
              </p>
            ) : (
              <div className="space-y-3">
                {activities.slice(0, 20).map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                      activity.type === 'lab_complete' ? 'bg-coral-100 dark:bg-coral-900/30' :
                      activity.type === 'quiz_complete' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      activity.type === 'level_up' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                      'bg-green-100 dark:bg-green-900/30'
                    }`}>
                      {activity.type === 'lab_complete' && '🧪'}
                      {activity.type === 'quiz_complete' && '📝'}
                      {activity.type === 'level_up' && '⬆️'}
                      {activity.type === 'achievement' && '🏆'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 dark:text-slate-100">
                        {activity.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {activity.xpEarned && activity.xpEarned > 0 && (
                      <div className="text-right">
                        <p className="text-sm font-bold text-coral-500">+{activity.xpEarned} XP</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
        
        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold font-heading mb-6">Appearance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">Theme</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Choose between light and dark mode
                    </p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="px-6 py-3 bg-slate-100 dark:bg-slate-700 rounded-lg font-semibold transition-colors hover:bg-slate-200 dark:hover:bg-slate-600"
                  >
                    {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold font-heading mb-6">Account Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-center">
                  <p className="text-3xl font-bold text-coral-500">{totalXP.toLocaleString()}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Total XP</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-center">
                  <p className="text-3xl font-bold text-deep-blue-500">{levelInfo.level}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Level</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-center">
                  <p className="text-3xl font-bold text-warm-yellow-500">{completedModules}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Completed</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-center">
                  <p className="text-3xl font-bold text-green-500">{unlockedAchievements.length}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Achievements</p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 p-6 rounded-2xl">
              <h3 className="text-xl font-bold font-heading mb-2 text-red-700 dark:text-red-400">
                Danger Zone
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Reset all progress data. This action cannot be undone.
              </p>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
              >
                Reset All Progress
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;

