import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Groq from 'groq-sdk';
import { useAppStore } from '../store/useStore';
import { Sparkles, RotateCw } from '../components/icons/Icons';
import LabNavigation from '../components/LabNavigation';

const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
  dangerouslyAllowBrowser: true 
});

interface ProductLevels {
  coreBenefit: string;
  qualityLevel: number;
  features: string[];
  designStyle: string;
  brandName: string;
  packaging: string;
  warranty: string;
  customerSupport: string[];
  delivery: string[];
  afterSales: string[];
}

interface ProductAttributes {
  quality: number;
  durability: number;
  reliability: number;
  style: number;
  innovation: number;
  sustainability: number;
}

interface AIEvaluation {
  marketFitScore: number;
  strengths: string[];
  mismatches: string[];
  competitorComparison: string;
  recommendations: string[];
}

const ProductStrategyLab: React.FC = () => {
  const [marketDescription, setMarketDescription] = useState('');
  const [productLevels, setProductLevels] = useState<ProductLevels>({
    coreBenefit: '',
    qualityLevel: 50,
    features: [],
    designStyle: '',
    brandName: '',
    packaging: '',
    warranty: '',
    customerSupport: [],
    delivery: [],
    afterSales: []
  });
  
  const [attributes, setAttributes] = useState<ProductAttributes>({
    quality: 50,
    durability: 50,
    reliability: 50,
    style: 50,
    innovation: 50,
    sustainability: 50
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<AIEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const incrementAI = useAppStore((state) => state.incrementAIInteractions);
  const completeModule = useAppStore((state) => state.completeModule);
  const saveLabData = useAppStore((state) => state.saveLabData);
  
  const featureOptions = ['Basic', 'Standard', 'Advanced', 'Innovative', 'Smart Technology', 'Eco-Friendly'];
  const designStyles = ['Minimalist', 'Luxury', 'Sporty', 'Classic', 'Modern', 'Industrial'];
  const packagingOptions = ['Basic', 'Standard', 'Premium', 'Eco-Friendly', 'Luxury'];
  const warrantyOptions = ['None', '1 Year', '2 Years', '3 Years', '5 Years', 'Lifetime'];
  const supportOptions = ['24/7 Support', 'Live Chat', 'Phone Support', 'Email Only', 'Self-Service Portal'];
  const deliveryOptions = ['Standard', 'Express', 'Same-Day', 'Free Shipping', 'White Glove'];
  const afterSalesOptions = ['Installation', 'Training', 'Maintenance', 'Loyalty Program', 'Extended Warranty'];
  
  const handleFeatureToggle = (feature: string) => {
    setProductLevels(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };
  
  const handleMultiSelect = (field: keyof ProductLevels, option: string) => {
    const currentValue = productLevels[field] as string[];
    setProductLevels(prev => ({
      ...prev,
      [field]: currentValue.includes(option)
        ? currentValue.filter(o => o !== option)
        : [...currentValue, option]
    }));
  };
  
  const handleAnalyze = async () => {
    // Validate API key first
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      setError('API key not configured. Please add VITE_GROQ_API_KEY to your .env file.');
      return;
    }

    if (!marketDescription.trim() || !productLevels.coreBenefit.trim()) {
      setError('Please provide market description and core benefit');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    const prompt = `Analyze this product strategy:
    Target Market: ${marketDescription}
    Core Benefit: ${productLevels.coreBenefit}
    Quality Level: ${productLevels.qualityLevel}/100
    Features: ${productLevels.features.join(', ')}
    Design Style: ${productLevels.designStyle}
    Brand Name: ${productLevels.brandName}
    Packaging: ${productLevels.packaging}
    Warranty: ${productLevels.warranty}
    Customer Support: ${productLevels.customerSupport.join(', ')}
    Delivery: ${productLevels.delivery.join(', ')}
    After-Sales: ${productLevels.afterSales.join(', ')}
    Product Attributes: Quality ${attributes.quality}/100, Durability ${attributes.durability}/100, Reliability ${attributes.reliability}/100, Style ${attributes.style}/100, Innovation ${attributes.innovation}/100, Sustainability ${attributes.sustainability}/100
    
    Return ONLY valid JSON with these exact fields:
    {
      "marketFitScore": number (0-100),
      "strengths": ["strength 1", "strength 2", "strength 3"],
      "mismatches": ["mismatch 1", "mismatch 2"],
      "competitorComparison": "brief comparison description",
      "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
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
        result = JSON.parse(resultText) as AIEvaluation;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Raw response:', resultText);
        throw new Error('Invalid JSON response from AI. Please try again.');
      }
      setEvaluation(result);
      
      incrementAI();
      
      // Save data for cross-lab use
      saveLabData('product', {
        name: productLevels.brandName,
        coreValue: productLevels.coreBenefit,
        qualityLevel: productLevels.qualityLevel,
        features: productLevels.features
      });
      
      if (result.marketFitScore >= 70) {
        completeModule('product-strategy');
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
  
  const isComplete = marketDescription.trim() && productLevels.coreBenefit.trim() && 
    productLevels.designStyle && productLevels.brandName.trim();
  
  return (
    <div>
      <h1 className="text-3xl font-bold font-heading mb-2">Product Strategy Lab</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        Design your product using the three-level product model and get AI-powered market fit analysis.
      </p>
      
      {/* Market Selection */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold font-heading mb-4">1. Target Market</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          Describe your target market or import from previous labs
        </p>
        <textarea
          value={marketDescription}
          onChange={(e) => setMarketDescription(e.target.value)}
          placeholder="e.g., Tech-savvy millennials aged 25-40 who value innovation and convenience"
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none resize-none"
          rows={3}
        />
      </div>
      
      {/* Three-Level Product Model */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-2xl mb-8">
        <h2 className="text-xl font-semibold font-heading mb-4">2. Three-Level Product Model</h2>
        
        {/* Core Product */}
        <div className="mb-6 p-4 bg-white dark:bg-slate-900 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              1
            </div>
            <h3 className="text-lg font-semibold">Core Product (The Benefit)</h3>
          </div>
          <input
            type="text"
            value={productLevels.coreBenefit}
            onChange={(e) => setProductLevels({...productLevels, coreBenefit: e.target.value})}
            placeholder="What core benefit does your product provide? (e.g., Transportation from A to B)"
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        
        {/* Actual Product */}
        <div className="mb-6 p-4 bg-white dark:bg-slate-900 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              2
            </div>
            <h3 className="text-lg font-semibold">Actual Product (The Features)</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Quality Level: {productLevels.qualityLevel}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={productLevels.qualityLevel}
                onChange={(e) => setProductLevels({...productLevels, qualityLevel: Number(e.target.value)})}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>Budget</span>
                <span>Premium</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Features
              </label>
              <div className="flex flex-wrap gap-2">
                {featureOptions.map(feature => (
                  <button
                    key={feature}
                    onClick={() => handleFeatureToggle(feature)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      productLevels.features.includes(feature)
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Design Style
                </label>
                <select
                  value={productLevels.designStyle}
                  onChange={(e) => setProductLevels({...productLevels, designStyle: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="">Select style...</option>
                  {designStyles.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={productLevels.brandName}
                  onChange={(e) => setProductLevels({...productLevels, brandName: e.target.value})}
                  placeholder="Your brand name"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Packaging
                </label>
                <select
                  value={productLevels.packaging}
                  onChange={(e) => setProductLevels({...productLevels, packaging: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="">Select packaging...</option>
                  {packagingOptions.map(pkg => (
                    <option key={pkg} value={pkg}>{pkg}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Augmented Product */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-coral-500 to-warm-yellow-500 flex items-center justify-center text-white font-bold text-sm">
              3
            </div>
            <h3 className="text-lg font-semibold">Augmented Product (The Services)</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Warranty
              </label>
              <select
                value={productLevels.warranty}
                onChange={(e) => setProductLevels({...productLevels, warranty: e.target.value})}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none"
              >
                <option value="">Select warranty...</option>
                {warrantyOptions.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Customer Support
              </label>
              <div className="space-y-1">
                {supportOptions.map(option => (
                  <label key={option} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={productLevels.customerSupport.includes(option)}
                      onChange={() => handleMultiSelect('customerSupport', option)}
                      className="rounded text-coral-500 focus:ring-coral-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Delivery Options
              </label>
              <div className="space-y-1">
                {deliveryOptions.map(option => (
                  <label key={option} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={productLevels.delivery.includes(option)}
                      onChange={() => handleMultiSelect('delivery', option)}
                      className="rounded text-coral-500 focus:ring-coral-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                After-Sales Service
              </label>
              <div className="space-y-1">
                {afterSalesOptions.map(option => (
                  <label key={option} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={productLevels.afterSales.includes(option)}
                      onChange={() => handleMultiSelect('afterSales', option)}
                      className="rounded text-coral-500 focus:ring-coral-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Attributes Matrix */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold font-heading mb-4">3. Product Attributes</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Rate each attribute from 0 (lowest) to 100 (highest)
        </p>
        
        <div className="space-y-4">
          {Object.entries(attributes).map(([key, value]) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize">
                  {key}
                </label>
                <span className="text-sm font-bold text-coral-500">{value}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => setAttributes({...attributes, [key]: Number(e.target.value)})}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-coral-500"
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Analyze Button */}
      <div className="flex justify-center mb-8">
        <motion.button
          onClick={handleAnalyze}
          disabled={!isComplete || isLoading}
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
              Analyze Product Strategy
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
      
      {/* AI Evaluation Results */}
      <AnimatePresence>
        {evaluation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-8 rounded-2xl shadow-xl"
          >
            <h2 className="text-2xl font-bold font-heading text-center mb-6">Product Strategy Evaluation</h2>
            
            {/* Market Fit Score */}
            <div className="flex justify-center mb-8">
              <div className={`p-6 rounded-2xl text-center ${
                evaluation.marketFitScore >= 70 ? 'bg-green-100 dark:bg-green-900/30' :
                evaluation.marketFitScore >= 50 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                'bg-red-100 dark:bg-red-900/30'
              }`}>
                <div className={`text-5xl font-bold mb-2 ${
                  evaluation.marketFitScore >= 70 ? 'text-green-600 dark:text-green-400' :
                  evaluation.marketFitScore >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {evaluation.marketFitScore}%
                </div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Market Fit Score
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Strengths */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-3">
                  ✅ Strengths
                </h3>
                <ul className="space-y-2">
                  {evaluation.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Mismatches */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-3">
                  ⚠️ Mismatches
                </h3>
                <ul className="space-y-2">
                  {evaluation.mismatches.map((mismatch, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>{mismatch}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Competitor Comparison */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl mb-6">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-3">
                🏢 Competitor Comparison
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {evaluation.competitorComparison}
              </p>
            </div>
            
            {/* Recommendations */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-3">
                💡 Recommendations
              </h3>
              <ul className="space-y-2">
                {evaluation.recommendations.map((recommendation, index) => (
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
        currentLab="product-strategy"
        completedLabs={[]}
        onNavigate={(lab) => window.location.hash = `#/${lab}`}
      />
    </div>
  );
};

export default ProductStrategyLab;

