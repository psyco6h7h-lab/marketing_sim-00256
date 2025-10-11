import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Groq from 'groq-sdk';
import { useAppStore } from '../store/useStore';
import { Sparkles, RotateCw, Target as TargetIcon, DollarSign } from '../components/icons/Icons';
import LabNavigation from '../components/LabNavigation';

const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true 
});

interface Segment {
  id: string;
  name: string;
  size: string;
  characteristics: string;
  marketSize: number; // 1-10
  competition: number; // 1-10
  profitPotential: number; // 1-10
  strategicFit: number; // 1-10
  cost: number; // Budget units
}

interface AIAnalysis {
  overallStrategy: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  score: number;
}

const segments: Segment[] = [
  {
    id: 'millennials',
    name: 'Tech-Savvy Millennials',
    characteristics: 'Ages 25-40, high income, early adopters, value innovation and convenience',
    size: '500K potential customers',
    marketSize: 9,
    competition: 8,
    profitPotential: 9,
    strategicFit: 8,
    cost: 40,
    industryExamples: ['Apple', 'Tesla', 'Netflix', 'Spotify']
  },
  {
    id: 'boomers',
    name: 'Affluent Baby Boomers',
    characteristics: 'Ages 55-70, highest disposable income, value quality and service',
    size: '300K potential customers',
    marketSize: 7,
    competition: 6,
    profitPotential: 10,
    strategicFit: 7,
    cost: 35,
  },
  {
    id: 'gen-z',
    name: 'Gen Z Digital Natives',
    characteristics: 'Ages 18-24, social media influencers, eco-conscious, budget-aware',
    size: '600K potential customers',
    marketSize: 10,
    competition: 9,
    profitPotential: 6,
    strategicFit: 7,
    cost: 30,
    industryExamples: ['TikTok', 'Spotify', 'Shein', 'Glossier']
  },
  {
    id: 'professionals',
    name: 'Urban Professionals',
    characteristics: 'Ages 30-45, busy lifestyle, value time-saving solutions, brand loyal',
    size: '400K potential customers',
    marketSize: 8,
    competition: 7,
    profitPotential: 8,
    strategicFit: 9,
    cost: 45,
    industryExamples: ['Uber', 'Amazon Prime', 'LinkedIn', 'WeWork']
  },
  {
    id: 'families',
    name: 'Growing Families',
    characteristics: 'Parents with children, value safety and practicality, price-conscious',
    size: '350K potential customers',
    marketSize: 7,
    competition: 5,
    profitPotential: 7,
    strategicFit: 6,
    cost: 25,
    industryExamples: ['Walmart', 'Costco', 'Target', 'Disney']
  },
  {
    id: 'retirees',
    name: 'Active Retirees',
    characteristics: 'Ages 65+, leisure-focused, health-conscious, time-rich',
    size: '250K potential customers',
    marketSize: 6,
    competition: 4,
    profitPotential: 6,
    strategicFit: 5,
    cost: 20,
    industryExamples: ['AARP', 'Hearst', 'Carnival Cruises', 'Johnson & Johnson']
  },
];

const TOTAL_BUDGET = 100;

