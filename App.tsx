
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { useAppStore } from './store/useStore';
import Layout from './components/Layout';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import LearnMarketing from './pages/LearnMarketing';
import TheoryPage from './pages/TheoryPage';
import MarketingQuiz from './pages/MarketingQuiz';
import SegmentationLab from './pages/SegmentationLab';
import TargetingLab from './pages/TargetingLab';
import PositioningStudio from './pages/PositioningStudio';
import ProductStrategyLab from './pages/ProductStrategyLab';
import PricingLab from './pages/PricingLab';
import PromotionLab from './pages/PromotionLab';
import Profile from './pages/Profile';
import SalesChallenge from './pages/SalesChallenge';

function App() {
  const theme = useAppStore((state) => state.theme);
  const updateStreak = useAppStore((state) => state.updateStreak);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Update streak on app load
  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  return (
    <HashRouter>
      <Layout>
        <Toast />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
            <Route path="/marketing-basics" element={<AnimatedPage><LearnMarketing /></AnimatedPage>} />
            <Route path="/theory/:topicId" element={<AnimatedPage><TheoryPage /></AnimatedPage>} />
            <Route path="/marketing-quiz" element={<AnimatedPage><MarketingQuiz /></AnimatedPage>} />
            <Route path="/segmentation-lab" element={<AnimatedPage><SegmentationLab /></AnimatedPage>} />
            <Route path="/targeting-lab" element={<AnimatedPage><TargetingLab /></AnimatedPage>} />
            <Route path="/positioning-studio" element={<AnimatedPage><PositioningStudio /></AnimatedPage>} />
            <Route path="/product-strategy" element={<AnimatedPage><ProductStrategyLab /></AnimatedPage>} />
            <Route path="/pricing-lab" element={<AnimatedPage><PricingLab /></AnimatedPage>} />
            <Route path="/promotion-lab" element={<AnimatedPage><PromotionLab /></AnimatedPage>} />
            <Route path="/sales-challenge" element={<AnimatedPage><SalesChallenge /></AnimatedPage>} />
            <Route path="/profile" element={<AnimatedPage><Profile /></AnimatedPage>} />
            {/* Redirect old route to new */}
            <Route path="/marketing-101" element={<Navigate to="/marketing-basics" replace />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </HashRouter>
  );
}

const AnimatedPage = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default App;
