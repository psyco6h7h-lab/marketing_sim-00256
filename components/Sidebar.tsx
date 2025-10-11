
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, BookOpen, FlaskConical, Gem, Target, User, Zap, Package, DollarSign, Megaphone, ChevronDown } from './icons/Icons';
import { useAppStore } from '../store/useStore';
import { calculateLevel } from '../utils/xpCalculations';
import XPBar from './XPBar';
import LevelBadge from './LevelBadge';

interface NavItemProps {
  path: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  compact?: boolean;
}

interface NavSection {
  type: 'single' | 'collapsible';
  label?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  items: NavItemProps[];
}

const navSections: NavSection[] = [
  {
    type: 'single',
    items: [
      { path: '/dashboard', icon: BarChart, label: 'Dashboard' },
      { path: '/marketing-basics', icon: BookOpen, label: 'Learn Marketing' }
    ]
  },
  {
    type: 'collapsible',
    label: 'Marketing Labs',
    icon: FlaskConical,
    items: [
      { path: '/segmentation-lab', icon: FlaskConical, label: 'Segmentation' },
      { path: '/targeting-lab', icon: Target, label: 'Targeting' },
      { path: '/positioning-studio', icon: Gem, label: 'Positioning' },
      { path: '/product-strategy', icon: Package, label: 'Product Strategy' },
      { path: '/pricing-lab', icon: DollarSign, label: 'Pricing' },
      { path: '/promotion-lab', icon: Megaphone, label: 'Promotion' }
    ]
  },
  {
    type: 'single',
    items: [
      { path: '/sales-challenge', icon: Zap, label: 'Sales Challenge' },
      { path: '/profile', icon: User, label: 'Profile' }
    ]
  }
];

const Sidebar: React.FC = () => {
  const userName = useAppStore((state) => state.userName);
  const totalXP = useAppStore((state) => state.totalXP);
  const levelInfo = calculateLevel(totalXP);
  const [labsExpanded, setLabsExpanded] = useState(true);
  
  return (
    <aside className="w-16 sm:w-20 lg:w-64 bg-white dark:bg-slate-800 flex flex-col h-screen transition-all duration-300 shadow-lg border-r border-slate-200 dark:border-slate-700">
      {/* Header - Fixed */}
      <div className="flex items-center justify-center h-12 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        <Gem className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-coral-500" />
        <h1 className="text-lg font-bold ml-2 font-heading hidden lg:block text-deep-blue-800 dark:text-deep-blue-200">SimuLearn</h1>
      </div>
      
      {/* XP Progress Section - Desktop Only, Fixed */}
      <div className="hidden lg:block px-2 py-2 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1.5">
          <LevelBadge size="sm" animated={false} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
              Level {levelInfo.level}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {totalXP.toLocaleString()} XP
            </p>
          </div>
        </div>
        <XPBar showLabel={false} />
      </div>
      
      {/* Navigation - Fixed (NO SCROLLING) */}
      <nav className="flex-1 px-1 sm:px-2 lg:px-3 py-1.5 space-y-0.5 flex flex-col">
        {navSections.map((section, idx) => (
          <div key={idx}>
            {section.type === 'single' ? (
              section.items.map(item => (
                <NavItem key={item.path} {...item} />
              ))
            ) : (
              <CollapsibleSection
                label={section.label!}
                icon={section.icon!}
                items={section.items}
                expanded={labsExpanded}
                onToggle={() => setLabsExpanded(!labsExpanded)}
              />
            )}
          </div>
        ))}
      </nav>
      
      {/* User Profile - Fixed */}
      <div className="p-2 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
         <div className="flex items-center justify-center lg:justify-start">
            <img src="https://picsum.photos/seed/alex/28/28" alt="User" className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-full" />
            <div className="ml-2 hidden lg:block min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">{userName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Marketing Enthusiast</p>
            </div>
         </div>
      </div>
    </aside>
  );
};

const CollapsibleSection: React.FC<{
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  items: NavItemProps[];
  expanded: boolean;
  onToggle: () => void;
}> = ({ label, icon: Icon, items, expanded, onToggle }) => {
  return (
    <div className="mb-0.5">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-center lg:justify-between p-1.5 lg:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-coral-100 dark:hover:bg-slate-700 transition-all"
        title={label}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="hidden lg:block text-sm font-medium">{label}</span>
        </div>
        <ChevronDown className={`hidden lg:block h-3 w-3 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: 'auto', 
              opacity: 1,
              transition: {
                height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
                opacity: { duration: 0.25, ease: 'easeOut' }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: {
                height: { duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] },
                opacity: { duration: 0.15, ease: 'easeIn' }
              }
            }}
            className="overflow-hidden"
            style={{ overflow: 'hidden' }}
          >
            <div className="lg:pl-2 space-y-0.5 mt-0.5 pb-0.5">
              {items.map(item => (
                <NavItem key={item.path} {...item} compact />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavItem: React.FC<NavItemProps> = ({ path, icon: Icon, label, compact = false }) => {
  const navLinkClasses = `flex items-center justify-center lg:justify-start ${compact ? 'p-1.5 lg:p-1.5' : 'p-1.5 lg:p-2'} rounded-lg text-slate-600 dark:text-slate-300 hover:bg-coral-100 dark:hover:bg-slate-700 transition-all duration-200 group relative`;
  const activeLinkClasses = "bg-coral-500 text-white dark:bg-coral-600 shadow-sm";

  return (
    <NavLink
      to={path}
      className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}
      title={label}
    >
      <Icon className={`${compact ? 'h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-4 lg:w-4' : 'h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5'} flex-shrink-0`} />
      <span className={`ml-2 lg:ml-2.5 font-medium hidden lg:block ${compact ? 'text-xs' : 'text-sm'} truncate`}>{label}</span>
      
      {/* Mobile tooltip */}
      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[60] lg:hidden whitespace-nowrap">
        {label}
      </div>
    </NavLink>
  );
};


export default Sidebar;
