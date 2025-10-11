
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Groq from 'groq-sdk';
import type { Persona, AnalysisResult } from '../types';
import { Sparkles, RotateCw } from '../components/icons/Icons';
import { useAppStore } from '../store/useStore';
import LabNavigation from '../components/LabNavigation';

// Initialize Groq client outside the component
const groq = new Groq({ 
  apiKey: (import.meta as any).env?.VITE_GROQ_API_KEY || '',
  dangerouslyAllowBrowser: true 
});

const initialPersonas: Persona[] = [
    { id: 'p1', name: 'Tech-Savvy Tina', avatar: 'https://picsum.photos/seed/tina/100/100', details: { Age: '28', Occupation: 'Software Engineer', Hobbies: 'Gaming, Coding, Sci-fi movies' } },
    { id: 'p2', name: 'Eco-Conscious Eric', avatar: 'https://picsum.photos/seed/eric/100/100', details: { Age: '35', Occupation: 'Architect', Hobbies: 'Hiking, Gardening, Sustainable living' } },
    { id: 'p3', name: 'Budget Shopper Brenda', avatar: 'https://picsum.photos/seed/brenda/100/100', details: { Age: '45', Occupation: 'Teacher', Hobbies: 'Coupons, Reading, DIY projects' } },
    { id: 'p4', name: 'Luxury Larry', avatar: 'https://picsum.photos/seed/larry/100/100', details: { Age: '52', Occupation: 'CEO', Hobbies: 'Golf, Wine Tasting, Yachting' } },
    { id: 'p5', name: 'Student Sam', avatar: 'https://picsum.photos/seed/sam/100/100', details: { Age: '21', Occupation: 'University Student', Hobbies: 'Social media, Video games, Part-time jobs' } },
    { id: 'p6', name: 'Fitness Fiona', avatar: 'https://picsum.photos/seed/fiona/100/100', details: { Age: '31', Occupation: 'Personal Trainer', Hobbies: 'Marathons, Yoga, Healthy cooking' } },
];

