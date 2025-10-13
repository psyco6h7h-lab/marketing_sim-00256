
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { useAppStore } from './store/useStore';
import { AuthProvider } from './src/contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';
import Toast from './components/Toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
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
    <AuthProvider>
      <HashRouter>
        <Toast />
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <AnimatedPage><Dashboard /></AnimatedPage>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/marketing-basics" element={
              <ProtectedRoute>
                <Layout>
                  <AnimatedPage><LearnMarketing /></AnimatedPage>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/theory/:topicId" element={
              <ProtectedRoute>
                <Layout>
                  <AnimatedPage><TheoryPage /></AnimatedPage>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/marketing-quiz" element={
              <ProtectedRoute>
                <Layout>
                  <AnimatedPage><MarketingQuiz /></AnimatedPage>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/segmentation-lab" element={
              <ProtectedRoute>
                <Layout>
                  <AnimatedPage><SegmentationLab /></AnimatedPage>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/targeting-lab" element={
              <ProtectedRoute>
                <Layout>
                  <AnimatedPage><TargetingLab /></AnimatedPage>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/positioning-studio" element={
              <ProtectedRoute>
                <Layout>
                  <AnimatedPage><PositioningStudio /></AnimatedPage>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/product-strategy" element={
              <ProtectedRoute>
                <Layout>
                  <AnimatedPage><ProductStrategyLab /></AnimatedPage>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/pricing-lab" element={
              <ProtectedRoute>
                <Layout>
                  <AnimatedPage><PricingLab /></AnimatedPage>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/promotion-lab" element={
              <ProtectedRoute>
                <Layout>
                  <AnimatedPage><PromotionLab /></AnimatedPage>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/sales-challenge" element={
              <ProtectedRoute>
                <Layout>
                  <AnimatedPage><SalesChallenge /></AnimatedPage>
                </Layout>
              </ProtectedRoute>
            } />
            {/* Redirect old route to new */}
            <Route path="/marketing-101" element={<Navigate to="/marketing-basics" replace />} />
          </Routes>
        </AnimatePresence>
      </HashRouter>
    </AuthProvider>
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
