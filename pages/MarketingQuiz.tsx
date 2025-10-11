import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Clock, Trophy, Target, Zap } from '../components/icons/Icons';
import { useAppStore } from '../store/useStore';
import { generateQuestion, generateFeedback, adjustDifficulty, type QuizQuestion, type DifficultyLevel } from '../utils/quizGenerator';
import { marketingConcepts } from '../utils/marketingConcepts';

interface QuizState {
  topic: string;
  mode: 'practice' | 'timed';
  started: boolean;
  currentQuestion: QuizQuestion | null;
  userAnswer: string;
  showFeedback: boolean;
  isCorrect: boolean;
  questionsAnswered: number;
  correctAnswers: number;
  currentDifficulty: DifficultyLevel;
  timeLeft: number;
  questionStartTime: number;
  totalTime: number;
  isGenerating: boolean;
}

const MarketingQuiz: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedTopic = (location.state as any)?.topic || 'all';
  
  const [quizState, setQuizState] = useState<QuizState>({
    topic: selectedTopic,
    mode: 'practice',
    started: false,
    currentQuestion: null,
    userAnswer: '',
    showFeedback: false,
    isCorrect: false,
    questionsAnswered: 0,
    correctAnswers: 0,
    currentDifficulty: 'easy',
    timeLeft: 30,
    questionStartTime: 0,
    totalTime: 0,
    isGenerating: false
  });

  const [showResults, setShowResults] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');
  
  const earnXP = useAppStore((state) => state.earnXP);
  const incrementQuizzes = useAppStore((state) => state.incrementQuizzes);
  const addLeaderboardEntry = useAppStore((state) => state.addLeaderboardEntry);
  const updateQuizAnalytics = useAppStore((state) => state.updateQuizAnalytics);
  const userName = useAppStore((state) => state.userName);

  // Timer effect
  useEffect(() => {
    if (quizState.started && quizState.mode === 'timed' && quizState.timeLeft > 0 && !quizState.showFeedback && !quizState.isGenerating) {
      const timer = setTimeout(() => {
        setQuizState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (quizState.timeLeft === 0 && quizState.started && !quizState.showFeedback) {
      handleSubmit();
    }
  }, [quizState.started, quizState.mode, quizState.timeLeft, quizState.showFeedback, quizState.isGenerating]);

  const startQuiz = async () => {
    setQuizState(prev => ({ ...prev, isGenerating: true }));
    try {
      const question = await generateQuestion(quizState.topic, 'easy');
      setQuizState(prev => ({
        ...prev,
        started: true,
        currentQuestion: question,
        questionStartTime: Date.now(),
        timeLeft: prev.mode === 'timed' ? 30 : 0,
        isGenerating: false
      }));
    } catch (error) {
      console.error('Error starting quiz:', error);
      setQuizState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleSubmit = () => {
    if (!quizState.currentQuestion || !quizState.userAnswer) return;
    
    const correct = quizState.userAnswer === quizState.currentQuestion.correctAnswer;
    const timeSpent = Math.floor((Date.now() - quizState.questionStartTime) / 1000);
    
    setQuizState(prev => ({
      ...prev,
      showFeedback: true,
      isCorrect: correct,
      questionsAnswered: prev.questionsAnswered + 1,
      correctAnswers: prev.correctAnswers + (correct ? 1 : 0),
      totalTime: prev.totalTime + timeSpent
    }));

    // Award XP
    const baseXP = 20;
    const speedBonus = quizState.mode === 'timed' && quizState.timeLeft > 20 ? 5 : 0;
    const difficultyBonus = {
      easy: 0,
      medium: 5,
      hard: 10,
      expert: 20
    }[quizState.currentDifficulty];
    
    earnXP(baseXP + speedBonus + difficultyBonus, `Quiz: ${quizState.currentQuestion.concept}`);
    incrementQuizzes(correct);
  };

  const nextQuestion = async () => {
    setQuizState(prev => ({ ...prev, isGenerating: true }));
    
    try {
      const accuracy = (quizState.correctAnswers / quizState.questionsAnswered) * 100;
      const newDifficulty = adjustDifficulty(quizState.currentDifficulty, accuracy);
      const question = await generateQuestion(quizState.topic, newDifficulty);
      
      setQuizState(prev => ({
        ...prev,
        currentQuestion: question,
        currentDifficulty: newDifficulty,
        userAnswer: '',
        showFeedback: false,
        questionStartTime: Date.now(),
        timeLeft: prev.mode === 'timed' ? 30 : 0,
        isGenerating: false
      }));
    } catch (error) {
      console.error('Error generating next question:', error);
      setQuizState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const endQuiz = async () => {
    const accuracy = (quizState.correctAnswers / quizState.questionsAnswered) * 100;
    
    // Generate AI feedback
    const feedback = await generateFeedback({
      conceptId: quizState.topic,
      totalQuestions: quizState.questionsAnswered,
      correctAnswers: quizState.correctAnswers,
      accuracy,
      totalTime: quizState.totalTime,
      maxDifficulty: quizState.currentDifficulty
    });
    
    setAiFeedback(feedback);
    
    // Award completion XP
    const baseXP = 50;
    const accuracyBonus = Math.floor(accuracy / 10) * 25;
    const difficultyBonus = { easy: 0, medium: 25, hard: 50, expert: 100 }[quizState.currentDifficulty];
    const speedBonus = quizState.mode === 'timed' && quizState.totalTime < 300 ? 25 : 0;
    const totalXP = baseXP + accuracyBonus + difficultyBonus + speedBonus;
    
    earnXP(totalXP, `Completed Quiz: ${quizState.topic === 'all' ? 'All Topics' : marketingConcepts.find(c => c.id === quizState.topic)?.title}`);
    
    // Update analytics
    const conceptTitle = quizState.topic === 'all' ? 'All Topics' : marketingConcepts.find(c => c.id === quizState.topic)?.title || '';
    if (conceptTitle) {
      updateQuizAnalytics(conceptTitle, {
        questionsAnswered: quizState.questionsAnswered,
        correctAnswers: quizState.correctAnswers,
        timeTaken: quizState.totalTime,
        accuracy,
        difficulty: quizState.currentDifficulty
      });
    }
    
    // Add to leaderboard if timed mode
    if (quizState.mode === 'timed' && conceptTitle) {
      addLeaderboardEntry({
        userName,
        concept: conceptTitle,
        accuracy,
        timeTaken: quizState.totalTime,
        questionsAnswered: quizState.questionsAnswered,
        difficulty: quizState.currentDifficulty,
        mode: 'timed'
      });
    }
    
    setShowResults(true);
  };

  const resetQuiz = () => {
    setQuizState({
      topic: 'all',
      mode: 'practice',
      started: false,
      currentQuestion: null,
      userAnswer: '',
      showFeedback: false,
      isCorrect: false,
      questionsAnswered: 0,
      correctAnswers: 0,
      currentDifficulty: 'easy',
      timeLeft: 30,
      questionStartTime: 0,
      totalTime: 0,
      isGenerating: false
    });
    setShowResults(false);
    setAiFeedback('');
  };

  const topicOptions = [
    { id: 'all', title: 'All Topics (Mixed)' },
    ...marketingConcepts.map(c => ({ id: c.id, title: c.title }))
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold font-heading mb-2">Marketing Quiz</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Test your knowledge with unlimited AI-generated questions</p>

      <AnimatePresence mode="wait">
        {!quizState.started && !showResults && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8"
          >
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                📚 Choose Your Topic:
              </label>
              <select
                value={quizState.topic}
                onChange={(e) => setQuizState(prev => ({ ...prev, topic: e.target.value }))}
                className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-coral-500 outline-none"
              >
                {topicOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.title}</option>
                ))}
              </select>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                ⚡ Select Quiz Mode:
              </label>
              <div className="space-y-3">
                <div
                  onClick={() => setQuizState(prev => ({ ...prev, mode: 'practice' }))}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    quizState.mode === 'practice'
                      ? 'border-coral-500 bg-coral-50 dark:bg-coral-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-coral-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      quizState.mode === 'practice' ? 'border-coral-500' : 'border-slate-300'
                    }`}>
                      {quizState.mode === 'practice' && <div className="w-3 h-3 rounded-full bg-coral-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800 dark:text-slate-100">Practice Mode</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">No timer • Unlimited questions • Learn freely</div>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setQuizState(prev => ({ ...prev, mode: 'timed' }))}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    quizState.mode === 'timed'
                      ? 'border-coral-500 bg-coral-50 dark:bg-coral-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-coral-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      quizState.mode === 'timed' ? 'border-coral-500' : 'border-slate-300'
                    }`}>
                      {quizState.mode === 'timed' && <div className="w-3 h-3 rounded-full bg-coral-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800 dark:text-slate-100">Timed Challenge</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">30s per question • XP bonus • Leaderboard</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startQuiz}
              disabled={quizState.isGenerating}
              className="w-full py-4 bg-gradient-to-r from-coral-500 to-warm-yellow-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {quizState.isGenerating ? 'Generating Question...' : 'Start Quiz →'}
            </motion.button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
              💡 Tip: Choose "All Topics" for mixed practice, or select a specific topic to focus your learning!
            </p>
          </motion.div>
        )}

        {quizState.started && !showResults && quizState.currentQuestion && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8"
          >
            {/* Quiz Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Topic: {quizState.topic === 'all' ? 'All Topics (Mixed)' : marketingConcepts.find(c => c.id === quizState.topic)?.title}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Question {quizState.questionsAnswered + 1} • {quizState.mode === 'practice' ? 'Practice Mode' : 'Timed Challenge'}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-full text-sm font-medium capitalize">
                  {quizState.currentDifficulty}
                </span>
                {quizState.mode === 'timed' && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-coral-500" />
                    <span className={`font-bold ${quizState.timeLeft < 10 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                      {quizState.timeLeft}s
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Question */}
            <div className="mb-6">
              <p className="text-xl font-medium text-slate-800 dark:text-slate-100 mb-6">
                {quizState.currentQuestion.question}
              </p>

              {/* MCQ Options */}
              {quizState.currentQuestion.type === 'mcq' && quizState.currentQuestion.options && (
                <div className="space-y-3">
                  {quizState.currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setQuizState(prev => ({ ...prev, userAnswer: option }))}
                      disabled={quizState.showFeedback}
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        quizState.userAnswer === option
                          ? 'bg-coral-100 dark:bg-coral-900/30 border-2 border-coral-500'
                          : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                      } ${quizState.showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {/* True/False */}
              {quizState.currentQuestion.type === 'truefalse' && (
                <div className="flex gap-4">
                  {['True', 'False'].map(option => (
                    <button
                      key={option}
                      onClick={() => setQuizState(prev => ({ ...prev, userAnswer: option }))}
                      disabled={quizState.showFeedback}
                      className={`flex-1 p-4 rounded-lg transition-all ${
                        quizState.userAnswer === option
                          ? 'bg-coral-100 dark:bg-coral-900/30 border-2 border-coral-500'
                          : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                      } ${quizState.showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {/* Fill in / Scenario */}
              {(quizState.currentQuestion.type === 'fill' || quizState.currentQuestion.type === 'scenario') && (
                <input
                  type="text"
                  value={quizState.userAnswer}
                  onChange={(e) => setQuizState(prev => ({ ...prev, userAnswer: e.target.value }))}
                  disabled={quizState.showFeedback}
                  placeholder="Type your answer here..."
                  className="w-full p-4 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-coral-500 focus:border-coral-500 outline-none"
                />
              )}
            </div>

            {/* Submit Button */}
            {quizState.userAnswer && !quizState.showFeedback && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleSubmit}
                className="w-full py-3 bg-coral-500 text-white font-semibold rounded-lg hover:bg-coral-600 transition-colors mb-4"
              >
                Submit Answer
              </motion.button>
            )}

            {/* Feedback */}
            {quizState.showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg mb-4 ${
                  quizState.isCorrect
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{quizState.isCorrect ? '✅' : '❌'}</span>
                  <span className="font-semibold">
                    {quizState.isCorrect ? 'Correct! 🎉' : 'Not quite! 🤔'}
                  </span>
                </div>
                <p className="text-sm mb-3">{quizState.currentQuestion.explanation}</p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={nextQuestion}
                    disabled={quizState.isGenerating}
                    className="flex-1 py-2 bg-coral-500 text-white font-medium rounded-lg hover:bg-coral-600 transition-colors disabled:opacity-50"
                  >
                    {quizState.isGenerating ? 'Generating...' : 'Next Question →'}
                  </motion.button>
                  <button
                    onClick={endQuiz}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    End Quiz
                  </button>
                </div>
              </motion.div>
            )}

            {/* Score Display */}
            <div className="text-center text-sm text-slate-600 dark:text-slate-400">
              Score: {quizState.correctAnswers}/{quizState.questionsAnswered} correct 
              {quizState.questionsAnswered > 0 && ` (${Math.round((quizState.correctAnswers / quizState.questionsAnswered) * 100)}%)`}
            </div>
          </motion.div>
        )}

        {showResults && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <div className="text-4xl mb-2">🎉</div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Quiz Complete!
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {quizState.topic === 'all' ? 'All Topics' : marketingConcepts.find(c => c.id === quizState.topic)?.title} • {quizState.mode === 'practice' ? 'Practice' : 'Timed'} Mode
              </p>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <div className="text-3xl font-bold mb-1">
                  {Math.round((quizState.correctAnswers / quizState.questionsAnswered) * 100)}%
                </div>
                <div className="text-sm opacity-90">Accuracy</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 text-white">
                <div className="text-3xl font-bold mb-1">{quizState.questionsAnswered}</div>
                <div className="text-sm opacity-90">Questions</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white">
                <div className="text-3xl font-bold mb-1">{Math.round(quizState.totalTime / 60)}m</div>
                <div className="text-sm opacity-90">Time</div>
              </div>
            </div>

            {/* AI Feedback */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-coral-50 to-warm-yellow-50 dark:from-coral-900/20 dark:to-warm-yellow-900/20 border border-coral-200 dark:border-coral-800 mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-coral-500" />
                AI Tutor Feedback
              </h3>
              <div className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {aiFeedback}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetQuiz}
                className="flex-1 py-3 bg-coral-500 text-white font-semibold rounded-lg hover:bg-coral-600 transition-colors"
              >
                Try Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/marketing-basics')}
                className="flex-1 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Review Theory
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketingQuiz;

