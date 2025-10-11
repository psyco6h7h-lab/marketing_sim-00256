import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import { calculateLevel } from '../utils/xpCalculations';
import ProgressRing from '../components/ProgressRing';
import LevelBadge from '../components/LevelBadge';
import { BookOpen, FlaskConical, Target, Gem, Package, DollarSign, Megaphone, Zap } from '../components/icons/Icons';
import type { Module } from '../types';

const modules: Omit<Module, 'id'>[] = [
    { title: "Learn Marketing", description: "Master the fundamentals.", path: "/marketing-basics", icon: BookOpen, category: "Core Concepts" },
    { title: "Segmentation Lab", description: "Define your ideal customers.", path: "/segmentation-lab", icon: FlaskConical, category: "Marketing Labs" },
    { title: "Targeting Lab", description: "Choose the right segments.", path: "/targeting-lab", icon: Target, category: "Marketing Labs" },
    { title: "Positioning Studio", description: "Craft a unique brand identity.", path: "/positioning-studio", icon: Gem, category: "Marketing Labs" },
    { title: "Product Strategy", description: "Design your product strategy.", path: "/product-strategy", icon: Package, category: "Marketing Labs" },
    { title: "Pricing Lab", description: "Set your pricing strategy.", path: "/pricing-lab", icon: DollarSign, category: "Marketing Labs" },
    { title: "Promotion Lab", description: "Plan your promotional campaign.", path: "/promotion-lab", icon: Megaphone, category: "Marketing Labs" },
    { title: "Sales Challenge", description: "Practice your sales skills.", path: "/sales-challenge", icon: Zap, category: "Practice" },
];