const TargetingLab: React.FC = () => {
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // New states for enhanced features
  const [showCustomSegmentModal, setShowCustomSegmentModal] = useState(false);
  const [customSegment, setCustomSegment] = useState({
    name: '', characteristics: '', sizeEstimate: '', keyTraits: ''
  });
  const [isGeneratingSegment, setIsGeneratingSegment] = useState(false);
  const incrementAI = useAppStore((state) => state.incrementAIInteractions);
  const completeModule = useAppStore((state) => state.completeModule);
  
  const selectedSegmentObjects = segments.filter(s => selectedSegments.includes(s.id));
  const totalCost = selectedSegmentObjects.reduce((sum, s) => sum + s.cost, 0);
  
  // Custom Segment Creation Functions
  const handleCreateCustomSegment = () => {
    if (Object.values(customSegment).some(value => !value.trim())) {
      setError('Please fill in all fields');
      return;
    }
    
    // Add custom segment to segments array (in a real app, this would go to store)
    const newSegment = {
      id: `custom_${Date.now()}`,
      name: customSegment.name,
      size: customSegment.sizeEstimate,
      competition: 'Medium', // Default values
      profitPotential: 'Medium',
      strategicFit: 'Medium',
      cost: Math.floor(Math.random() * 40) + 10, // Random cost between 10-50
      characteristics: customSegment.characteristics,
      keyTraits: customSegment.keyTraits,
      industryExamples: ['Custom Segment'],
      isCustom: true
    };
    
    // In a real app, this would be saved to store
    console.log('New custom segment:', newSegment);
    
    setCustomSegment({
      name: '', characteristics: '', sizeEstimate: '', keyTraits: ''
    });
    setShowCustomSegmentModal(false);
    setError(null);
  };
  
  // AI Segment Generation Function
  const handleGenerateSegment = async () => {
    if (!customSegment.characteristics.trim()) {
      setError('Please describe the segment characteristics');
      return;
    }
    
    setIsGeneratingSegment(true);
    setError(null);
    
    const prompt = `Generate a detailed market segment based on these characteristics: "${customSegment.characteristics}".
    
    Return JSON with this exact format:
    {
      "name": "Segment Name",
      "characteristics": "Detailed characteristics",
      "sizeEstimate": "Market size estimate (e.g., 2.5M people, $500M market)",
      "keyTraits": "Key behavioral and demographic traits",
      "industryExamples": ["Brand 1", "Brand 2", "Brand 3"],
      "marketSize": "Large/Medium/Small",
      "competition": "High/Medium/Low",
      "profitPotential": "High/Medium/Low",
      "strategicFit": "High/Medium/Low"
    }
    
    Make it realistic and based on actual market data.`;
    
    try {
      const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a market research expert. Generate realistic market segments based on characteristics. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 600
      });
      
      let resultText = response?.choices?.[0]?.message?.content?.trim() || '';
      resultText = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      if (!resultText) {
        throw new Error('Empty AI response');
      }
      
      const generatedSegment = JSON.parse(resultText);
      
      // Update the form with generated data
      setCustomSegment({
        name: generatedSegment.name,
        characteristics: generatedSegment.characteristics,
        sizeEstimate: generatedSegment.sizeEstimate,
        keyTraits: generatedSegment.keyTraits
      });
      
      incrementAI();
      
    } catch (e) {
      console.error(e);
      setError("Sorry, I couldn't generate segment data. Please try again later.");
    } finally {
      setIsGeneratingSegment(false);
    }
  };
  
  // Budget Health Indicator
  const getBudgetHealth = () => {
    if (totalCost <= 80) return { status: 'good', color: 'green', message: 'Good budget allocation' };
    if (totalCost <= 100) return { status: 'warning', color: 'yellow', message: 'Consider diversifying your segments' };
    return { status: 'danger', color: 'red', message: 'Over-budget or risky allocation' };
  };
  
  const budgetHealth = getBudgetHealth();
  const budgetRemaining = TOTAL_BUDGET - totalCost;
  const isOverBudget = totalCost > TOTAL_BUDGET;
  
  const toggleSegment = (segmentId: string) => {
    setAnalysis(null);
    if (selectedSegments.includes(segmentId)) {
      setSelectedSegments(selectedSegments.filter(id => id !== segmentId));
    } else {
      setSelectedSegments([...selectedSegments, segmentId]);
    }
  };
  
  const handleAnalyze = async () => {
    // Validate API key first
    const apiKey = (import.meta as any).env?.VITE_GROQ_API_KEY;
    if (!apiKey) {
      setError('API key not configured. Please add VITE_GROQ_API_KEY to your .env file.');
      return;
    }

    if (selectedSegments.length === 0) {
      setError('Please select at least one segment to analyze');
      return;
    }
    
    if (isOverBudget) {
      setError('Please reduce your budget allocation to stay within the limit');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    
    const segmentDetails = selectedSegmentObjects.map(s => 
      `${s.name}: ${s.characteristics} (Market Size: ${s.marketSize}/10, Competition: ${s.competition}/10, Profit Potential: ${s.profitPotential}/10, Strategic Fit: ${s.strategicFit}/10)`
    ).join('; ');
    
    const prompt = `
      Evaluate this targeting strategy:
      Selected Segments: ${segmentDetails}
      Budget Used: ${totalCost}/${TOTAL_BUDGET}
      Number of Segments: ${selectedSegments.length}
      
      Return ONLY valid JSON with these exact fields:
      {
        "overallScore": number (0-100),
        "strengths": ["strength 1", "strength 2"],
        "weaknesses": ["weakness 1", "weakness 2"],
        "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
        "budgetEfficiency": number (0-100),
        "segmentSynergy": "brief description"
      }
      
      Do not include any text outside the JSON.`;
    
    try {
      const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a marketing analyst. You MUST respond with ONLY valid JSON. Never include any text before or after the JSON. Always use the exact field names and format requested.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      
      if (!response?.choices?.[0]?.message?.content) {
        throw new Error('Empty response from AI model');
      }

      let resultText = response.choices[0].message.content.trim();
      
      if (!resultText || resultText.length < 10) {
        throw new Error('Invalid response format from AI');
      }
      
      // Clean JSON markers
      resultText = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Try parsing with error handling
      let resultJson;
      try {
        resultJson = JSON.parse(resultText) as AIAnalysis;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Raw response:', resultText);
        throw new Error('Invalid JSON response from AI. Please try again.');
      }
      setAnalysis(resultJson);
      
      incrementAI();
      
      // Complete module if not already done
      if (resultJson.score >= 70) {
        completeModule('targeting-lab');
      }
      
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      console.error('AI Analysis Error:', errorMessage, e);
      
      if (errorMessage.includes('API key')) {
        setError('Invalid API key. Please check your Groq API key.');
      } else if (errorMessage.includes('rate limit')) {
        setError('Rate limit exceeded. Please wait a moment and try again.');
      } else if (errorMessage.includes('timeout')) {
        setError('Request timed out. Please try again.');
      } else {
        setError(`Analysis failed: ${errorMessage}. Please try again.`);
      }
      
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setSelectedSegments([]);
    setAnalysis(null);
    setError(null);
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold font-heading mb-2">Targeting Lab</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        Select which market segments to target. Manage your budget wisely - you can't target everyone!
      </p>
      
      {/* Budget Health Indicator */}
      <div className="mb-8 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Budget Allocation</h2>
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
            budgetHealth.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
            budgetHealth.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {budgetHealth.message}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                budgetHealth.color === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                budgetHealth.color === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                'bg-gradient-to-r from-red-500 to-red-600'
              }`}
              style={{ width: `${Math.min(100, (totalCost / TOTAL_BUDGET) * 100)}%` }}
            />
          </div>
          <div className="text-sm font-semibold">
            {totalCost}/{TOTAL_BUDGET} ({Math.round((totalCost / TOTAL_BUDGET) * 100)}%)
          </div>
        </div>
        
        {budgetRemaining > 0 && (
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            💰 {budgetRemaining} budget remaining
          </div>
        )}
        
        {isOverBudget && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-400">
            ⚠️ Over budget by {totalCost - TOTAL_BUDGET} points
          </div>
        )}
      </div>
      
      {/* Custom Segment Builder */}
      <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 rounded-xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🔧</span>
          <h2 className="text-xl font-bold">Custom Segment Builder</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Create your own market segment or generate one with AI
        </p>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <input
              type="text"
              value={customSegment.characteristics}
              onChange={(e) => setCustomSegment({...customSegment, characteristics: e.target.value})}
              placeholder="Describe your segment characteristics (e.g., eco-conscious millennials who value sustainability)"
              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
          <motion.button
            onClick={() => setShowCustomSegmentModal(true)}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-coral-500 to-warm-yellow-500 text-white font-semibold rounded-lg shadow-md hover:from-coral-600 hover:to-warm-yellow-600 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg">+</span>
            Create Segment
          </motion.button>
        </div>
      </div>
      
      {/* Budget Indicator */}
      <motion.div
        className={`mb-8 p-6 rounded-2xl ${
          isOverBudget
            ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
            : 'bg-gradient-to-r from-coral-50 to-warm-yellow-50 dark:from-slate-800 dark:to-slate-700 border-2 border-coral-200 dark:border-slate-600'
        }`}
        animate={{
          scale: isOverBudget ? [1, 1.02, 1] : 1,
        }}
        transition={{ duration: 0.5, repeat: isOverBudget ? Infinity : 0 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Marketing Budget
          </h3>
          <div className="text-right">
            <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-100'}`}>
              {totalCost} / {TOTAL_BUDGET}
            </p>
            <p className={`text-sm ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}>
              {isOverBudget ? 'Over budget!' : `${budgetRemaining} remaining`}
            </p>
          </div>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-full ${
              isOverBudget
                ? 'bg-gradient-to-r from-red-500 to-red-600'
                : 'bg-gradient-to-r from-coral-500 to-warm-yellow-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((totalCost / TOTAL_BUDGET) * 100, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>
      
      {/* Segments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {segments.map((segment) => (
          <SegmentCard
            key={segment.id}
            segment={segment}
            selected={selectedSegments.includes(segment.id)}
            onToggle={() => toggleSegment(segment.id)}
          />
        ))}
      </div>
      
      {/* Action Buttons */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            onClick={handleAnalyze}
            disabled={selectedSegments.length === 0 || isOverBudget || isLoading}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-coral-500 text-white font-semibold rounded-lg shadow-md hover:bg-coral-600 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <>
                <RotateCw className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze Strategy
              </>
            )}
          </motion.button>
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors w-full sm:w-auto"
          >
            Reset
          </button>
        </div>
        
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 p-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Analysis Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-heading">Strategy Analysis</h2>
                <div className="text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Overall Score</p>
                  <motion.div
                    className={`text-4xl font-bold ${
                      analysis.score >= 80 ? 'text-green-500' : 
                      analysis.score >= 60 ? 'text-yellow-500' : 
                      'text-red-500'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    {analysis.score}
                  </motion.div>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {analysis.overallStrategy}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold font-heading mb-3 text-green-600 dark:text-green-400 flex items-center gap-2">
                    <span>✓</span> Strengths
                  </h3>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 flex gap-2">
                        <span className="text-green-500 flex-shrink-0">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold font-heading mb-3 text-red-600 dark:text-red-400 flex items-center gap-2">
                    <span>⚠</span> Weaknesses
                  </h3>
                  <ul className="space-y-2">
                    {analysis.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 flex gap-2">
                        <span className="text-red-500 flex-shrink-0">•</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold font-heading mb-3 text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <span>💡</span> Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 flex gap-2">
                        <span className="text-blue-500 flex-shrink-0">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Segment Modal */}
      <AnimatePresence>
        {showCustomSegmentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowCustomSegmentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-heading">Create Custom Segment</h2>
                <button
                  onClick={() => setShowCustomSegmentModal(false)}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Segment Name *
                  </label>
                  <input
                    type="text"
                    value={customSegment.name}
                    onChange={(e) => setCustomSegment({...customSegment, name: e.target.value})}
                    placeholder="e.g., Eco-Conscious Millennials"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Characteristics *
                  </label>
                  <textarea
                    value={customSegment.characteristics}
                    onChange={(e) => setCustomSegment({...customSegment, characteristics: e.target.value})}
                    placeholder="Describe the demographic, psychographic, and behavioral characteristics"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none resize-none"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Market Size Estimate *
                  </label>
                  <input
                    type="text"
                    value={customSegment.sizeEstimate}
                    onChange={(e) => setCustomSegment({...customSegment, sizeEstimate: e.target.value})}
                    placeholder="e.g., 15M people, $2B market"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Key Traits *
                  </label>
                  <textarea
                    value={customSegment.keyTraits}
                    onChange={(e) => setCustomSegment({...customSegment, keyTraits: e.target.value})}
                    placeholder="Key behavioral and demographic traits"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none resize-none"
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowCustomSegmentModal(false)}
                  className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleCreateCustomSegment}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-coral-500 to-warm-yellow-500 text-white font-semibold rounded-lg shadow-md hover:from-coral-600 hover:to-warm-yellow-600 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <TargetIcon className="w-4 h-4" />
                  Create Segment
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Lab Navigation */}
      <LabNavigation
        currentLab="targeting-lab"
        completedLabs={[]}
        onNavigate={(lab) => window.location.hash = `#/${lab}`}
      />
    </div>
  );
};

