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

interface PositioningStatement {
  targetMarket: string;
  need: string;
  product: string;
  category: string;
  benefit: string;
  competitor: string;
  differentiator: string;
}

interface Competitor {
  id: string;
  name: string;
  x: number; // 0-100 (Price: Low to High)
  y: number; // 0-100 (Quality: Low to High)
}

interface AIFeedback {
  uniqueness: number;
  clarity: number;
  feasibility: number;
  overallAssessment: string;
  competitiveIntelligence: string;
  suggestions: string[];
}

const initialCompetitors: Competitor[] = [
  { id: 'comp1', name: 'Budget Brand', x: 20, y: 30 },
  { id: 'comp2', name: 'Mid-Range Co', x: 50, y: 60 },
  { id: 'comp3', name: 'Premium Plus', x: 80, y: 90 },
  { id: 'comp4', name: 'Value King', x: 35, y: 50 },
];

type MapType = 'price-quality' | 'innovation-tradition' | 'luxury-affordable' | 'convenience-customization' | 'performance-design';

const mapConfigs = {
  'price-quality': {
    xAxis: { low: 'Low Price', high: 'High Price' },
    yAxis: { low: 'Low Quality', high: 'High Quality' },
    competitors: [
      { id: 'comp1', name: 'Budget Brand', x: 20, y: 30 },
      { id: 'comp2', name: 'Mid-Range Co', x: 50, y: 60 },
      { id: 'comp3', name: 'Premium Plus', x: 80, y: 90 },
      { id: 'comp4', name: 'Value King', x: 35, y: 50 },
    ]
  },
  'innovation-tradition': {
    xAxis: { low: 'Traditional', high: 'Innovative' },
    yAxis: { low: 'Low Quality', high: 'High Quality' },
    competitors: [
      { id: 'comp1', name: 'Classic Co', x: 15, y: 70 },
      { id: 'comp2', name: 'Modern Mix', x: 55, y: 65 },
      { id: 'comp3', name: 'Tech Pioneer', x: 85, y: 80 },
      { id: 'comp4', name: 'Heritage Brand', x: 25, y: 85 },
    ]
  },
  'luxury-affordable': {
    xAxis: { low: 'Affordable', high: 'Luxury' },
    yAxis: { low: 'Low Quality', high: 'High Quality' },
    competitors: [
      { id: 'comp1', name: 'Budget Choice', x: 20, y: 35 },
      { id: 'comp2', name: 'Premium Value', x: 60, y: 70 },
      { id: 'comp3', name: 'Ultra Luxury', x: 90, y: 90 },
      { id: 'comp4', name: 'Affordable Quality', x: 30, y: 65 },
    ]
  },
  'convenience-customization': {
    xAxis: { low: 'Convenience', high: 'Customization' },
    yAxis: { low: 'Low Quality', high: 'High Quality' },
    competitors: [
      { id: 'comp1', name: 'Quick Service', x: 25, y: 45 },
      { id: 'comp2', name: 'Balanced Co', x: 50, y: 60 },
      { id: 'comp3', name: 'Bespoke Brand', x: 80, y: 75 },
      { id: 'comp4', name: 'Fast Custom', x: 70, y: 50 },
    ]
  },
  'performance-design': {
    xAxis: { low: 'Performance', high: 'Design' },
    yAxis: { low: 'Low Quality', high: 'High Quality' },
    competitors: [
      { id: 'comp1', name: 'Performance Pro', x: 20, y: 80 },
      { id: 'comp2', name: 'Style Master', x: 85, y: 70 },
      { id: 'comp3', name: 'Balanced Brand', x: 50, y: 60 },
      { id: 'comp4', name: 'Speed Demon', x: 15, y: 60 },
    ]
  }
};

