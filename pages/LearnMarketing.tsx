import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { marketingConcepts } from '../utils/marketingConcepts';

const LearnMarketing: React.FC = () => {
  const navigate = useNavigate();
  const [learnedConcepts, setLearnedConcepts] = useState<Set<string>>(new Set());
  
  const markAsLearned = (conceptId: string) => {
    setLearnedConcepts(prev => new Set(prev).add(conceptId));
  };

  const handleQuickQuiz = (conceptId: string) => {
    markAsLearned(conceptId);
    navigate('/marketing-quiz', { state: { topic: conceptId } });
  };

  const handleReadTheory = (conceptId: string) => {
    markAsLearned(conceptId);
    navigate(`/theory/${conceptId}`);
  };

  const getConceptStatus = (conceptId: string): 'not-started' | 'in-progress' | 'learned' => {
    if (learnedConcepts.has(conceptId)) return 'learned';
    return 'not-started';
  };

  const statusColors = {
    'not-started': 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
    'in-progress': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    'learned': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
  };

  const statusIcons = {
    'not-started': '○',
    'in-progress': '⟳',
    'learned': '✓'
  };

  const learnedCount = learnedConcepts.size;
  const progress = (learnedCount / marketingConcepts.length) * 100;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold font-heading mb-1">Learn Marketing</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
        Master the fundamentals of marketing with clear explanations and real-world examples
      </p>

      {/* Progress Tracker */}
      <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
            Your Progress
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {learnedCount}/{marketingConcepts.length} concepts learned
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-coral-500 to-warm-yellow-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Concept Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {marketingConcepts.map((concept) => {
          const status = getConceptStatus(concept.id);

          return (
            <motion.div
              key={concept.id}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700 transition-shadow hover:shadow-lg"
            >
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${concept.gradient} flex items-center justify-center text-xl flex-shrink-0`}>
                    {concept.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold font-heading text-slate-800 dark:text-slate-100 mb-1">
                      {concept.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {concept.overview.what.substring(0, 120)}...
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
                    {statusIcons[status]}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReadTheory(concept.id)}
                    className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium text-sm"
                  >
                    Read Theory →
                  </button>
                  <button
                    onClick={() => handleQuickQuiz(concept.id)}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-coral-500 to-warm-yellow-500 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm"
                  >
                    Quick Quiz ⚡
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LearnMarketing;