const Dashboard: React.FC = () => {
    const userName = useAppStore((state) => state.userName);
    const userProgress = useAppStore((state) => state.userProgress);
    const totalXP = useAppStore((state) => state.totalXP);
    const streak = useAppStore((state) => state.streak);
    const unlockedAchievements = useAppStore((state) => state.unlockedAchievements);
    const activities = useAppStore((state) => state.activities);
    const moduleDetails = useAppStore((state) => state.moduleDetails);
    
    const levelInfo = calculateLevel(totalXP);
    
    // Defensively handle userProgress to prevent crashes before hydration from storage
    const progressValues = Object.values(userProgress || {}) as number[];
    const totalProgress = progressValues.length > 0
      ? progressValues.reduce((sum, current) => sum + current, 0) / progressValues.length
      : 0;
    
    // Calculate completed modules
    const completedModules = Object.keys(moduleDetails).filter(k => moduleDetails[k].completed).length;
    
    // Recommend next module based on progress
    const getRecommendedModule = () => {
      const allModules = modules.map(m => m.path.substring(1));
      const incomplete = allModules.filter(m => !moduleDetails[m]?.completed);
      
      // Recommend based on highest progress but not complete
      const inProgress = incomplete.map(m => ({
        module: m,
        progress: userProgress[m] || 0
      })).sort((a, b) => b.progress - a.progress);
      
      return inProgress[0]?.module || incomplete[0] || 'marketing-basics';
    };
    
    const recommendedModuleId = getRecommendedModule();
    const recommendedModule = modules.find(m => m.path.substring(1) === recommendedModuleId);
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    return (
        <div>
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold font-heading">Welcome back, {userName}!</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your progress. Keep up the great work!</p>
            </motion.div>
            
            {/* Featured: Sales Challenge Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
            >
                <Link to="/sales-challenge">
                    <div className="relative overflow-hidden bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 p-8 rounded-2xl shadow-2xl cursor-pointer hover:shadow-3xl transition-all group">
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all" />
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                                        NEW 🔥
                                    </span>
                                    <span className="text-white/90 text-sm">Only 20% Win Rate!</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">AI Sales Challenge</h2>
                                <p className="text-white/90 text-lg mb-1">Face a brutal AI buyer. Sell ANYTHING you want.</p>
                                <p className="text-white/80 text-sm">Practice your real products • Get instant feedback • Earn massive XP</p>
                            </div>
                            <div className="flex-shrink-0 ml-8 text-white">
                                <div className="text-7xl mb-2 group-hover:scale-110 transition-transform">⚡</div>
                                <p className="text-center text-sm font-semibold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                    Try Now →
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>
            
            {/* Stats Cards */}
            <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-coral-400 to-coral-500 text-white p-4 rounded-xl shadow-lg">
                    <p className="text-sm opacity-90 mb-1">Total XP</p>
                    <p className="text-3xl font-bold">{totalXP.toLocaleString()}</p>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-deep-blue-400 to-deep-blue-500 text-white p-4 rounded-xl shadow-lg">
                    <p className="text-sm opacity-90 mb-1">Current Level</p>
                    <p className="text-3xl font-bold">{levelInfo.level}</p>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-warm-yellow-400 to-warm-yellow-500 text-slate-900 p-4 rounded-xl shadow-lg">
                    <p className="text-sm opacity-90 mb-1">Day Streak</p>
                    <p className="text-3xl font-bold">{streak} 🔥</p>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-green-400 to-green-500 text-white p-4 rounded-xl shadow-lg">
                    <p className="text-sm opacity-90 mb-1">Achievements</p>
                    <p className="text-3xl font-bold">{unlockedAchievements.length} 🏆</p>
                </motion.div>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div 
                    className="lg:col-span-1 space-y-6"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Overall Progress */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center">
                        <h2 className="text-xl font-semibold font-heading mb-4">Overall Progress</h2>
                        <ProgressRing progress={totalProgress} size={150} strokeWidth={12} />
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                            {completedModules} of {modules.length} modules completed
                        </p>
                    </div>
                    
                    {/* Level Badge */}
                    <div className="bg-gradient-to-br from-coral-500 to-warm-yellow-500 p-6 rounded-2xl shadow-lg flex flex-col items-center">
                        <LevelBadge size="lg" showXP animated />
                        <p className="text-white mt-4 text-sm text-center">
                            {levelInfo.xpNeededForNextLevel > 0 
                              ? `${levelInfo.xpNeededForNextLevel} XP to next level`
                              : 'Max level reached!'
                            }
                        </p>
                    </div>
                </motion.div>
                
                <motion.div
                    className="lg:col-span-2 space-y-6"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Recommended Module */}
                    {recommendedModule && (
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                            <h2 className="text-xl font-semibold font-heading mb-4">Recommended For You</h2>
                            <Link to={recommendedModule.path}>
                                <div className="flex items-center p-4 bg-gradient-to-r from-coral-100 to-warm-yellow-100 dark:from-coral-900/50 dark:to-warm-yellow-900/50 rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                                    <recommendedModule.icon className="w-12 h-12 text-coral-600 dark:text-coral-400" />
                                    <div className="ml-4 flex-1">
                                        <h3 className="font-semibold text-lg">{recommendedModule.title}</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">{recommendedModule.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-coral-500">{userProgress[recommendedModuleId] || 0}%</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}
                    
                    {/* Recent Activity */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-semibold font-heading mb-4">Recent Activity</h2>
                        {activities.length === 0 ? (
                            <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                                No activity yet. Start learning to see your progress here!
                            </p>
                        ) : (
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {activities.slice(0, 10).map((activity) => (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
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
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">
                                                {activity.title}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {new Date(activity.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                        {activity.xpEarned && activity.xpEarned > 0 && (
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-xs font-bold text-coral-500">+{activity.xpEarned}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <motion.div
                className="mt-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <h2 className="text-2xl font-bold font-heading mb-4">Your Modules</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {modules.map((module) => (
                        <motion.div key={module.path} variants={itemVariants}>
                            <ModuleCard {...module} progress={userProgress?.[module.path.substring(1)] || 0} />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

interface ModuleCardProps {
    title: string;
    description: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    progress: number;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, description, path, icon: Icon, progress }) => (
    <Link to={path} className="block group">
        <motion.div 
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            whileHover={{ scale: 1.05 }}
        >
            <div className="flex-grow">
                <Icon className="w-10 h-10 text-coral-500 mb-4" />
                <h3 className="text-lg font-bold font-heading">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
            </div>
            <div className="mt-4">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <motion.div 
                        className="bg-coral-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1 }}
                    />
                </div>
                <p className="text-xs text-right mt-1 text-slate-500">{progress}% complete</p>
            </div>
        </motion.div>
    </Link>
);


export default Dashboard;