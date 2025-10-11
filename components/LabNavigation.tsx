import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from '../components/icons/Icons';

interface LabNavigationProps {
  currentLab: string;
  completedLabs: string[];
  onNavigate: (lab: string) => void;
}

const labFlow = [
  { id: 'segmentation-lab', name: 'Segmentation Lab', description: 'Define your target segments' },
  { id: 'targeting-lab', name: 'Targeting Lab', description: 'Choose which segments to target' },
  { id: 'positioning-studio', name: 'Positioning Studio', description: 'Position your brand' },
  { id: 'product-strategy', name: 'Product Strategy', description: 'Design your product' },
  { id: 'pricing-lab', name: 'Pricing Lab', description: 'Set your pricing strategy' },
  { id: 'promotion-lab', name: 'Promotion Lab', description: 'Plan your promotional campaign' }
];

const LabNavigation: React.FC<LabNavigationProps> = ({ currentLab, completedLabs, onNavigate }) => {
  const currentIndex = labFlow.findIndex(lab => lab.id === currentLab);
  const nextLab = currentIndex < labFlow.length - 1 ? labFlow[currentIndex + 1] : null;
  
  if (!nextLab) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-xl border border-green-200 dark:border-green-700 mb-6"
      >
        <div className="flex items-center justify-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          <div className="text-center">
            <h3 className="text-lg font-bold text-green-800 dark:text-green-100">
              🎉 Congratulations!
            </h3>
            <p className="text-green-700 dark:text-green-300 text-sm">
              You've completed your complete marketing strategy! All 6 labs are done.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700 mb-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-blue-800 dark:text-blue-100 mb-1">
            🚀 Continue Your Marketing Journey
          </h3>
          <p className="text-blue-700 dark:text-blue-300 text-xs">
            Next: <span className="font-semibold">{nextLab.description}</span>
          </p>
        </div>
        
        <motion.button
          onClick={() => onNavigate(nextLab.id)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{nextLab.name}</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
      
      {/* Progress indicator */}
      <div className="mt-3">
        <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
          <span>Progress:</span>
          <div className="flex items-center gap-1">
            {labFlow.map((lab, index) => (
              <div
                key={lab.id}
                className={`w-2 h-2 rounded-full ${
                  index <= currentIndex
                    ? 'bg-green-500'
                    : completedLabs.includes(lab.id)
                    ? 'bg-green-500'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            ))}
          </div>
          <span className="text-xs">
            {completedLabs.length + (completedLabs.includes(currentLab) ? 0 : 1)}/6 completed
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default LabNavigation;