interface SegmentCardProps {
  segment: Segment;
  selected: boolean;
  onToggle: () => void;
}

const SegmentCard: React.FC<SegmentCardProps> = ({ segment, selected, onToggle }) => {
  return (
    <motion.div
      onClick={onToggle}
      whileHover={{ y: -5 }}
      className={`cursor-pointer p-6 rounded-2xl transition-all duration-300 ${
        selected
          ? 'bg-gradient-to-br from-coral-500 to-warm-yellow-500 text-white shadow-xl ring-4 ring-coral-300 dark:ring-coral-700'
          : 'bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className={`text-lg font-bold font-heading mb-1 ${selected ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
            {segment.name}
          </h3>
          <p className={`text-sm ${selected ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`}>
            {segment.size}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          selected ? 'bg-white/20' : 'bg-coral-100 dark:bg-coral-900/30'
        }`}>
          {selected ? (
            <span className="text-2xl">✓</span>
          ) : (
            <TargetIcon className={`w-5 h-5 ${selected ? 'text-white' : 'text-coral-500'}`} />
          )}
        </div>
      </div>
      
      <p className={`text-sm mb-4 ${selected ? 'text-white/80' : 'text-slate-600 dark:text-slate-300'}`}>
        {segment.characteristics}
      </p>
      
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <MetricBar label="Market Size" value={segment.marketSize} selected={selected} />
        <MetricBar label="Competition" value={segment.competition} selected={selected} />
        <MetricBar label="Profit Potential" value={segment.profitPotential} selected={selected} />
        <MetricBar label="Strategic Fit" value={segment.strategicFit} selected={selected} />
      </div>
      
      {/* Industry Examples */}
      {segment.industryExamples && segment.industryExamples.length > 0 && (
        <div className={`mb-3 p-2 rounded-lg ${selected ? 'bg-white/10' : 'bg-slate-50 dark:bg-slate-700'}`}>
          <p className={`text-xs font-semibold mb-1 ${selected ? 'text-white/80' : 'text-slate-600 dark:text-slate-400'}`}>
            🏢 Industry Examples:
          </p>
          <div className="flex flex-wrap gap-1">
            {segment.industryExamples.map((example, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs ${
                  selected 
                    ? 'bg-white/20 text-white' 
                    : 'bg-coral-100 dark:bg-coral-900/30 text-coral-700 dark:text-coral-300'
                }`}
              >
                {example}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className={`pt-3 border-t ${selected ? 'border-white/20' : 'border-slate-200 dark:border-slate-700'}`}>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold ${selected ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>
            Budget Cost
          </span>
          <span className={`text-xl font-bold ${selected ? 'text-white' : 'text-coral-500'}`}>
            {segment.cost}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

interface MetricBarProps {
  label: string;
  value: number;
  selected: boolean;
}

const MetricBar: React.FC<MetricBarProps> = ({ label, value, selected }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className={`text-xs ${selected ? 'text-white/80' : 'text-slate-600 dark:text-slate-400'}`}>
          {label}
        </span>
        <span className={`text-xs font-semibold ${selected ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
          {value}/10
        </span>
      </div>
      <div className={`w-full h-1.5 rounded-full overflow-hidden ${
        selected ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'
      }`}>
        <motion.div
          className={selected ? 'bg-white' : 'bg-coral-500'}
          initial={{ width: 0 }}
          animate={{ width: `${(value / 10) * 100}%` }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
      </div>
    </div>
  );
};

export default TargetingLab;

