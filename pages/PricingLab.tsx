import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Groq from 'groq-sdk';
import { useAppStore } from '../store/useStore';
import { Sparkles, RotateCw, DollarSign } from '../components/icons/Icons';
import LabNavigation from '../components/LabNavigation';

const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true 
});

type PricingStrategy = 'cost-plus' | 'value-based' | 'competition' | 'penetration' | 'skimming' | '';

interface CostStructure {
  fixedCosts: number;
  variableCosts: number;
}

interface StrategyConfig {
  costPlus: { markup: number };
  valueBased: { perceivedValue: number };
  competition: { competitorPrice: number; adjustment: number };
  penetration: { discountPercent: number };
  skimming: { premiumPercent: number };
}

interface AIFeedback {
  priceQualityMatch: string;
  targetAffordability: string;
  competitivePosition: string;
  strategyFit: string;
  recommendations: string[];
  overallScore: number;
}

const PricingLab: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [qualityLevel, setQualityLevel] = useState(50);
  const [positioning, setPositioning] = useState('');
  
  const [costs, setCosts] = useState<CostStructure>({
    fixedCosts: 0,
    variableCosts: 0
  });
  
  const [selectedStrategy, setSelectedStrategy] = useState<PricingStrategy>('');
  const [strategyConfig, setStrategyConfig] = useState<StrategyConfig>({
    costPlus: { markup: 50 },
    valueBased: { perceivedValue: 100 },
    competition: { competitorPrice: 100, adjustment: 0 },
    penetration: { discountPercent: 30 },
    skimming: { premiumPercent: 100 }
  });
  
  const [psychologicalPricing, setPsychologicalPricing] = useState({
    charm: false,
    prestige: false,
    bundle: false
  });
  
  const [finalPrice, setFinalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const incrementAI = useAppStore((state) => state.incrementAIInteractions);
  const completeModule = useAppStore((state) => state.completeModule);
  const saveLabData = useAppStore((state) => state.saveLabData);
  const getLabData = useAppStore((state) => state.getLabData);
  
  // Load data from Product Strategy Lab
  useEffect(() => {
    const productData = getLabData('product');
    if (productData) {
      setProductName(productData.name || '');
      setQualityLevel(productData.qualityLevel || 50);
    }
  }, [getLabData]);
  
  // Calculate price based on strategy
  useEffect(() => {
    let calculatedPrice = 0;
    const totalCost = costs.variableCosts + (costs.fixedCosts / 100); // Assume 100 units for break-even
    
    switch (selectedStrategy) {
      case 'cost-plus':
        calculatedPrice = totalCost * (1 + strategyConfig.costPlus.markup / 100);
        break;
      case 'value-based':
        calculatedPrice = strategyConfig.valueBased.perceivedValue;
        break;
      case 'competition':
        calculatedPrice = strategyConfig.competition.competitorPrice * (1 + strategyConfig.competition.adjustment / 100);
        break;
      case 'penetration':
        calculatedPrice = totalCost * (1 - strategyConfig.penetration.discountPercent / 100);
        break;
      case 'skimming':
        calculatedPrice = totalCost * (1 + strategyConfig.skimming.premiumPercent / 100);
        break;
      default:
        calculatedPrice = 0;
    }
    
    // Apply psychological pricing
    if (psychologicalPricing.charm && calculatedPrice > 0) {
      calculatedPrice = Math.floor(calculatedPrice) - 0.01;
    } else if (psychologicalPricing.prestige && calculatedPrice > 0) {
      calculatedPrice = Math.round(calculatedPrice / 10) * 10;
    }
    
    setFinalPrice(Math.max(0, calculatedPrice));
  }, [selectedStrategy, costs, strategyConfig, psychologicalPricing]);
  
  const totalCost = costs.variableCosts + (costs.fixedCosts / 100);
  const profitMargin = finalPrice > 0 ? ((finalPrice - totalCost) / finalPrice * 100) : 0;
  const breakEvenQty = costs.fixedCosts > 0 && (finalPrice - costs.variableCosts) > 0 
    ? Math.ceil(costs.fixedCosts / (finalPrice - costs.variableCosts)) 
    : 0;
  
  const handleAnalyze = async () => {
    // Validate API key first
    const apiKey = (import.meta as any).env?.VITE_GROQ_API_KEY;
    if (!apiKey) {
      setError('API key not configured. Please add VITE_GROQ_API_KEY to your .env file.');
      return;
    }

    if (!productName || !targetMarket || !selectedStrategy || finalPrice === 0) {
      setError('Please complete all required fields and select a pricing strategy');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    const prompt = `Analyze this pricing strategy:
    Product: ${productName}
    Target Market: ${targetMarket}
    Quality Level: ${qualityLevel}/100
    Positioning: ${positioning}
    Fixed Costs: $${costs.fixedCosts}
    Variable Costs: $${costs.variableCosts}
    Total Cost per Unit: $${totalCost.toFixed(2)}
    Pricing Strategy: ${selectedStrategy}
    Final Price: $${finalPrice.toFixed(2)}
    Profit Margin: ${profitMargin.toFixed(1)}%
    Break-Even Quantity: ${breakEvenQty} units
    Psychological Pricing: ${Object.entries(psychologicalPricing).filter(([_, v]) => v).map(([k]) => k).join(', ') || 'None'}
    
    Return ONLY valid JSON with these exact fields:
    {
      "priceQualityMatch": "brief analysis description",
      "targetAffordability": "brief analysis description",
      "competitivePosition": "brief analysis description",
      "strategyFit": "brief analysis description",
      "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
      "overallScore": number (0-100)
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
        max_tokens: 700
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
      let result;
      try {
        result = JSON.parse(resultText) as AIFeedback;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Raw response:', resultText);
        throw new Error('Invalid JSON response from AI. Please try again.');
      }
      setFeedback(result);
      
      incrementAI();
      
      // Save data for cross-lab use
      saveLabData('pricing', {
        price: finalPrice,
        strategy: selectedStrategy,
        margin: profitMargin
      });
      
      if (result.overallScore >= 70) {
        completeModule('pricing-lab');
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
  
  const strategies = [
    {
      id: 'cost-plus',
      name: 'Cost-Plus Pricing',
      description: 'Add a markup % to your costs',
      icon: '📊',
      color: 'from-blue-500 to-blue-600',
      suitable: 'Manufacturing, Retail'
    },
    {
      id: 'value-based',
      name: 'Value-Based Pricing',
      description: 'Price based on customer perceived value',
      icon: '💎',
      color: 'from-purple-500 to-purple-600',
      suitable: 'Premium Products, Services'
    },
    {
      id: 'competition',
      name: 'Competition-Based',
      description: 'Match or beat competitor prices',
      icon: '⚔️',
      color: 'from-orange-500 to-orange-600',
      suitable: 'Commodity Markets'
    },
    {
      id: 'penetration',
      name: 'Penetration Pricing',
      description: 'Low initial price to gain market share',
      icon: '🚀',
      color: 'from-green-500 to-green-600',
      suitable: 'New Market Entry'
    },
    {
      id: 'skimming',
      name: 'Price Skimming',
      description: 'High initial price for early adopters',
      icon: '🎯',
      color: 'from-coral-500 to-warm-yellow-500',
      suitable: 'Innovative Products'
    }
  ];
  
  return (
    <div>
      <h1 className="text-3xl font-bold font-heading mb-2">Pricing Lab</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        Set your price using proven strategies and get AI-powered pricing analysis.
      </p>
      
      {/* Product Context */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold font-heading mb-4">1. Product Context</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Your product name"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Target Market *
            </label>
            <input
              type="text"
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              placeholder="e.g., Young professionals aged 25-35"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Quality Level: {qualityLevel}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={qualityLevel}
              onChange={(e) => setQualityLevel(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-coral-500"
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>Budget</span>
              <span>Premium</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Positioning
            </label>
            <input
              type="text"
              value={positioning}
              onChange={(e) => setPositioning(e.target.value)}
              placeholder="e.g., Premium, Value, Luxury"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>
      
      {/* Cost Structure */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-2xl mb-8">
        <h2 className="text-xl font-semibold font-heading mb-4">2. Cost Structure</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Fixed Costs (Overhead, Rent, Salaries)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">$</span>
              <input
                type="number"
                value={costs.fixedCosts}
                onChange={(e) => setCosts({...costs, fixedCosts: Number(e.target.value)})}
                placeholder="0"
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Variable Costs per Unit (Materials, Labor)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">$</span>
              <input
                type="number"
                value={costs.variableCosts}
                onChange={(e) => setCosts({...costs, variableCosts: Number(e.target.value)})}
                placeholder="0"
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 p-4 rounded-xl">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Cost per Unit</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${totalCost.toFixed(2)}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-4 rounded-xl">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Break-Even Quantity</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {breakEvenQty > 0 ? `${breakEvenQty} units` : 'N/A'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Pricing Strategy Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold font-heading mb-4">3. Choose Pricing Strategy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {strategies.map((strategy) => (
            <motion.div
              key={strategy.id}
              onClick={() => setSelectedStrategy(strategy.id as PricingStrategy)}
              className={`cursor-pointer p-6 rounded-2xl transition-all duration-300 ${
                selectedStrategy === strategy.id
                  ? `bg-gradient-to-br ${strategy.color} text-white shadow-xl ring-4 ring-offset-2 ring-${strategy.color.split('-')[1]}-300`
                  : 'bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl'
              }`}
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl mb-3">{strategy.icon}</div>
              <h3 className={`text-lg font-bold mb-2 ${
                selectedStrategy === strategy.id ? 'text-white' : 'text-slate-800 dark:text-slate-100'
              }`}>
                {strategy.name}
              </h3>
              <p className={`text-sm mb-3 ${
                selectedStrategy === strategy.id ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {strategy.description}
              </p>
              <div className={`text-xs font-semibold ${
                selectedStrategy === strategy.id ? 'text-white/80' : 'text-slate-400'
              }`}>
                Best for: {strategy.suitable}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Strategy Configuration */}
        {selectedStrategy && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg"
          >
            {selectedStrategy === 'cost-plus' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Markup Percentage: {strategyConfig.costPlus.markup}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={strategyConfig.costPlus.markup}
                  onChange={(e) => setStrategyConfig({
                    ...strategyConfig,
                    costPlus: { markup: Number(e.target.value) }
                  })}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>10%</span>
                  <span>200%</span>
                </div>
                <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  Formula: Cost (${totalCost.toFixed(2)}) + {strategyConfig.costPlus.markup}% = ${finalPrice.toFixed(2)}
                </div>
              </div>
            )}
            
            {selectedStrategy === 'value-based' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Customer Perceived Value: ${strategyConfig.valueBased.perceivedValue}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={strategyConfig.valueBased.perceivedValue}
                  onChange={(e) => setStrategyConfig({
                    ...strategyConfig,
                    valueBased: { perceivedValue: Number(e.target.value) }
                  })}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>$0</span>
                  <span>$1000</span>
                </div>
                <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  💡 Set price based on what customers believe your product is worth, not just costs.
                </div>
              </div>
            )}
            
            {selectedStrategy === 'competition' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Competitor Average Price: ${strategyConfig.competition.competitorPrice}
                  </label>
                  <input
                    type="number"
                    value={strategyConfig.competition.competitorPrice}
                    onChange={(e) => setStrategyConfig({
                      ...strategyConfig,
                      competition: { ...strategyConfig.competition, competitorPrice: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Price Adjustment: {strategyConfig.competition.adjustment > 0 ? '+' : ''}{strategyConfig.competition.adjustment}%
                  </label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={strategyConfig.competition.adjustment}
                    onChange={(e) => setStrategyConfig({
                      ...strategyConfig,
                      competition: { ...strategyConfig.competition, adjustment: Number(e.target.value) }
                    })}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>-50% (Undercut)</span>
                    <span>Match</span>
                    <span>+50% (Premium)</span>
                  </div>
                </div>
              </div>
            )}
            
            {selectedStrategy === 'penetration' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Discount from Cost: {strategyConfig.penetration.discountPercent}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={strategyConfig.penetration.discountPercent}
                  onChange={(e) => setStrategyConfig({
                    ...strategyConfig,
                    penetration: { discountPercent: Number(e.target.value) }
                  })}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>10%</span>
                  <span>50%</span>
                </div>
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                  <div className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ Warning: Requires high volume sales. Profit margin: {profitMargin.toFixed(1)}%
                  </div>
                </div>
              </div>
            )}
            
            {selectedStrategy === 'skimming' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Premium Above Cost: {strategyConfig.skimming.premiumPercent}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={strategyConfig.skimming.premiumPercent}
                  onChange={(e) => setStrategyConfig({
                    ...strategyConfig,
                    skimming: { premiumPercent: Number(e.target.value) }
                  })}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-coral-500"
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>50%</span>
                  <span>300%</span>
                </div>
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    💡 Best for innovative/unique products. Target early adopters willing to pay premium.
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Psychological Pricing */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold font-heading mb-4">4. Psychological Pricing (Optional)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-start gap-3 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-coral-500 transition-colors">
            <input
              type="checkbox"
              checked={psychologicalPricing.charm}
              onChange={(e) => setPsychologicalPricing({...psychologicalPricing, charm: e.target.checked, prestige: false})}
              className="mt-1 rounded text-coral-500 focus:ring-coral-500"
            />
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-100">Charm Pricing</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">$9.99 instead of $10</div>
            </div>
          </label>
          
          <label className="flex items-start gap-3 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-coral-500 transition-colors">
            <input
              type="checkbox"
              checked={psychologicalPricing.prestige}
              onChange={(e) => setPsychologicalPricing({...psychologicalPricing, prestige: e.target.checked, charm: false})}
              className="mt-1 rounded text-coral-500 focus:ring-coral-500"
            />
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-100">Prestige Pricing</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Round numbers ($100)</div>
            </div>
          </label>
          
          <label className="flex items-start gap-3 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-coral-500 transition-colors">
            <input
              type="checkbox"
              checked={psychologicalPricing.bundle}
              onChange={(e) => setPsychologicalPricing({...psychologicalPricing, bundle: e.target.checked})}
              className="mt-1 rounded text-coral-500 focus:ring-coral-500"
            />
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-100">Bundle Pricing</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Package deals</div>
            </div>
          </label>
        </div>
      </div>
      
      {/* Pricing Dashboard */}
      <div className="bg-gradient-to-br from-coral-50 to-warm-yellow-50 dark:from-slate-800 dark:to-slate-700 p-8 rounded-2xl shadow-xl mb-8">
        <h2 className="text-2xl font-bold font-heading text-center mb-6">💰 Your Pricing Dashboard</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl text-center">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Final Price</div>
            <div className="text-3xl font-bold text-coral-600 dark:text-coral-400">
              ${finalPrice.toFixed(2)}
            </div>
          </div>
          
          <div className={`bg-white dark:bg-slate-900 p-4 rounded-xl text-center ${
            profitMargin < 20 ? 'ring-2 ring-red-500' :
            profitMargin < 40 ? 'ring-2 ring-yellow-500' :
            'ring-2 ring-green-500'
          }`}>
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Profit Margin</div>
            <div className={`text-3xl font-bold ${
              profitMargin < 20 ? 'text-red-600 dark:text-red-400' :
              profitMargin < 40 ? 'text-yellow-600 dark:text-yellow-400' :
              'text-green-600 dark:text-green-400'
            }`}>
              {profitMargin.toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl text-center">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Break-Even</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {breakEvenQty} units
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl text-center">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">ROI @ 1000 units</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {((finalPrice - totalCost) * 1000 - costs.fixedCosts).toFixed(0) > '0' 
                ? `$${((finalPrice - totalCost) * 1000 - costs.fixedCosts).toFixed(0)}`
                : '$0'
              }
            </div>
          </div>
        </div>
        
        {/* Revenue Projections */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Revenue Projections</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2">Units Sold</th>
                  <th className="text-right py-2">Revenue</th>
                  <th className="text-right py-2">Total Costs</th>
                  <th className="text-right py-2">Profit</th>
                </tr>
              </thead>
              <tbody>
                {[100, 500, 1000, 2000].map(units => {
                  const revenue = finalPrice * units;
                  const totalCosts = costs.fixedCosts + (costs.variableCosts * units);
                  const profit = revenue - totalCosts;
                  return (
                    <tr key={units} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-2">{units}</td>
                      <td className="text-right py-2">${revenue.toFixed(0)}</td>
                      <td className="text-right py-2">${totalCosts.toFixed(0)}</td>
                      <td className={`text-right py-2 font-semibold ${profit > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        ${profit.toFixed(0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Analyze Button */}
      <div className="flex justify-center mb-8">
        <motion.button
          onClick={handleAnalyze}
          disabled={!productName || !targetMarket || !selectedStrategy || isLoading}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-coral-500 to-warm-yellow-500 text-white font-bold text-lg rounded-xl shadow-lg hover:from-coral-600 hover:to-warm-yellow-600 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? (
            <>
              <RotateCw className="w-6 h-6 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              Get Pricing Feedback
            </>
          )}
        </motion.button>
      </div>
      
      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl text-red-800 dark:text-red-200"
        >
          {error}
        </motion.div>
      )}
      
      {/* AI Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-8 rounded-2xl shadow-xl"
          >
            <h2 className="text-2xl font-bold font-heading text-center mb-6">Pricing Strategy Evaluation</h2>
            
            {/* Overall Score */}
            <div className="flex justify-center mb-8">
              <div className={`p-6 rounded-2xl text-center ${
                feedback.overallScore >= 70 ? 'bg-green-100 dark:bg-green-900/30' :
                feedback.overallScore >= 50 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                'bg-red-100 dark:bg-red-900/30'
              }`}>
                <div className={`text-5xl font-bold mb-2 ${
                  feedback.overallScore >= 70 ? 'text-green-600 dark:text-green-400' :
                  feedback.overallScore >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {feedback.overallScore}%
                </div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Overall Score
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Price-Quality Match */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-3">
                  💎 Price-Quality Match
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {feedback.priceQualityMatch}
                </p>
              </div>
              
              {/* Target Affordability */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-3">
                  💰 Target Affordability
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {feedback.targetAffordability}
                </p>
              </div>
              
              {/* Competitive Position */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-300 mb-3">
                  ⚔️ Competitive Position
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {feedback.competitivePosition}
                </p>
              </div>
              
              {/* Strategy Fit */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-3">
                  🎯 Strategy Fit
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {feedback.strategyFit}
                </p>
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-3">
                💡 Recommendations
              </h3>
              <ul className="space-y-2">
                {feedback.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span className="text-purple-500 mt-0.5">💡</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Lab Navigation */}
      <LabNavigation
        currentLab="pricing-lab"
        completedLabs={[]}
        onNavigate={(lab) => window.location.hash = `#/${lab}`}
      />
    </div>
  );
};

export default PricingLab;
