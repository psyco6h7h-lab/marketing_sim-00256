import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, BookOpen, FlaskConical, Gem, Target, Zap, Package, DollarSign, Megaphone, ChevronDown, X, Settings, LogOut } from './icons/Icons';

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

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
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
      { path: '/sales-challenge', icon: Zap, label: 'Sales Challenge' }
    ]
  }
];

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const [labsExpanded, setLabsExpanded] = useState(true);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
          />
          
          {/* Sidebar - Slides from left */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 300 
            }}
            className="fixed top-0 left-0 bottom-0 w-[280px] 
                       bg-white dark:bg-slate-800 z-50 
                       shadow-2xl overflow-y-auto
                       border-r border-slate-200 dark:border-slate-700"
            style={{
              boxShadow: `
                0 0 0 1px rgba(0, 0, 0, 0.05),
                0 10px 40px rgba(0, 0, 0, 0.2),
                0 2px 8px rgba(0, 0, 0, 0.1)
              `
            }}
          >
            {/* Header with close button */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <Gem className="h-6 w-6 text-coral-500" />
                <h1 className="text-lg font-bold font-heading text-slate-800 dark:text-slate-100">
                  SimuLearn
                </h1>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 
                           transition-colors touch-manipulation"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navSections.map((section, idx) => (
                <div key={idx}>
                  {section.type === 'single' ? (
                    section.items.map(item => (
                      <NavItem key={item.path} {...item} onNavigate={onClose} />
                    ))
                  ) : (
                    <CollapsibleSection
                      label={section.label!}
                      icon={section.icon!}
                      items={section.items}
                      expanded={labsExpanded}
                      onToggle={() => setLabsExpanded(!labsExpanded)}
                      onNavigate={onClose}
                    />
                  )}
                </div>
              ))}
            </nav>

            {/* Footer */}
            <div className="border-t border-slate-200 dark:border-slate-700 p-3">
              <NavLink
                to="/profile"
                onClick={onClose}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 dark:text-slate-300 
                   hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 
                   touch-manipulation ${isActive ? 'bg-coral-500 text-white dark:bg-coral-600' : ''}`
                }
              >
                <Settings className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">Settings</span>
              </NavLink>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

const CollapsibleSection: React.FC<{
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  items: NavItemProps[];
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}> = ({ label, icon: Icon, items, expanded, onToggle, onNavigate }) => {
  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 rounded-lg 
                   text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 
                   transition-all touch-manipulation"
        aria-label={`Toggle ${label}`}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium">{label}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
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
            className="overflow-hidden ml-8"
          >
            <div className="space-y-1 mt-1">
              {items.map(item => (
                <NavItem key={item.path} {...item} compact onNavigate={onNavigate} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavItem: React.FC<NavItemProps & { onNavigate: () => void }> = ({ 
  path, 
  icon: Icon, 
  label, 
  compact = false, 
  onNavigate 
}) => {
  const navLinkClasses = `flex items-center gap-3 p-3 rounded-lg text-slate-600 dark:text-slate-300 
                          hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 
                          touch-manipulation group`;
  const activeLinkClasses = "bg-coral-500 text-white dark:bg-coral-600 shadow-sm";

  return (
    <NavLink
      to={path}
      onClick={onNavigate}
      className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}
    >
      <Icon className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} flex-shrink-0`} />
      <span className={`font-medium ${compact ? 'text-sm' : ''} truncate`}>{label}</span>
    </NavLink>
  );
};

export default MobileSidebar;
