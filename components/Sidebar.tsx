
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, BookOpen, FlaskConical, Gem, Target, Zap, Package, DollarSign, Megaphone, ChevronDown, ChevronLeft, ChevronRight } from './icons/Icons';
import { useAppStore } from '../store/useStore';

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
      { path: '/promotion-campaign', icon: Zap, label: 'Promotion Campaign' }
    ]
  }
];

const Sidebar: React.FC = () => {
  const [labsExpanded, setLabsExpanded] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Load user preference from localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem('sidebar-collapsed');
    if (savedPreference !== null) {
      setIsCollapsed(JSON.parse(savedPreference));
    }
  }, []);
  
  // Save preference to localStorage
  const toggleSidebar = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newCollapsed));
  };
  
  // Calculate effective collapsed state
  const effectiveCollapsed = isMobile || isCollapsed;
  
  return (
    <aside className={`${effectiveCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-slate-800 flex flex-col h-screen transition-all duration-300 ease-in-out shadow-lg border-r border-slate-200 dark:border-slate-700`}>
      {/* Header - Fixed */}
      <div className="flex items-center justify-center h-12 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        <Gem className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-coral-500" />
        <h1 className={`text-lg font-bold ml-2 font-heading text-deep-blue-800 dark:text-deep-blue-200 transition-opacity duration-300 ${effectiveCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>SimuLearn</h1>
      </div>
      
      
      {/* Navigation - Fixed (NO SCROLLING) */}
      <nav className="flex-1 px-1 sm:px-2 lg:px-3 py-1.5 space-y-0.5 flex flex-col">
        {navSections.map((section, idx) => (
          <div key={idx}>
            {section.type === 'single' ? (
              section.items.map(item => (
                <NavItem key={item.path} {...item} effectiveCollapsed={effectiveCollapsed} />
              ))
            ) : (
              <CollapsibleSection
                label={section.label!}
                icon={section.icon!}
                items={section.items}
                expanded={labsExpanded}
                onToggle={() => setLabsExpanded(!labsExpanded)}
                effectiveCollapsed={effectiveCollapsed}
              />
            )}
          </div>
        ))}
      </nav>
      
      {/* Toggle Button - Fixed */}
      <div className="p-2 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
        <button
          onClick={toggleSidebar}
          className={`w-full p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 flex items-center ${effectiveCollapsed ? 'justify-center' : 'justify-center lg:justify-start'}`}
          title={effectiveCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {effectiveCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
          {!effectiveCollapsed && (
            <span className="ml-2 text-sm font-medium hidden lg:block">Collapse</span>
          )}
        </button>
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
  effectiveCollapsed: boolean;
}> = ({ label, icon: Icon, items, expanded, onToggle, effectiveCollapsed }) => {
  return (
    <div className="mb-0.5">
      <button
        onClick={onToggle}
        className={`w-full flex items-center ${effectiveCollapsed ? 'justify-center' : 'justify-between'} p-1.5 lg:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-coral-100 dark:hover:bg-slate-700 transition-all`}
        title={label}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className={`text-sm font-medium transition-opacity duration-300 ${effectiveCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>{label}</span>
        </div>
        <ChevronDown className={`h-3 w-3 transition-all duration-300 ${effectiveCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'} ${expanded ? 'rotate-180' : ''}`} />
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
                <NavItem key={item.path} {...item} compact effectiveCollapsed={effectiveCollapsed} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavItem: React.FC<NavItemProps & { effectiveCollapsed?: boolean }> = ({ path, icon: Icon, label, compact = false, effectiveCollapsed = false }) => {
  const navLinkClasses = `flex items-center ${effectiveCollapsed ? 'justify-center' : 'justify-start'} ${compact ? 'p-1.5' : 'p-1.5 lg:p-2'} rounded-lg text-slate-600 dark:text-slate-300 hover:bg-coral-100 dark:hover:bg-slate-700 transition-all duration-200 group relative`;
  const activeLinkClasses = "bg-coral-500 text-white dark:bg-coral-600 shadow-sm";

  return (
    <NavLink
      to={path}
      className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}
      title={label}
    >
      <Icon className={`${compact ? 'h-3.5 w-3.5' : 'h-4 w-4 sm:h-5 sm:w-5'} flex-shrink-0`} />
      <span className={`ml-2 font-medium transition-opacity duration-300 ${effectiveCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'} ${compact ? 'text-xs' : 'text-sm'} truncate`}>{label}</span>
      
      {/* Tooltip for collapsed state */}
      {effectiveCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[60] whitespace-nowrap">
          {label}
        </div>
      )}
    </NavLink>
  );
};


export default Sidebar;
