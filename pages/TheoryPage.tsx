import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles, Trophy, Target } from '../components/icons/Icons';
import { marketingConcepts } from '../utils/marketingConcepts';

const TheoryPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  
  const concept = marketingConcepts.find(c => c.id === topicId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [topicId]);

  if (!concept) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          Topic Not Found
        </h1>
        <button
          onClick={() => navigate('/marketing-basics')}
          className="px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
        >
          Back to Learn Marketing
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => navigate('/marketing-basics')}
          className="text-sm text-slate-600 dark:text-slate-400 hover:text-coral-500 mb-4 flex items-center gap-2"
        >
          ← Back to Learn Marketing
        </button>
        
        <div className={`p-8 rounded-2xl bg-gradient-to-r ${concept.gradient} text-white mb-6`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-4xl">
              {concept.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold font-heading mb-2">{concept.title}</h1>
              <p className="text-lg opacity-90">{concept.overview.what}</p>
            </div>
          </div>
          
          <div className="bg-white/20 rounded-xl p-4">
            <h3 className="font-semibold mb-2">Why This Matters:</h3>
            <p className="opacity-90">{concept.overview.why}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/marketing-quiz', { state: { topic: concept.id } })}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-coral-500 to-warm-yellow-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Take Quiz on This Topic
          </button>
        </div>
      </motion.div>

      {/* Key Concepts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold font-heading text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
            <Target className="w-6 h-6 text-coral-500" />
            Key Concepts
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {concept.keyConcepts.map((kc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="p-5 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-coral-300 dark:hover:border-coral-600 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{kc.icon}</span>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{kc.name}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                  {kc.description}
                </p>
                <div className="text-sm text-slate-500 dark:text-slate-500">
                  <strong className="text-slate-700 dark:text-slate-300">Real Examples:</strong>
                  <ul className="mt-2 space-y-1">
                    {kc.examples.map((example, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-coral-500">•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Real-World Examples Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold font-heading text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-coral-500" />
            Real-World Success Stories
          </h2>
          
          <div className="space-y-6">
            {concept.realWorldExamples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="p-6 rounded-xl bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-l-4 border-coral-500"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-coral-100 dark:bg-coral-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-coral-600 dark:text-coral-400 font-bold text-lg">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
                      {example.company}
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-semibold text-coral-600 dark:text-coral-400">Strategy:</span>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">{example.strategy}</p>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">Result:</span>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">{example.result}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Key Takeaways Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className={`p-8 rounded-2xl bg-gradient-to-r ${concept.gradient} text-white shadow-lg`}>
          <h2 className="text-2xl font-bold font-heading mb-6">Key Takeaways</h2>
          <ul className="space-y-4">
            {concept.keyTakeaways.map((takeaway, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold">{index + 1}</span>
                </div>
                <span className="opacity-95 text-lg">{takeaway}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
      >
        <h3 className="text-2xl font-bold font-heading text-slate-800 dark:text-slate-100 mb-4">
          Ready to Test Your Knowledge?
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Take the AI-powered quiz to reinforce what you've learned about {concept.title}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/marketing-quiz', { state: { topic: concept.id } })}
            className="px-8 py-4 bg-gradient-to-r from-coral-500 to-warm-yellow-500 text-white rounded-xl hover:shadow-xl transition-all font-semibold flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Start Quiz Now
          </button>
          <button
            onClick={() => navigate('/marketing-basics')}
            className="px-8 py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-semibold"
          >
            Back to Topics
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TheoryPage;