const SegmentationLab: React.FC = () => {
    const [personas, setPersonas] = useState(initialPersonas);
    const [segment, setSegment] = useState<Persona[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    // New states for enhanced features
    const [showPersonaModal, setShowPersonaModal] = useState(false);
    const [customPersona, setCustomPersona] = useState({
        name: '', age: '', occupation: '', income: '',
        location: '', hobbies: '', painPoints: '', goals: ''
    });
    const [marketDescription, setMarketDescription] = useState('');
    const [isGeneratingPersonas, setIsGeneratingPersonas] = useState(false);
    
    // Get custom personas from store
    const customPersonas = useAppStore((state) => state.customPersonas);
    const addCustomPersona = useAppStore((state) => state.addCustomPersona);

    const handleAddToSegment = (item: Persona) => {
        if (!segment.find(p => p.id === item.id)) {
            setSegment((prev) => [...prev, item]);
            setPersonas((prev) => prev.filter(p => p.id !== item.id));
            setAnalysis(null); // Clear previous analysis when segment changes
        }
    };
    
    const handleRemoveFromSegment = (item: Persona) => {
        setPersonas((prev) => [...prev, item]);
        setSegment((prev) => prev.filter(p => p.id !== item.id));
        setAnalysis(null); // Clear previous analysis when segment changes
    };

    const handleReset = () => {
        setPersonas(initialPersonas);
        setSegment([]);
        setAnalysis(null);
        setError(null);
    };

    const incrementAI = useAppStore((state) => state.incrementAIInteractions);
    
    // Get all available personas (initial + custom)
    const allPersonas = [
        ...initialPersonas.filter(p => !segment.find(s => s.id === p.id)),
        ...customPersonas.map(cp => ({
            id: cp.id,
            name: cp.name,
            avatar: `https://picsum.photos/seed/${cp.name}/100/100`,
            details: {
                Age: cp.age,
                Occupation: cp.occupation,
                Income: cp.income,
                Location: cp.location,
                Hobbies: cp.hobbies,
                'Pain Points': cp.painPoints,
                Goals: cp.goals
            }
        })).filter(p => !segment.find(s => s.id === p.id))
    ];
    
    // Custom Persona Creation Functions
    const handleCreatePersona = () => {
        if (Object.values(customPersona).some(value => !value.trim())) {
            setError('Please fill in all fields');
            return;
        }
        
        addCustomPersona(customPersona);
        setCustomPersona({
            name: '', age: '', occupation: '', income: '',
            location: '', hobbies: '', painPoints: '', goals: ''
        });
        setShowPersonaModal(false);
        setError(null);
    };
    
    // AI Persona Generation Function
    const handleGeneratePersonas = async () => {
        if (!marketDescription.trim()) {
            setError('Please describe your target market');
            return;
        }
        
        setIsGeneratingPersonas(true);
        setError(null);
        
        const prompt = `Generate 3 customer personas for market: "${marketDescription}".
        
        Return ONLY valid JSON array with this exact format:
        [
          {
            "id": "unique_id_1",
            "name": "Persona Name",
            "avatar": "https://picsum.photos/seed/persona1/100/100",
            "age": "Age range",
            "occupation": "Job title",
            "income": "Income level",
            "location": "Geographic location",
            "hobbies": "Hobbies and interests",
            "painPoints": "Main challenges and pain points",
            "goals": "Primary goals and aspirations",
            "details": {
              "Age": "specific age or range",
              "Occupation": "job title",
              "Income": "income level",
              "Location": "geographic location",
              "Hobbies": "hobbies and interests",
              "Pain Points": "main challenges",
              "Goals": "primary goals"
            }
          }
        ]
        
        Make sure each persona has unique id and all required fields. Do not include any text outside the JSON array.`;
        
        try {
            const response = await groq.chat.completions.create({
                model: 'llama-3.1-8b-instant',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a marketing analyst. You MUST respond with ONLY valid JSON array. Never include any text before or after the JSON. Always use the exact field names and format requested.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 600
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
            let generatedPersonas;
            try {
                generatedPersonas = JSON.parse(resultText);
            } catch (parseError) {
                console.error('JSON Parse Error:', parseError);
                console.error('Raw response:', resultText);
                throw new Error('Invalid JSON response from AI. Please try again.');
            }
            
            // Validate persona structure
            if (!Array.isArray(generatedPersonas) || generatedPersonas.length === 0) {
                throw new Error('AI did not generate valid personas');
            }
            
            // Validate each persona has required fields
            generatedPersonas.forEach((persona: any, index: number) => {
                if (!persona.name || !persona.details) {
                    throw new Error(`Persona ${index + 1} is missing required fields`);
                }
                // Add missing fields if not present
                if (!persona.id) {
                    persona.id = `generated_${Date.now()}_${index}`;
                }
                if (!persona.avatar) {
                    persona.avatar = `https://picsum.photos/seed/${persona.name.replace(/\s+/g, '')}/100/100`;
                }
            });
            
            // Add generated personas to store
            generatedPersonas.forEach((persona: any) => {
                addCustomPersona(persona);
            });
            
            setMarketDescription('');
            incrementAI();
            
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            console.error('AI Persona Generation Error:', errorMessage, e);
            
            if (errorMessage.includes('API key')) {
                setError('API key not configured. Please add your Groq API key to the .env file.');
            } else if (errorMessage.includes('rate limit')) {
                setError('Rate limit exceeded. Please wait a moment and try again.');
            } else if (errorMessage.includes('timeout')) {
                setError('Request timed out. Please try again.');
            } else if (errorMessage.includes('Invalid JSON')) {
                setError('AI response format error. Please try again.');
            } else {
                setError(`Persona generation failed: ${errorMessage}. Please check your API key and try again.`);
            }
        } finally {
            setIsGeneratingPersonas(false);
        }
    };

    const handleAnalyzeSegment = async () => {
        try {
            // Validate API key first
            const apiKey = (import.meta as any).env?.VITE_GROQ_API_KEY;
            if (!apiKey) {
                setError('API key not configured. Please add VITE_GROQ_API_KEY to your .env file.');
                return;
            }

            if (segment.length === 0) {
                setError('Please add at least one persona to your segment');
                return;
            }

        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        const personaDescriptions = segment.map(p => 
            `Name: ${p.name}, Details: ${Object.entries(p.details).map(([key, value]) => `${key}: ${value}`).join(', ')}`
        ).join('; ');

        const prompt = `
            Analyze this customer segment consisting of personas: ${personaDescriptions}

            Return ONLY valid JSON with these exact fields:
            {
              "segmentName": "Name for this segment",
              "keyCharacteristics": "Brief description of key characteristics",
              "marketingStrategies": ["strategy 1", "strategy 2", "strategy 3"],
              "marketCoverage": number (0-100),
              "segmentCohesion": number (0-10),
              "competitivePosition": "Low" or "Medium" or "High",
              "viabilityScore": number (0-100),
              "demographicBreakdown": {
                "ageGroups": {"18-24": 20, "25-34": 30, "35-44": 50},
                "incomeLevels": {"<30k": 10, "30-50k": 30, "50-100k": 60}
              },
              "competitiveIntelligence": ["brand 1", "brand 2", "brand 3"],
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
                resultJson = JSON.parse(resultText) as AnalysisResult;
                
                // Ensure all required fields are present with defaults
                if (!resultJson.segmentName) resultJson.segmentName = 'Customer Segment';
                if (!resultJson.keyCharacteristics) resultJson.keyCharacteristics = 'No characteristics available';
                if (!resultJson.marketingStrategies || !Array.isArray(resultJson.marketingStrategies)) {
                    resultJson.marketingStrategies = ['Strategy data not available'];
                }
                
                // Ensure competitiveIntelligence is properly formatted
                if (resultJson.competitiveIntelligence && typeof resultJson.competitiveIntelligence === 'string') {
                    // Convert string to array if needed
                    resultJson.competitiveIntelligence = [resultJson.competitiveIntelligence];
                }
                
                // Ensure recommendations is an array
                if (resultJson.recommendations && !Array.isArray(resultJson.recommendations)) {
                    resultJson.recommendations = [resultJson.recommendations];
                }
                
                // Ensure demographicBreakdown has proper structure
                if (!resultJson.demographicBreakdown) {
                    resultJson.demographicBreakdown = {
                        ageGroups: {},
                        incomeLevels: {}
                    };
                }
                
            } catch (parseError) {
                console.error('JSON Parse Error:', parseError);
                console.error('Raw response:', resultText);
                throw new Error('Invalid JSON response from AI. Please try again.');
            }
            setAnalysis(resultJson);
            
            // Track AI interaction for gamification
            incrementAI();

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            console.error('AI Analysis Error:', errorMessage, e);
            
            if (errorMessage.includes('API key')) {
                setError('API key not configured. Please add your Groq API key to the .env file.');
            } else if (errorMessage.includes('rate limit')) {
                setError('Rate limit exceeded. Please wait a moment and try again.');
            } else if (errorMessage.includes('timeout')) {
                setError('Request timed out. Please try again.');
            } else if (errorMessage.includes('Invalid JSON')) {
                setError('AI response format error. Please try again.');
            } else {
                setError(`Analysis failed: ${errorMessage}. Please check your API key and try again.`);
            }
        } finally {
            setIsLoading(false);
        }
        } catch (outerError) {
            console.error('Outer error in handleAnalyzeSegment:', outerError);
            setError('An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };


    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold font-heading mb-1">Segmentation Lab</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Click on personas to create a market segment, then get an AI-powered analysis.</p>
            
            {/* AI Persona Generator */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 p-4 rounded-xl mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🤖</span>
                    <h2 className="text-lg font-bold">AI Persona Generator</h2>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                    Describe your target market and AI will create 3 personas automatically
                </p>
                <div className="flex gap-3 items-end">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={marketDescription}
                            onChange={(e) => setMarketDescription(e.target.value)}
                            placeholder="e.g., fitness enthusiasts aged 25-35 who value health"
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <motion.button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleGeneratePersonas();
                        }}
                        disabled={isGeneratingPersonas || !marketDescription.trim()}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isGeneratingPersonas ? (
                            <>
                                <RotateCw className="w-3 h-3 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-3 h-3" />
                                Generate
                            </>
                        )}
                    </motion.button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Persona Pool */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold font-heading">Available Personas</h2>
                        <motion.button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowPersonaModal(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-coral-500 to-warm-yellow-500 text-white font-semibold rounded-lg shadow-md hover:from-coral-600 hover:to-warm-yellow-600 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="text-lg">+</span>
                            Create Custom
                        </motion.button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[150px]">
                        <AnimatePresence>
                        {allPersonas.map(persona => (
                            <PersonaCard key={persona.id} persona={persona} onClick={handleAddToSegment} />
                        ))}
                        </AnimatePresence>
                         {allPersonas.length === 0 && (
                            <div className="col-span-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                                <p>All personas have been segmented.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Target Segment */}
                <div className="bg-deep-blue-50 dark:bg-slate-800/50 border-2 border-dashed border-coral-400 p-4 rounded-xl flex flex-col">
                    <h2 className="text-lg font-semibold font-heading mb-3 text-deep-blue-800 dark:text-deep-blue-200">Your Target Segment</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[150px] flex-grow">
                         <AnimatePresence>
                         {segment.map(persona => (
                            <motion.div
                                key={persona.id}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                className="bg-coral-100 dark:bg-coral-900/30 p-3 rounded-lg shadow-md border-2 border-coral-300 dark:border-coral-600 flex items-center cursor-pointer hover:shadow-lg transition-all duration-200"
                                onClick={() => handleRemoveFromSegment(persona)}
                                title="Click to remove"
                            >
                               <img src={persona.avatar} alt={persona.name} className="w-12 h-12 rounded-full mr-3 flex-shrink-0 object-cover" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm truncate">{persona.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Click to remove</p>
                                </div>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                        {segment.length === 0 && (
                            <div className="col-span-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                                <p>Click on an available persona to add them here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Controls and Analysis */}
            <div className="mt-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <motion.button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Analyze button clicked, preventing page reload');
                            handleAnalyzeSegment();
                        }}
                        disabled={segment.length === 0 || isLoading}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-coral-500 text-white font-semibold rounded-lg shadow-md hover:bg-coral-600 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed w-full sm:w-auto text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isLoading ? (
                            <>
                                <RotateCw className="w-4 h-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Analyze Segment
                            </>
                        )}
                    </motion.button>
                     <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleReset();
                        }}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors w-full sm:w-auto text-sm"
                    >
                        Reset Lab
                    </button>
                </div>

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

                <AnimatePresence>
                {analysis && (
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700"
                    >
                        <h2 className="text-2xl font-bold font-heading text-center mb-6">{analysis.segmentName}</h2>
                        
                        {/* Enhanced Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl text-center">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analysis.marketCoverage || 'N/A'}%</div>
                                <div className="text-sm text-blue-700 dark:text-blue-300">Market Coverage</div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-xl text-center">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{analysis.segmentCohesion || 'N/A'}/10</div>
                                <div className="text-sm text-green-700 dark:text-green-300">Segment Cohesion</div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-xl text-center">
                                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{analysis.competitivePosition || 'N/A'}</div>
                                <div className="text-sm text-purple-700 dark:text-purple-300">Competition</div>
                            </div>
                            <div className="bg-gradient-to-br from-coral-50 to-warm-yellow-50 dark:from-coral-900/30 dark:to-warm-yellow-800/30 p-4 rounded-xl text-center">
                                <div className="text-2xl font-bold text-coral-600 dark:text-coral-400">{analysis.viabilityScore || 'N/A'}/100</div>
                                <div className="text-sm text-coral-700 dark:text-coral-300">Viability Score</div>
                            </div>
                        </div>

                        {/* Demographic Breakdown */}
                        {analysis.demographicBreakdown && (
                            <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                <h3 className="text-lg font-semibold font-heading mb-4 text-slate-700 dark:text-slate-300">📊 Demographic Breakdown</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold text-slate-600 dark:text-slate-400 mb-2">Age Groups</h4>
                                        {Object.entries(analysis.demographicBreakdown.ageGroups || {}).map(([age, percentage]) => (
                                            <div key={age} className="flex items-center gap-3 mb-2">
                                                <span className="text-sm w-20">{age}</span>
                                                <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                    <div 
                                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" 
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-semibold w-12">{percentage}%</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-600 dark:text-slate-400 mb-2">Income Levels</h4>
                                        {Object.entries(analysis.demographicBreakdown.incomeLevels || {}).map(([income, percentage]) => (
                                            <div key={income} className="flex items-center gap-3 mb-2">
                                                <span className="text-sm w-20">{income}</span>
                                                <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                    <div 
                                                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" 
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-semibold w-12">{percentage}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Competitive Intelligence */}
                        {analysis.competitiveIntelligence && (
                            <div className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                                <h3 className="text-lg font-semibold font-heading mb-3 text-yellow-700 dark:text-yellow-300">🏢 Competitive Intelligence</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Similar segments are targeted by:</p>
                                {Array.isArray(analysis.competitiveIntelligence) ? (
                                    <ul className="space-y-1">
                                        {analysis.competitiveIntelligence.map((brand, index) => (
                                            <li key={index} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                                <span className="text-yellow-500">•</span>
                                                <span>{brand}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-slate-600 dark:text-slate-300">{analysis.competitiveIntelligence}</p>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold font-heading mb-2 text-deep-blue-700 dark:text-deep-blue-300">Key Characteristics</h3>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{analysis.keyCharacteristics}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold font-heading mb-2 text-deep-blue-700 dark:text-deep-blue-300">Marketing Strategies</h3>
                                {analysis.marketingStrategies && Array.isArray(analysis.marketingStrategies) && analysis.marketingStrategies.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                                        {analysis.marketingStrategies.map((strategy, index) => (
                                            <li key={index}>{strategy}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-slate-500 dark:text-slate-400 italic">No marketing strategies available</p>
                                )}
                            </div>
                        </div>

                        {/* Recommendations */}
                        {analysis.recommendations && analysis.recommendations.length > 0 && (
                            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl">
                                <h3 className="text-lg font-semibold font-heading mb-3 text-green-700 dark:text-green-300">💡 Recommendations</h3>
                                <ul className="space-y-2">
                                    {analysis.recommendations.map((recommendation, index) => (
                                        <li key={index} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                                            <span className="text-green-500 mt-1">💡</span>
                                            <span>{recommendation}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </motion.div>
                )}
                </AnimatePresence>
            </div>

            {/* Custom Persona Creator Modal */}
            <AnimatePresence>
                {showPersonaModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                        onClick={() => setShowPersonaModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold font-heading">Create Custom Persona</h2>
                                <button
                                    onClick={() => setShowPersonaModal(false)}
                                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={customPersona.name}
                                        onChange={(e) => setCustomPersona({...customPersona, name: e.target.value})}
                                        placeholder="e.g., Sarah Johnson"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Age *
                                    </label>
                                    <input
                                        type="text"
                                        value={customPersona.age}
                                        onChange={(e) => setCustomPersona({...customPersona, age: e.target.value})}
                                        placeholder="e.g., 28-35"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Occupation *
                                    </label>
                                    <input
                                        type="text"
                                        value={customPersona.occupation}
                                        onChange={(e) => setCustomPersona({...customPersona, occupation: e.target.value})}
                                        placeholder="e.g., Marketing Manager"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Income Level *
                                    </label>
                                    <select
                                        value={customPersona.income}
                                        onChange={(e) => setCustomPersona({...customPersona, income: e.target.value})}
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none"
                                    >
                                        <option value="">Select income level</option>
                                        <option value="Low ($0-30K)">Low ($0-30K)</option>
                                        <option value="Medium ($30K-80K)">Medium ($30K-80K)</option>
                                        <option value="High ($80K-150K)">High ($80K-150K)</option>
                                        <option value="Very High ($150K+)">Very High ($150K+)</option>
                                    </select>
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Location *
                                    </label>
                                    <input
                                        type="text"
                                        value={customPersona.location}
                                        onChange={(e) => setCustomPersona({...customPersona, location: e.target.value})}
                                        placeholder="e.g., San Francisco, CA"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none"
                                    />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Hobbies/Interests *
                                    </label>
                                    <textarea
                                        value={customPersona.hobbies}
                                        onChange={(e) => setCustomPersona({...customPersona, hobbies: e.target.value})}
                                        placeholder="e.g., Photography, Hiking, Cooking, Reading"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none resize-none"
                                        rows={2}
                                    />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Pain Points *
                                    </label>
                                    <textarea
                                        value={customPersona.painPoints}
                                        onChange={(e) => setCustomPersona({...customPersona, painPoints: e.target.value})}
                                        placeholder="e.g., Limited time for meal planning, expensive healthy food options"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none resize-none"
                                        rows={2}
                                    />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Goals *
                                    </label>
                                    <textarea
                                        value={customPersona.goals}
                                        onChange={(e) => setCustomPersona({...customPersona, goals: e.target.value})}
                                        placeholder="e.g., Eat healthier, save time on cooking, maintain work-life balance"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent outline-none resize-none"
                                        rows={2}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-4 justify-end">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowPersonaModal(false);
                                    }}
                                    className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleCreatePersona();
                                    }}
                                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-coral-500 to-warm-yellow-500 text-white font-semibold rounded-lg shadow-md hover:from-coral-600 hover:to-warm-yellow-600 transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Create Persona
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Lab Navigation */}
            <LabNavigation
                currentLab="segmentation-lab"
                completedLabs={[]}
                onNavigate={(lab) => window.location.hash = `#/${lab}`}
            />
        </div>
    );
};

interface PersonaCardProps {
    persona: Persona;
    onClick: (persona: Persona) => void;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ persona, onClick }) => {
    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => onClick(persona)}
            whileHover={{ y: -2, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
            className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg shadow-md cursor-pointer transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-600"
        >
            <div className="flex items-center">
                <img 
                    src={persona.avatar} 
                    alt={persona.name} 
                    className="w-12 h-12 rounded-full mr-3 flex-shrink-0 object-cover" 
                />
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{persona.name}</h3>
                    <div className="space-y-1">
                        {Object.entries(persona.details).slice(0, 3).map(([key, value]) => (
                            <p key={key} className="text-xs text-slate-600 dark:text-slate-300 truncate">
                                <strong>{key}:</strong> {value}
                            </p>
                        ))}
                        {Object.keys(persona.details).length > 3 && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                +{Object.keys(persona.details).length - 3} more
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


export default SegmentationLab;