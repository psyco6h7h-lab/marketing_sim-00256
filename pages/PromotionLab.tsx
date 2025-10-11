import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Groq from 'groq-sdk';
import { useAppStore } from '../store/useStore';
import { Sparkles, RotateCw } from '../components/icons/Icons';
import LabNavigation from '../components/LabNavigation';

const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true 
});

interface ChannelBudget {
  advertising: number;
  publicRelations: number;
  salesPromotion: number;
  personalSelling: number;
  directMarketing: number;
}

interface Tactic {
  id: string;
  name: string;
  description: string;
  cost: number; // percentage of channel budget
  reach: 'Low' | 'Medium' | 'High';
  bestFor: string[];
}

interface SelectedTactics {
  [channel: string]: string[];
}

interface CampaignTimeline {
  [tacticId: string]: {
    startWeek: number;
    duration: number;
  };
}

interface AIEvaluation {
  audienceAlignmentScore: number;
  budgetEfficiency: string;
  channelMixAnalysis: string;
  tacticSynergy: string;
  timingStrategy: string;
  competitorComparison: string;
  recommendations: string[];
  overallScore: number;
}

const PromotionLab: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [totalBudget, setTotalBudget] = useState(10000);
  const [campaignDuration, setCampaignDuration] = useState(3);
  const [objective, setObjective] = useState<'awareness' | 'engagement' | 'conversion'>('awareness');
  
  const [budgets, setBudgets] = useState<ChannelBudget>({
    advertising: 40,
    publicRelations: 15,
    salesPromotion: 20,
    personalSelling: 10,
    directMarketing: 15
  });
  
  const [selectedTactics, setSelectedTactics] = useState<SelectedTactics>({
    advertising: [],
    publicRelations: [],
    salesPromotion: [],
    personalSelling: [],
    directMarketing: []
  });
  
  const [timeline, setTimeline] = useState<CampaignTimeline>({});
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<AIEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const incrementAI = useAppStore((state) => state.incrementAIInteractions);
  const completeModule = useAppStore((state) => state.completeModule);
  const saveLabData = useAppStore((state) => state.saveLabData);
  const getLabData = useAppStore((state) => state.getLabData);
  
  // Load data from previous labs
  useEffect(() => {
    const productData = getLabData('product');
    const pricingData = getLabData('pricing');
    
    if (productData) {
      setProductName(productData.name || '');
    }
    if (pricingData) {
      // Adjust budget based on pricing strategy
      const baseBudget = pricingData.strategy === 'skimming' ? 15000 : 
                        pricingData.strategy === 'penetration' ? 8000 : 10000;
      setTotalBudget(baseBudget);
    }
  }, [getLabData]);
  
  const channels = {
    advertising: {
      name: 'Advertising',
      icon: '📺',
      color: 'from-blue-500 to-blue-600',
      description: 'Mass reach through paid media'
    },
    publicRelations: {
      name: 'Public Relations',
      icon: '📰',
      color: 'from-green-500 to-green-600',
      description: 'Building credibility and trust'
    },
    salesPromotion: {
      name: 'Sales Promotion',
      icon: '🎁',
      color: 'from-yellow-500 to-yellow-600',
      description: 'Short-term incentives to boost sales'
    },
    personalSelling: {
      name: 'Personal Selling',
      icon: '🤝',
      color: 'from-purple-500 to-purple-600',
      description: 'Direct interaction with customers'
    },
    directMarketing: {
      name: 'Direct Marketing',
      icon: '📧',
      color: 'from-coral-500 to-warm-yellow-500',
      description: 'Targeted communication to specific audiences'
    }
  };
  
  const tactics: { [key: string]: Tactic[] } = {
    advertising: [
      { id: 'tv', name: 'TV Commercials', description: 'Traditional broadcast advertising', cost: 40, reach: 'High', bestFor: ['Mass market', 'Brand awareness'] },
      { id: 'social', name: 'Social Media Ads', description: 'Facebook, Instagram, TikTok ads', cost: 25, reach: 'High', bestFor: ['Gen Z', 'Millennials', 'Targeted reach'] },
      { id: 'youtube', name: 'YouTube Pre-Roll', description: 'Video ads before content', cost: 20, reach: 'Medium', bestFor: ['All ages', 'Product demos'] },
      { id: 'podcast', name: 'Podcast Sponsorships', description: 'Sponsored content in podcasts', cost: 15, reach: 'Medium', bestFor: ['Niche audiences', 'Thought leadership'] },
      { id: 'billboard', name: 'Billboard/OOH', description: 'Outdoor advertising', cost: 30, reach: 'High', bestFor: ['Local markets', 'High-traffic areas'] },
      { id: 'influencer', name: 'Influencer Marketing', description: 'Collaboration with influencers', cost: 35, reach: 'Medium', bestFor: ['Authentic reach', 'Engagement'] }
    ],
    publicRelations: [
      { id: 'press', name: 'Press Releases', description: 'Media announcements', cost: 20, reach: 'Medium', bestFor: ['Credibility', 'News coverage'] },
      { id: 'interviews', name: 'Media Interviews', description: 'CEO/expert interviews', cost: 15, reach: 'Medium', bestFor: ['Thought leadership', 'Trust building'] },
      { id: 'events', name: 'Event Sponsorships', description: 'Sponsor industry events', cost: 35, reach: 'Medium', bestFor: ['Networking', 'B2B markets'] },
      { id: 'community', name: 'Community Engagement', description: 'Local community involvement', cost: 25, reach: 'Low', bestFor: ['Local markets', 'CSR'] },
      { id: 'csr', name: 'Social Responsibility', description: 'Cause marketing campaigns', cost: 30, reach: 'Medium', bestFor: ['Brand values', 'Millennials'] }
    ],
    salesPromotion: [
      { id: 'coupons', name: 'Coupons/Discounts', description: 'Price incentives', cost: 25, reach: 'High', bestFor: ['Price-sensitive', 'Quick sales'] },
      { id: 'samples', name: 'Free Samples', description: 'Product trials', cost: 35, reach: 'Medium', bestFor: ['New products', 'Risk reduction'] },
      { id: 'contests', name: 'Contests/Sweepstakes', description: 'Prize competitions', cost: 30, reach: 'High', bestFor: ['Engagement', 'Data collection'] },
      { id: 'loyalty', name: 'Loyalty Programs', description: 'Customer retention programs', cost: 20, reach: 'Medium', bestFor: ['Repeat customers', 'Long-term value'] },
      { id: 'limited', name: 'Limited-Time Offers', description: 'Urgency-driven promotions', cost: 15, reach: 'Medium', bestFor: ['Conversion', 'Inventory clearance'] }
    ],
    personalSelling: [
      { id: 'sales-team', name: 'Sales Team', description: 'Direct sales representatives', cost: 40, reach: 'Low', bestFor: ['B2B', 'High-value products'] },
      { id: 'trade-shows', name: 'Trade Shows', description: 'Industry exhibitions', cost: 35, reach: 'Medium', bestFor: ['B2B networking', 'Lead generation'] },
      { id: 'presentations', name: 'Sales Presentations', description: 'Product demonstrations', cost: 25, reach: 'Low', bestFor: ['Complex products', 'Enterprise sales'] },
      { id: 'demos', name: 'Product Demonstrations', description: 'Live product showcases', cost: 30, reach: 'Medium', bestFor: ['Product education', 'Trust building'] }
    ],
    directMarketing: [
      { id: 'email', name: 'Email Campaigns', description: 'Targeted email marketing', cost: 20, reach: 'Medium', bestFor: ['Nurturing', 'Personalization'] },
      { id: 'sms', name: 'SMS Marketing', description: 'Text message campaigns', cost: 25, reach: 'High', bestFor: ['Urgent messages', 'Mobile users'] },
      { id: 'direct-mail', name: 'Direct Mail', description: 'Physical mail campaigns', cost: 30, reach: 'Medium', bestFor: ['Older demographics', 'Tangible offers'] },
      { id: 'retargeting', name: 'Retargeting Ads', description: 'Follow users who visited', cost: 35, reach: 'Medium', bestFor: ['Conversion', 'Remarketing'] },
      { id: 'personalized', name: 'Personalized Offers', description: 'Customized promotions', cost: 40, reach: 'Low', bestFor: ['High-value customers', 'Luxury products'] }
    ]
  };
  
  const handleBudgetChange = (channel: keyof ChannelBudget, value: number) => {
    const newBudgets = { ...budgets, [channel]: value };
    setBudgets(newBudgets);
  };
  
  const handleTacticToggle = (channel: string, tacticId: string) => {
    const currentTactics = selectedTactics[channel] || [];
    const newTactics = currentTactics.includes(tacticId)
      ? currentTactics.filter(id => id !== tacticId)
      : [...currentTactics, tacticId];
    
    setSelectedTactics({
      ...selectedTactics,
      [channel]: newTactics
    });
  };
  
  const calculateTotalBudget = () => {
    return Object.values(budgets).reduce((sum, budget) => sum + budget, 0);
  };
  
  const calculateReach = () => {
    let totalReach = 0;
    let totalWeight = 0;
    
    Object.entries(selectedTactics).forEach(([channel, tacticIds]) => {
      const channelBudget = budgets[channel as keyof ChannelBudget];
      const channelWeight = channelBudget / totalBudget;
      
      tacticIds.forEach(tacticId => {
        const tactic = tactics[channel].find(t => t.id === tacticId);
        if (tactic) {
          const reachValue = tactic.reach === 'High' ? 3 : tactic.reach === 'Medium' ? 2 : 1;
          totalReach += reachValue * channelWeight;
          totalWeight += channelWeight;
        }
      });
    });
    
    return totalWeight > 0 ? (totalReach / totalWeight) : 0;
  };
  
  const handleAnalyze = async () => {
    // Validate API key first
    const apiKey = (import.meta as any).env?.VITE_GROQ_API_KEY;
    if (!apiKey) {
      setError('API key not configured. Please add VITE_GROQ_API_KEY to your .env file.');
      return;
    }

    if (!productName || !targetMarket || calculateTotalBudget() !== 100) {
      setError('Please complete all required fields and ensure budget totals 100%');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    const selectedTacticsList = Object.entries(selectedTactics)
      .flatMap(([channel, tacticIds]) => 
        tacticIds.map(tacticId => {
          const tactic = tactics[channel].find(t => t.id === tacticId);
          return tactic ? `${tactic.name} (${channel})` : null;
        }).filter(Boolean)
      );
    
    const prompt = `Analyze this promotional campaign strategy:
    Product: ${productName}
    Target Market: ${targetMarket}
    Campaign Objective: ${objective}
    Total Budget: $${totalBudget}
    Campaign Duration: ${campaignDuration} months
    Budget Allocation: Advertising ${budgets.advertising}%, Public Relations ${budgets.publicRelations}%, Sales Promotion ${budgets.salesPromotion}%, Personal Selling ${budgets.personalSelling}%, Direct Marketing ${budgets.directMarketing}%
    Selected Tactics: ${selectedTacticsList.join(', ')}
    Estimated Reach Score: ${calculateReach().toFixed(1)}/3
    
    Return ONLY valid JSON with these exact fields:
    {
      "audienceAlignmentScore": number (0-100),
      "budgetEfficiency": "brief analysis description",
      "channelMixAnalysis": "brief analysis description",
      "tacticSynergy": "brief analysis description",
      "timingStrategy": "brief analysis description",
      "competitorComparison": "brief comparison description",
      "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3", "recommendation 4"],
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
        max_tokens: 800
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
      saveLabData('promotion', {
        budget: totalBudget,
        mix: budgets,
        tactics: selectedTacticsList,
        objective: objective
      });
      
      if (result.overallScore >= 70) {
        completeModule('promotion-lab');
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
  
  const totalBudgetPercentage = calculateTotalBudget();
  const isBudgetValid = Math.abs(totalBudgetPercentage - 100) < 0.1;
  
  return (
    <div>
      <h1 className="text-3xl font-bold font-heading mb-2">Promotion Lab</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        Plan your promotional campaign by allocating budget across channels and selecting tactics. Get AI-powered campaign analysis.
      </p>
      
      {/* Campaign Context */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold font-heading mb-4">1. Campaign Context</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              Total Budget
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">$</span>
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Campaign Duration
            </label>
            <select
              value={campaignDuration}
              onChange={(e) => setCampaignDuration(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none"
            >
              <option value={1}>1 Month</option>
              <option value={3}>3 Months</option>
              <option value={6}>6 Months</option>
              <option value={12}>1 Year</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Campaign Objective
          </label>
          <div className="flex gap-4">
            {(['awareness', 'engagement', 'conversion'] as const).map(obj => (
              <label key={obj} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="objective"
                  value={obj}
                  checked={objective === obj}
                  onChange={(e) => setObjective(e.target.value as typeof objective)}
                  className="text-coral-500 focus:ring-coral-500"
                />
                <span className="text-sm font-medium capitalize">{obj}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      {/* Budget Allocation */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-2xl mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold font-heading">2. Budget Allocation</h2>
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isBudgetValid ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {totalBudgetPercentage.toFixed(1)}% allocated
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(channels).map(([key, channel]) => (
            <div key={key} className="bg-white dark:bg-slate-900 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{channel.icon}</span>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100">{channel.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{channel.description}</div>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Budget</span>
                  <span className="font-semibold">{budgets[key as keyof ChannelBudget]}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={budgets[key as keyof ChannelBudget]}
                  onChange={(e) => handleBudgetChange(key as keyof ChannelBudget, Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: channel.color.includes('blue') ? '#3b82f6' : 
                                          channel.color.includes('green') ? '#10b981' :
                                          channel.color.includes('yellow') ? '#f59e0b' :
                                          channel.color.includes('purple') ? '#8b5cf6' : '#f97316' }}
                />
              </div>
              
              <div className="text-sm text-slate-600 dark:text-slate-400">
                ${((budgets[key as keyof ChannelBudget] / 100) * totalBudget).toFixed(0)}
              </div>
            </div>
          ))}
        </div>
        
        {!isBudgetValid && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
            <div className="text-sm text-red-800 dark:text-red-200">
              ⚠️ Budget allocation must total 100%. Current total: {totalBudgetPercentage.toFixed(1)}%
            </div>
          </div>
        )}
      </div>
      
      {/* Tactic Selection */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold font-heading mb-4">3. Select Tactics</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Choose specific tactics for each channel. Budget allocation determines which tactics are available.
        </p>
        
        <div className="space-y-6">
          {Object.entries(channels).map(([channelKey, channel]) => (
            <div key={channelKey} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{channel.icon}</span>
                <h3 className="text-lg font-semibold">{channel.name}</h3>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  (${((budgets[channelKey as keyof ChannelBudget] / 100) * totalBudget).toFixed(0)} budget)
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {tactics[channelKey].map(tactic => {
                  const isSelected = selectedTactics[channelKey]?.includes(tactic.id) || false;
                  const canAfford = tactic.cost <= budgets[channelKey as keyof ChannelBudget];
                  
                  return (
                    <label
                      key={tactic.id}
                      className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                        isSelected 
                          ? 'border-coral-500 bg-coral-50 dark:bg-coral-900/20' 
                          : canAfford 
                            ? 'border-slate-200 dark:border-slate-700 hover:border-coral-300' 
                            : 'border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={!canAfford}
                          onChange={() => handleTacticToggle(channelKey, tactic.id)}
                          className="mt-1 rounded text-coral-500 focus:ring-coral-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-slate-800 dark:text-slate-100">
                            {tactic.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                            {tactic.description}
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className={`px-2 py-1 rounded-full ${
                              tactic.reach === 'High' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                              tactic.reach === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            }`}>
                              {tactic.reach} Reach
                            </span>
                            <span className="text-slate-500">{tactic.cost}% of budget</span>
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Campaign Metrics */}
      <div className="bg-gradient-to-br from-coral-50 to-warm-yellow-50 dark:from-slate-800 dark:to-slate-700 p-8 rounded-2xl shadow-xl mb-8">
        <h2 className="text-2xl font-bold font-heading text-center mb-6">📊 Campaign Metrics</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl text-center">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Budget</div>
            <div className="text-3xl font-bold text-coral-600 dark:text-coral-400">
              ${totalBudget.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl text-center">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Channels Used</div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {Object.values(budgets).filter(b => b > 0).length}/5
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl text-center">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Tactics Selected</div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {Object.values(selectedTactics).flat().length}
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl text-center">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Reach Score</div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {calculateReach().toFixed(1)}/3
            </div>
          </div>
        </div>
        
        {/* Budget Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Budget Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(channels).map(([key, channel]) => {
              const budget = budgets[key as keyof ChannelBudget];
              const amount = (budget / 100) * totalBudget;
              const selectedCount = selectedTactics[key]?.length || 0;
              
              return budget > 0 ? (
                <div key={key} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{channel.icon}</span>
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-100">{channel.name}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {selectedCount} tactics selected
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-800 dark:text-slate-100">
                      ${amount.toFixed(0)}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {budget}%
                    </div>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
      
      {/* Analyze Button */}
      <div className="flex justify-center mb-8">
        <motion.button
          onClick={handleAnalyze}
          disabled={!productName || !targetMarket || !isBudgetValid || isLoading}
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
              Analyze Campaign
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
            <h2 className="text-2xl font-bold font-heading text-center mb-6">Campaign Evaluation</h2>
            
            {/* Overall Score */}
            <div className="flex justify-center mb-8">
              <div className={`p-6 rounded-2xl text-center ${
                evaluation.overallScore >= 70 ? 'bg-green-100 dark:bg-green-900/30' :
                evaluation.overallScore >= 50 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                'bg-red-100 dark:bg-red-900/30'
              }`}>
                <div className={`text-5xl font-bold mb-2 ${
                  evaluation.overallScore >= 70 ? 'text-green-600 dark:text-green-400' :
                  evaluation.overallScore >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {evaluation.overallScore}%
                </div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Overall Score
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Audience Alignment */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-3">
                  🎯 Audience Alignment ({evaluation.audienceAlignmentScore}%)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {evaluation.budgetEfficiency}
                </p>
              </div>
              
              {/* Channel Mix Analysis */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-3">
                  📊 Channel Mix Analysis
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {evaluation.channelMixAnalysis}
                </p>
              </div>
              
              {/* Tactic Synergy */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-3">
                  🔗 Tactic Synergy
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {evaluation.tacticSynergy}
                </p>
              </div>
              
              {/* Timing Strategy */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-300 mb-3">
                  ⏰ Timing Strategy
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {evaluation.timingStrategy}
                </p>
              </div>
            </div>
            
            {/* Competitor Comparison */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl mb-6">
              <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
                🏢 Competitor Comparison
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
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
        currentLab="promotion-lab"
        completedLabs={[]}
        onNavigate={(lab) => window.location.hash = `#/${lab}`}
      />
    </div>
  );
};

export default PromotionLab;