const PositioningStudio: React.FC = () => {
  const [positioning, setPositioning] = useState<PositioningStatement>({
    targetMarket: '',
    need: '',
    product: '',
    category: '',
    benefit: '',
    competitor: '',
    differentiator: '',
  });
  
  const [yourBrand, setYourBrand] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [mapType, setMapType] = useState<MapType>('price-quality');
  const [competitors] = useState<Competitor[]>(initialCompetitors);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  
  const incrementAI = useAppStore((state) => state.incrementAIInteractions);
  const completeModule = useAppStore((state) => state.completeModule);
  
  const isComplete = Object.values(positioning).every(v => typeof v === 'string' && v.trim() !== '');
  
  const handleChange = (field: keyof PositioningStatement, value: string) => {
    setPositioning({ ...positioning, [field]: value });
    setFeedback(null);
  };
  
  const handleAnalyze = async () => {
    // Validate API key first
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      setError('API key not configured. Please add VITE_GROQ_API_KEY to your .env file.');
      return;
    }

    if (!isComplete) {
      setError('Please complete all positioning statement fields before analyzing');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setFeedback(null);
    
    const statement = `For ${positioning.targetMarket} who ${positioning.need}, ${positioning.product} is a ${positioning.category} that ${positioning.benefit}. Unlike ${positioning.competitor}, we ${positioning.differentiator}.`;
    
    const prompt = `
      Evaluate this positioning statement: "${statement}"
      Market Position: ${mapConfigs[mapType].xAxis.low} level ${yourBrand.x}/100, ${mapConfigs[mapType].yAxis.low} level ${yourBrand.y}/100
      Competitors: ${mapConfigs[mapType].competitors.map(comp => `${comp.name}: ${comp.x}%, ${comp.y}%`).join(', ')}
      
      Return ONLY valid JSON with these exact fields:
      {
        "uniqueness": number (0-100),
        "clarity": number (0-100),
        "feasibility": number (0-100),
        "overallAssessment": "brief description",
        "competitiveIntelligence": "brief description",
        "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
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
        resultJson = JSON.parse(resultText) as AIFeedback;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Raw response:', resultText);
        throw new Error('Invalid JSON response from AI. Please try again.');
      }
      setFeedback(resultJson);
      
      incrementAI();
      
      const avgScore = (resultJson.uniqueness + resultJson.clarity + resultJson.feasibility) / 3;
      if (avgScore >= 70) {
        completeModule('positioning-studio');
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
  
  const positioningStatement = isComplete
    ? `For ${positioning.targetMarket} who ${positioning.need}, ${positioning.product} is a ${positioning.category} that ${positioning.benefit}. Unlike ${positioning.competitor}, we ${positioning.differentiator}.`
    : '';
  
  return (
    <div>
      <h1 className="text-3xl font-bold font-heading mb-2">Positioning Studio</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        Craft a unique positioning statement and visualize your brand on the perceptual map.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Positioning Statement Builder */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold font-heading mb-4">Positioning Statement</h2>
          <div className="space-y-4">
            <InputField
              label="Target Market"
              placeholder="e.g., busy professionals aged 25-40"
              value={positioning.targetMarket}
              onChange={(v) => handleChange('targetMarket', v)}
              tooltip="Who is your ideal customer? Be specific about demographics, psychographics, and behaviors."
            />
            <InputField
              label="Need"
              placeholder="e.g., need convenient healthy meal options"
              value={positioning.need}
              onChange={(v) => handleChange('need', v)}
              tooltip="What problem or desire does your target market have? Focus on emotional and functional needs."
            />
            <InputField
              label="Product Name"
              placeholder="e.g., FreshBites"
              value={positioning.product}
              onChange={(v) => handleChange('product', v)}
              tooltip="Your brand or product name. Keep it memorable and brandable."
            />
            <InputField
              label="Category"
              placeholder="e.g., meal delivery service"
              value={positioning.category}
              onChange={(v) => handleChange('category', v)}
              tooltip="What category or industry does your product belong to? This helps customers understand what you offer."
            />
            <InputField
              label="Key Benefit"
              placeholder="e.g., delivers restaurant-quality meals in under 30 minutes"
              value={positioning.benefit}
              onChange={(v) => handleChange('benefit', v)}
              tooltip="What specific benefit does your product provide? Focus on outcomes, not features."
            />
            <InputField
              label="Main Competitor"
              placeholder="e.g., traditional meal prep services"
              value={positioning.competitor}
              onChange={(v) => handleChange('competitor', v)}
              tooltip="Who are you competing against? This helps establish your competitive context."
            />
            <InputField
              label="Key Differentiator"
              placeholder="e.g., focus on locally-sourced ingredients with zero waste packaging"
              value={positioning.differentiator}
              onChange={(v) => handleChange('differentiator', v)}
              tooltip="What makes you unique? This should be something competitors can't easily copy."
            />
          </div>
          
          {/* Preview */}
          {positioningStatement && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gradient-to-r from-coral-50 to-warm-yellow-50 dark:from-slate-700 dark:to-slate-600 rounded-xl"
            >
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Your Statement:</p>
              <p className="text-slate-800 dark:text-slate-100 leading-relaxed italic">
                "{positioningStatement}"
              </p>
            </motion.div>
          )}
        </div>
        
        {/* Perceptual Map */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold font-heading">Perceptual Map</h2>
            <select
              value={mapType}
              onChange={(e) => setMapType(e.target.value as MapType)}
              className="px-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none"
            >
              <option value="price-quality">Price vs Quality</option>
              <option value="innovation-tradition">Innovation vs Tradition</option>
              <option value="luxury-affordable">Luxury vs Affordable</option>
              <option value="convenience-customization">Convenience vs Customization</option>
              <option value="performance-design">Performance vs Design</option>
            </select>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Position your brand relative to competitors. Drag the blue dot to adjust.
          </p>
          
          <div className="relative w-full aspect-square bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden" id="perceptual-map">
            {/* Grid lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="1" />
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="1" />
            </svg>
            
            {/* Interactive Zones */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Top-Right Zone */}
              <div
                className={`absolute top-0 right-0 w-1/2 h-1/2 transition-all duration-200 ${
                  hoveredZone === 'premium' ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                }`}
                onMouseEnter={() => setHoveredZone('premium')}
                onMouseLeave={() => setHoveredZone(null)}
              >
                {hoveredZone === 'premium' && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-90">
                    💎 Premium Positioning
                  </div>
                )}
              </div>
              
              {/* Top-Left Zone */}
              <div
                className={`absolute top-0 left-0 w-1/2 h-1/2 transition-all duration-200 ${
                  hoveredZone === 'value' ? 'bg-green-100 dark:bg-green-900/30' : ''
                }`}
                onMouseEnter={() => setHoveredZone('value')}
                onMouseLeave={() => setHoveredZone(null)}
              >
                {hoveredZone === 'value' && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded opacity-90">
                    ⭐ Value Positioning
                  </div>
                )}
              </div>
              
              {/* Bottom-Right Zone */}
              <div
                className={`absolute bottom-0 right-0 w-1/2 h-1/2 transition-all duration-200 ${
                  hoveredZone === 'luxury-trap' ? 'bg-red-100 dark:bg-red-900/30' : ''
                }`}
                onMouseEnter={() => setHoveredZone('luxury-trap')}
                onMouseLeave={() => setHoveredZone(null)}
              >
                {hoveredZone === 'luxury-trap' && (
                  <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-90">
                    ⚠️ Luxury Trap
                  </div>
                )}
              </div>
              
              {/* Bottom-Left Zone */}
              <div
                className={`absolute bottom-0 left-0 w-1/2 h-1/2 transition-all duration-200 ${
                  hoveredZone === 'budget' ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''
                }`}
                onMouseEnter={() => setHoveredZone('budget')}
                onMouseLeave={() => setHoveredZone(null)}
              >
                {hoveredZone === 'budget' && (
                  <div className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded opacity-90">
                    💰 Budget Positioning
                  </div>
                )}
              </div>
            </div>
            
            {/* Axes Labels */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              {mapConfigs[mapType].yAxis.high}
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              {mapConfigs[mapType].yAxis.low}
            </div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-semibold text-slate-600 dark:text-slate-400">
              {mapConfigs[mapType].xAxis.low}
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-xs font-semibold text-slate-600 dark:text-slate-400">
              {mapConfigs[mapType].xAxis.high}
            </div>
            
            {/* Competitors */}
            {mapConfigs[mapType].competitors.map((comp) => (
              <div
                key={comp.id}
                className="absolute w-3 h-3 bg-slate-400 dark:bg-slate-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: `${comp.x}%`,
                  top: `${100 - comp.y}%`,
                }}
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs text-slate-600 dark:text-slate-400">
                  {comp.name}
                </div>
              </div>
            ))}
            
            {/* Your Brand (Draggable) */}
            <motion.div
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0}
              dragMomentum={false}
              onDragEnd={(_, info) => {
                const rect = info.point;
                const parent = document.getElementById('perceptual-map')?.getBoundingClientRect();
                if (parent) {
                  const x = Math.max(0, Math.min(100, ((rect.x - parent.left) / parent.width) * 100));
                  const y = Math.max(0, Math.min(100, 100 - ((rect.y - parent.top) / parent.height) * 100));
                  setYourBrand({ x, y });
                }
              }}
              className="absolute w-6 h-6 bg-gradient-to-br from-coral-500 to-warm-yellow-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-move z-10 flex items-center justify-center text-white font-bold text-xs shadow-lg ring-2 ring-white dark:ring-slate-800"
              style={{
                left: `${yourBrand.x}%`,
                top: `${100 - yourBrand.y}%`,
              }}
            >
              <span>YOU</span>
            </motion.div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600 dark:text-slate-400">Price Level:</span>
              <span className="ml-2 font-semibold text-slate-800 dark:text-slate-100">{Math.round(yourBrand.x)}%</span>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400">Quality Level:</span>
              <span className="ml-2 font-semibold text-slate-800 dark:text-slate-100">{Math.round(yourBrand.y)}%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Analysis Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            onClick={handleAnalyze}
            disabled={!isComplete || isLoading}
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
                Get AI Feedback
              </>
            )}
          </motion.button>
        </div>
        
        {/* Error */}
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
        
        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700"
            >
              <h2 className="text-2xl font-bold font-heading mb-6">AI Feedback</h2>
              
              {/* Scores */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <ScoreCard label="Uniqueness" score={feedback.uniqueness} />
                <ScoreCard label="Clarity" score={feedback.clarity} />
                <ScoreCard label="Feasibility" score={feedback.feasibility} />
              </div>
              
              {/* Overall Assessment */}
              <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <h3 className="text-lg font-semibold font-heading mb-2">Overall Assessment</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feedback.overallAssessment}
                </p>
              </div>
              
              {/* Competitive Intelligence */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <h3 className="text-lg font-semibold font-heading mb-2">Competitive Intelligence</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feedback.competitiveIntelligence}
                </p>
              </div>
              
              {/* Suggestions */}
              <div>
                <h3 className="text-lg font-semibold font-heading mb-3">Suggestions for Improvement</h3>
                <ul className="space-y-2">
                  {feedback.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex gap-2 text-slate-600 dark:text-slate-300">
                      <span className="text-coral-500 flex-shrink-0">💡</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Lab Navigation */}
      <LabNavigation
        currentLab="positioning-studio"
        completedLabs={[]}
        onNavigate={(lab) => window.location.hash = `#/${lab}`}
      />
    </div>
  );
};

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  tooltip?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, placeholder, value, onChange, tooltip }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
        {label}
        {tooltip && (
          <button
            type="button"
            className="ml-2 w-4 h-4 rounded-full bg-slate-400 dark:bg-slate-500 text-white text-xs flex items-center justify-center hover:bg-slate-500 dark:hover:bg-slate-400 transition-colors"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            ?
          </button>
        )}
      </label>
      
      {tooltip && showTooltip && (
        <div className="absolute top-0 left-0 z-10 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 text-xs p-2 rounded-lg shadow-lg max-w-xs">
          {tooltip}
          <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 dark:bg-slate-200 transform rotate-45"></div>
        </div>
      )}
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
      />
    </div>
  );
};

interface ScoreCardProps {
  label: string;
  score: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ label, score }) => {
  const color = score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red';
  const colorClasses = {
    green: 'from-green-400 to-green-500 text-green-900',
    yellow: 'from-yellow-400 to-yellow-500 text-yellow-900',
    red: 'from-red-400 to-red-500 text-red-900',
  };
  
  return (
    <div className={`p-4 bg-gradient-to-br ${colorClasses[color]} rounded-xl text-center`}>
      <p className="text-sm font-semibold mb-1 opacity-90">{label}</p>
      <motion.p
        className="text-4xl font-bold"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        {score}
      </motion.p>
      <p className="text-xs opacity-80">out of 100</p>
    </div>
  );
};

export default PositioningStudio;

