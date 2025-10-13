import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, Clock, Trophy, Target, Zap } from '../components/icons/Icons';
import { useAppStore } from '../store/useStore';
import Groq from 'groq-sdk';

const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY || '', 
  dangerouslyAllowBrowser: true 
});

// Enhanced concept structure with rich content
const concepts = [
  {
    id: 'marketing-mix',
    title: "The 4 Ps of Marketing",
    icon: "📊",
    gradient: "from-blue-500 to-purple-600",
    overview: {
      what: "The Marketing Mix is the foundation of marketing strategy, consisting of four key elements that work together to create value for customers.",
      why: "Mastering these four elements allows businesses to create cohesive marketing strategies that effectively reach and convert their target audience."
    },
    keyConcepts: [
      {
        name: "Product",
        icon: "📦",
        description: "What you're selling - the goods or services that fulfill customer needs",
        examples: ["iPhone - Innovation focus", "Tesla - Premium quality", "McDonald's - Consistent taste"],
        color: "blue"
      },
      {
        name: "Price",
        icon: "💰",
        description: "How much customers pay - pricing strategy that reflects value and market position",
        examples: ["Apple - Premium pricing", "Walmart - Low prices", "Uber - Dynamic pricing"],
        color: "green"
      },
      {
        name: "Place",
        icon: "🏪",
        description: "Where customers can buy - distribution channels and accessibility",
        examples: ["Amazon - Online dominance", "Starbucks - Everywhere", "Tesla - Direct sales"],
        color: "orange"
      },
      {
        name: "Promotion",
        icon: "📢",
        description: "How you communicate value - marketing communications and advertising",
        examples: ["Nike - Emotional branding", "Coca-Cola - Global campaigns", "Red Bull - Event marketing"],
        color: "red"
      }
    ],
    realWorldExamples: [
      {
        company: "Apple",
        strategy: "Premium Product + Premium Price + Exclusive Distribution + Emotional Promotion",
        result: "Market leader with highest profit margins in smartphone industry"
      },
      {
        company: "McDonald's",
        strategy: "Consistent Product + Affordable Price + Global Placement + Family Promotion",
        result: "World's largest restaurant chain with 38,000+ locations"
      }
    ],
    keyTakeaways: [
      "All 4Ps must work together harmoniously",
      "Customer needs should drive decisions in each P",
      "Consistency across all Ps builds strong brand",
      "Regular review and adjustment is essential"
    ]
  },
  {
    id: 'stp-framework',
    title: "STP: Segmentation, Targeting, Positioning",
    icon: "🎯",
    gradient: "from-green-500 to-teal-600",
    overview: {
      what: "The STP model is a strategic approach to identify and serve your ideal customers through three sequential steps.",
      why: "This framework helps businesses focus resources on the most profitable customer segments and create compelling value propositions."
    },
    keyConcepts: [
      {
        name: "Segmentation",
        icon: "🔍",
        description: "Dividing the market into distinct groups with similar characteristics",
        examples: ["Demographic - Age groups", "Psychographic - Lifestyle", "Behavioral - Usage patterns"],
        color: "blue"
      },
      {
        name: "Targeting",
        icon: "🎯",
        description: "Selecting the most attractive segments to focus marketing efforts",
        examples: ["Tesla - Luxury EV buyers", "Spotify - Music streaming users", "Peloton - Fitness enthusiasts"],
        color: "green"
      },
      {
        name: "Positioning",
        icon: "📍",
        description: "Creating a unique image and value proposition in customers' minds",
        examples: ["BMW - Ultimate driving machine", "Volvo - Safety first", "Harley-Davidson - Freedom"],
        color: "orange"
      }
    ],
    realWorldExamples: [
      {
        company: "Tesla",
        strategy: "Segments luxury EV market → Targets affluent tech enthusiasts → Positions as premium innovation leader",
        result: "Dominates high-end EV market with cult-like brand loyalty"
      },
      {
        company: "Dollar Shave Club",
        strategy: "Segments men's grooming → Targets price-conscious men → Positions against expensive razors",
        result: "Disrupted Gillette's dominance with $1B acquisition"
      }
    ],
    keyTakeaways: [
      "Segmentation must be measurable and actionable",
      "Target segments should be profitable and reachable",
      "Positioning requires clear differentiation",
      "Regular reassessment keeps strategy relevant"
    ]
  },
  {
    id: 'marketing-funnel',
    title: "The Marketing Funnel",
    icon: "🔄",
    gradient: "from-purple-500 to-pink-600",
    overview: {
      what: "The marketing funnel visualizes the customer journey from initial awareness to final purchase and beyond.",
      why: "Understanding each stage helps create targeted strategies that guide prospects through the buying process effectively."
    },
    keyConcepts: [
      {
        name: "Awareness",
        icon: "👁️",
        description: "Customers first learn about your brand or product",
        examples: ["Social media ads", "Content marketing", "PR campaigns"],
        color: "blue"
      },
      {
        name: "Interest",
        icon: "🤔",
        description: "Prospects show interest and seek more information",
        examples: ["Email signups", "Website visits", "Brochure downloads"],
        color: "green"
      },
      {
        name: "Consideration",
        icon: "⚖️",
        description: "Prospects evaluate options and compare alternatives",
        examples: ["Product demos", "Free trials", "Comparison charts"],
        color: "orange"
      },
      {
        name: "Purchase",
        icon: "🛒",
        description: "Prospects become customers through transaction",
        examples: ["Sales calls", "Special offers", "Limited time deals"],
        color: "red"
      }
    ],
    realWorldExamples: [
      {
        company: "HubSpot",
        strategy: "Awareness through free content → Interest via valuable resources → Consideration with free tools → Purchase through premium features",
        result: "Built $1B+ business through inbound marketing funnel"
      },
      {
        company: "Shopify",
        strategy: "Awareness through entrepreneurship content → Interest with free trials → Consideration via success stories → Purchase through easy setup",
        result: "Powers 1.7M+ businesses globally"
      }
    ],
    keyTakeaways: [
      "Each stage requires different marketing tactics",
      "Not all prospects move through linearly",
      "Nurturing is crucial for conversion",
      "Post-purchase experience affects retention"
    ]
  },
  {
    id: 'brand-equity',
    title: "Brand Equity",
    icon: "⭐",
    gradient: "from-yellow-500 to-orange-600",
    overview: {
      what: "Brand equity is the value a company generates from having a recognizable and trusted brand name compared to generic alternatives.",
      why: "Strong brand equity leads to customer loyalty, premium pricing power, and sustainable competitive advantage."
    },
    keyConcepts: [
      {
        name: "Brand Awareness",
        icon: "🔔",
        description: "How well customers recognize and recall your brand",
        examples: ["Coca-Cola - 94% global recognition", "Apple - Universal tech icon", "McDonald's - Golden arches everywhere"],
        color: "blue"
      },
      {
        name: "Brand Associations",
        icon: "🧠",
        description: "Mental connections customers make with your brand",
        examples: ["Nike - Just do it", "BMW - Ultimate driving", "Disney - Magic and happiness"],
        color: "green"
      },
      {
        name: "Perceived Quality",
        icon: "💎",
        description: "Customer perception of product or service quality",
        examples: ["Rolex - Luxury timepieces", "Mercedes - German engineering", "Ritz-Carlton - Luxury hospitality"],
        color: "orange"
      },
      {
        name: "Brand Loyalty",
        icon: "❤️",
        description: "Customer attachment and repeat purchase behavior",
        examples: ["iPhone users rarely switch", "Starbucks daily customers", "Amazon Prime members"],
        color: "red"
      }
    ],
    realWorldExamples: [
      {
        company: "Apple",
        strategy: "Built premium associations → Created emotional connection → Maintained quality standards → Fostered community loyalty",
        result: "Most valuable brand globally ($482B brand value)"
      },
      {
        company: "Tesla",
        strategy: "Innovation associations → Sustainability values → Cutting-edge quality → Cult-like loyalty",
        result: "Revolutionized automotive industry without traditional advertising"
      }
    ],
    keyTakeaways: [
      "Brand equity takes years to build but can be lost quickly",
      "Consistent messaging reinforces brand associations",
      "Quality delivery builds trust and loyalty",
      "Emotional connection drives premium pricing"
    ]
  },
  {
    id: 'customer-journey',
    title: "Customer Journey Mapping",
    icon: "🗺️",
    gradient: "from-indigo-500 to-blue-600",
    overview: {
      what: "Customer journey mapping creates a visual story of every experience customers have with your brand across all touchpoints.",
      why: "Understanding the complete customer experience helps identify pain points, opportunities, and moments that drive purchase decisions."
    },
    keyConcepts: [
      {
        name: "Touchpoints",
        icon: "👆",
        description: "Every point where customers interact with your brand",
        examples: ["Website visits", "Social media", "Store visits", "Customer service"],
        color: "blue"
      },
      {
        name: "Emotions",
        icon: "😊",
        description: "Feelings customers experience at each stage",
        examples: ["Excitement - Discovery", "Frustration - Complex process", "Satisfaction - Easy purchase"],
        color: "green"
      },
      {
        name: "Pain Points",
        icon: "😤",
        description: "Problems or obstacles customers encounter",
        examples: ["Slow loading", "Confusing navigation", "Long wait times"],
        color: "orange"
      },
      {
        name: "Opportunities",
        icon: "💡",
        description: "Moments to exceed expectations and delight",
        examples: ["Personalized recommendations", "Quick support", "Unexpected perks"],
        color: "purple"
      }
    ],
    realWorldExamples: [
      {
        company: "Airbnb",
        strategy: "Maps entire trip experience → Identifies booking anxiety → Creates trust through reviews → Enhances with local tips",
        result: "Revolutionized travel with seamless end-to-end experience"
      },
      {
        company: "Zappos",
        strategy: "Maps shoe shopping journey → Identifies return concerns → Offers free returns → Surprises with service",
        result: "Built $1B business on customer experience excellence"
      }
    ],
    keyTakeaways: [
      "Customer journey is rarely linear",
      "Emotions drive decisions more than logic",
      "Small improvements can have big impact",
      "Regular updates keep maps relevant"
    ]
  },
  {
    id: 'marketing-mix-modeling',
    title: "Marketing Mix Modeling",
    icon: "📈",
    gradient: "from-emerald-500 to-green-600",
    overview: {
      what: "Marketing Mix Modeling (MMM) uses statistical analysis to quantify the impact of different marketing activities on sales and ROI.",
      why: "This data-driven approach helps optimize budget allocation, measure true marketing effectiveness, and forecast future performance."
    },
    keyConcepts: [
      {
        name: "Attribution",
        icon: "📊",
        description: "Determining which marketing activities drive sales",
        examples: ["TV ads driving online sales", "Social media boosting brand awareness", "Email nurturing conversions"],
        color: "blue"
      },
      {
        name: "ROI Measurement",
        icon: "💰",
        description: "Calculating return on investment for each channel",
        examples: ["Paid search: 4:1 ROI", "Social media: 2:1 ROI", "Content marketing: 3:1 ROI"],
        color: "green"
      },
      {
        name: "Budget Optimization",
        icon: "⚖️",
        description: "Allocating resources to highest-performing channels",
        examples: ["Shift budget to high-ROI channels", "Reduce spend on low performers", "Test new channels"],
        color: "orange"
      },
      {
        name: "Forecasting",
        icon: "🔮",
        description: "Predicting future performance based on historical data",
        examples: ["Sales projections", "Budget planning", "Channel performance predictions"],
        color: "purple"
      }
    ],
    realWorldExamples: [
      {
        company: "Procter & Gamble",
        strategy: "Uses MMM to analyze $10B+ marketing spend → Identifies TV advertising effectiveness → Optimizes digital vs traditional mix",
        result: "Improved marketing efficiency by 20% while maintaining sales growth"
      },
      {
        company: "Unilever",
        strategy: "Implements MMM across 400+ brands → Measures cross-channel impact → Optimizes global media spend",
        result: "Achieved 15% improvement in marketing ROI"
      }
    ],
    keyTakeaways: [
      "MMM requires clean, comprehensive data",
      "Cross-channel effects are crucial to measure",
      "Regular model updates maintain accuracy",
      "Actionable insights drive better decisions"
    ]
  },
  {
    id: 'swot-analysis',
    title: "SWOT Analysis",
    icon: "🔍",
    gradient: "from-red-500 to-pink-600",
    overview: {
      what: "SWOT Analysis examines internal Strengths and Weaknesses, plus external Opportunities and Threats to inform strategic decisions.",
      why: "This framework provides a clear picture of your competitive position and helps develop strategies that leverage advantages while addressing challenges."
    },
    keyConcepts: [
      {
        name: "Strengths",
        icon: "💪",
        description: "Internal advantages and capabilities you control",
        examples: ["Strong brand reputation", "Skilled team", "Unique technology", "Financial resources"],
        color: "green"
      },
      {
        name: "Weaknesses",
        icon: "⚠️",
        description: "Internal limitations and areas needing improvement",
        examples: ["Limited budget", "Small team", "Outdated systems", "Market gaps"],
        color: "red"
      },
      {
        name: "Opportunities",
        icon: "🚀",
        description: "External market conditions you can capitalize on",
        examples: ["Growing market", "New technology", "Changing regulations", "Competitor weaknesses"],
        color: "blue"
      },
      {
        name: "Threats",
        icon: "⚠️",
        description: "External challenges that could impact your business",
        examples: ["New competitors", "Economic downturn", "Technology disruption", "Regulatory changes"],
        color: "orange"
      }
    ],
    realWorldExamples: [
      {
        company: "Netflix",
        strategy: "Strengths: Content library → Weaknesses: High costs → Opportunities: Global expansion → Threats: Disney+ competition",
        result: "Adapted strategy to focus on original content and international markets"
      },
      {
        company: "Kodak",
        strategy: "Strengths: Film expertise → Weaknesses: Digital resistance → Opportunities: Digital photography → Threats: Smartphone cameras",
        result: "Failed to adapt, declared bankruptcy in 2012"
      }
    ],
    keyTakeaways: [
      "Be honest and objective in assessment",
      "Regular updates keep analysis relevant",
      "Use insights to inform strategy",
      "Focus on actionable items"
    ]
  },
  {
    id: 'competitive-advantage',
    title: "Competitive Advantage",
    icon: "🏆",
    gradient: "from-amber-500 to-yellow-600",
    overview: {
      what: "Competitive advantage is what sets your business apart and gives you an edge over competitors in the marketplace.",
      why: "Sustainable competitive advantage is difficult for competitors to replicate and provides long-term profitability and market leadership."
    },
    keyConcepts: [
      {
        name: "Cost Leadership",
        icon: "💸",
        description: "Offering products at lower prices than competitors",
        examples: ["Walmart - Everyday low prices", "Southwest Airlines - Low-cost flights", "IKEA - Affordable furniture"],
        color: "blue"
      },
      {
        name: "Differentiation",
        icon: "✨",
        description: "Providing unique features, quality, or service",
        examples: ["Apple - Design innovation", "Tesla - Electric vehicles", "Patagonia - Environmental values"],
        color: "green"
      },
      {
        name: "Focus Strategy",
        icon: "🎯",
        description: "Concentrating on specific market segments",
        examples: ["Ferrari - Luxury sports cars", "Whole Foods - Organic foods", "Pixar - Animated films"],
        color: "orange"
      },
      {
        name: "Innovation",
        icon: "🚀",
        description: "Creating new products, services, or business models",
        examples: ["Amazon - E-commerce platform", "Uber - Ride-sharing", "Airbnb - Home sharing"],
        color: "purple"
      }
    ],
    realWorldExamples: [
      {
        company: "Amazon",
        strategy: "Combines cost leadership (competitive prices) + differentiation (Prime benefits) + innovation (AWS, Alexa)",
        result: "Became world's most valuable company through multiple advantages"
      },
      {
        company: "Costco",
        strategy: "Focus on bulk buying + cost leadership + member exclusivity + limited selection efficiency",
        result: "Consistently high profitability and customer loyalty"
      }
    ],
    keyTakeaways: [
      "Sustainable advantage is hard to copy",
      "Multiple advantages are stronger than one",
      "Regular innovation maintains advantage",
      "Customer value drives advantage"
    ]
  }
];

// Quiz question types
type QuestionType = 'mcq' | 'truefalse' | 'fill' | 'scenario';

interface QuizQuestion {
  id: string;
  type: QuestionType;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  theoryLink: string;
  concept: string;
}

interface QuizSession {
  conceptId: string;
  mode: 'practice' | 'timed' | 'speedrun' | 'exam';
  startTime: number;
  questions: QuizQuestion[];
  answers: { [questionId: string]: string };
  currentDifficulty: string;
  accuracy: number;
  timePerQuestion: number[];
}

const Marketing101: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [scrollProgress, setScrollProgress] = useState<{ [key: number]: number }>({});
  const [quizUnlocked, setQuizUnlocked] = useState<{ [key: number]: boolean }>({});
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [quizMode, setQuizMode] = useState<'practice' | 'timed'>('practice');
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [quizResults, setQuizResults] = useState<{
    show: boolean;
    concept: string;
    stats: {
      questionsAnswered: number;
      correctAnswers: number;
      accuracy: number;
      timeTaken: number;
      averageTimePerQuestion: number;
      maxDifficulty: string;
      mode: string;
    };
    xpEarned: {
      base: number;
      accuracy: number;
      difficulty: number;
      speed: number;
      total: number;
    };
    aiFeedback: string;
  } | null>(null);
  
  const sectionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const incrementQuizzes = useAppStore((state) => state.incrementQuizzes);
  const completeModule = useAppStore((state) => state.completeModule);
  const earnXP = useAppStore((state) => state.earnXP);
  const addLeaderboardEntry = useAppStore((state) => state.addLeaderboardEntry);
  const updateQuizAnalytics = useAppStore((state) => state.updateQuizAnalytics);

  // Track scroll progress for each concept
  useEffect(() => {
    const handleScroll = () => {
      concepts.forEach((_, index) => {
        const element = sectionRefs.current[index];
        if (element && openIndex === index) {
          const rect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const elementTop = rect.top + scrollTop;
          const elementHeight = rect.height;
          const windowHeight = window.innerHeight;
          
          const scrollProgress = Math.max(0, Math.min(100, 
            ((scrollTop + windowHeight - elementTop) / elementHeight) * 100
          ));
          
          setScrollProgress(prev => ({ ...prev, [index]: scrollProgress }));
          
          // Unlock quiz when scrolled to bottom
          if (scrollProgress >= 95 && !quizUnlocked[index]) {
            setQuizUnlocked(prev => ({ ...prev, [index]: true }));
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [openIndex, quizUnlocked]);

  // Timer effect
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timerActive && timeLeft === 0) {
      handleSubmitAnswer();
    }
  }, [timerActive, timeLeft]);

  const generateAIQuestion = async (conceptId: string, difficulty: string, previousQuestions: QuizQuestion[] = []): Promise<QuizQuestion> => {
    const concept = concepts.find(c => c.id === conceptId);
    if (!concept) throw new Error('Concept not found');

    const questionTypes = ['mcq', 'truefalse', 'fill', 'scenario'];
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    const prompt = `Generate a ${difficulty} level marketing question about "${concept.title}".

Concept Overview: ${concept.overview.what}
Key Concepts: ${concept.keyConcepts.map(kc => kc.name + ': ' + kc.description).join(', ')}

Question Type: ${questionType}
Difficulty: ${difficulty}

Requirements:
- Make it practical and real-world relevant
- Focus on application, not just memorization
- Include specific examples when possible
- Ensure only one correct answer
- Make distractors plausible but clearly wrong

Return ONLY a JSON object with this structure:
{
  "question": "Your question here",
  "options": ["Option A", "Option B", "Option C", "Option D"] (only for MCQ),
  "correctAnswer": "The correct answer",
  "explanation": "Why this answer is correct and why others are wrong",
  "theoryLink": "Which key concept this relates to"
}`;

    try {
      const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a marketing education expert. Generate high-quality quiz questions that test understanding, not memorization. Return only valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 500,
      });

      let responseText = response?.choices?.[0]?.message?.content?.trim() || '';
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const questionData = JSON.parse(responseText);
      
      return {
        id: `${Date.now()}-${Math.random()}`,
        type: questionType as QuestionType,
        difficulty: difficulty as 'easy' | 'medium' | 'hard' | 'expert',
        question: questionData.question,
        options: questionData.options || [],
        correctAnswer: questionData.correctAnswer,
        explanation: questionData.explanation,
        theoryLink: questionData.theoryLink,
        concept: concept.title
      };
    } catch (error) {
      console.error('Error generating question:', error);
      // Fallback question
      return {
        id: `${Date.now()}-${Math.random()}`,
        type: 'mcq',
        difficulty: 'easy',
        question: `What is the main purpose of ${concept.title}?`,
        options: ['To increase sales', 'To improve customer experience', 'To reduce costs', 'To expand globally'],
        correctAnswer: 'To improve customer experience',
        explanation: `This is a basic question about ${concept.title}. The correct answer demonstrates understanding of the core concept.`,
        theoryLink: 'Overview',
        concept: concept.title
      };
    }
  };

  const startQuiz = async (conceptIndex: number) => {
    const concept = concepts[conceptIndex];
    setIsGeneratingQuestion(true);
    
    try {
      const firstQuestion = await generateAIQuestion(concept.id, 'easy');
      
      const session: QuizSession = {
        conceptId: concept.id,
        mode: quizMode,
        startTime: Date.now(),
        questions: [firstQuestion],
        answers: {},
        currentDifficulty: 'easy',
        accuracy: 100,
        timePerQuestion: []
      };
      
      setQuizSession(session);
      setCurrentQuestion(firstQuestion);
      setActiveQuiz(conceptIndex);
      setUserAnswer('');
      setShowFeedback(false);
      
      if (quizMode === 'timed') {
        setTimeLeft(30);
        setTimerActive(true);
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const generateNextQuestion = async () => {
    if (!quizSession || !currentQuestion) return;
    
    setIsGeneratingQuestion(true);
    
    try {
      // Calculate current accuracy
      const answeredQuestions = Object.keys(quizSession.answers).length;
      const correctAnswers = Object.values(quizSession.answers).filter(answer => 
        answer === currentQuestion.correctAnswer
      ).length;
      const accuracy = answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 100;
      
      // Adjust difficulty based on performance
      let newDifficulty = quizSession.currentDifficulty;
      if (accuracy >= 80 && quizSession.currentDifficulty !== 'expert') {
        newDifficulty = quizSession.currentDifficulty === 'easy' ? 'medium' : 
                       quizSession.currentDifficulty === 'medium' ? 'hard' : 'expert';
      } else if (accuracy < 50 && quizSession.currentDifficulty !== 'easy') {
        newDifficulty = quizSession.currentDifficulty === 'expert' ? 'hard' :
                       quizSession.currentDifficulty === 'hard' ? 'medium' : 'easy';
      }
      
      const nextQuestion = await generateAIQuestion(quizSession.conceptId, newDifficulty, quizSession.questions);
      
      setQuizSession(prev => prev ? {
        ...prev,
        questions: [...prev.questions, nextQuestion],
        currentDifficulty: newDifficulty,
        accuracy
      } : null);
      
      setCurrentQuestion(nextQuestion);
      setUserAnswer('');
      setShowFeedback(false);
      
      if (quizMode === 'timed') {
        setTimeLeft(30);
        setTimerActive(true);
      }
    } catch (error) {
      console.error('Error generating next question:', error);
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion || !userAnswer || showFeedback) return;
    
    const correct = userAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    setTimerActive(false);
    
    // Update session
    if (quizSession) {
      const newAnswers = { ...quizSession.answers, [currentQuestion.id]: userAnswer };
      const questionTime = 30 - timeLeft;
      
      setQuizSession(prev => prev ? {
        ...prev,
        answers: newAnswers,
        timePerQuestion: [...prev.timePerQuestion, questionTime]
      } : null);
    }
    
    // Award XP
    const baseXP = 20;
    const speedBonus = quizMode === 'timed' && timeLeft > 20 ? 5 : 0;
    const difficultyBonus = currentQuestion.difficulty === 'expert' ? 10 : 
                           currentQuestion.difficulty === 'hard' ? 5 : 0;
    
    earnXP(baseXP + speedBonus + difficultyBonus, `Quiz: ${currentQuestion.concept}`);
    incrementQuizzes(correct);
  };

  const generateAIFeedback = async (quizData: any) => {
    const concept = concepts.find(c => c.id === quizData.conceptId);
    if (!concept) return '';

    const prompt = `Analyze this quiz performance and provide detailed, encouraging feedback:

Quiz: ${concept.title}
Questions Answered: ${quizData.totalQuestions}
Correct Answers: ${quizData.correctAnswers}
Accuracy: ${quizData.accuracy.toFixed(1)}%
Time Taken: ${Math.round(quizData.totalTime / 60)} minutes
Difficulty Reached: ${quizData.maxDifficulty}

Provide:
1. Encouraging opening message
2. 3 specific strengths observed
3. 2 areas for improvement with actionable advice
4. 3 concrete next steps
5. Motivational closing

Keep it positive, specific, and actionable. Use emojis sparingly.`;

    try {
      const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are an encouraging marketing tutor. Provide constructive, specific feedback that helps students improve while celebrating their achievements.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 400,
      });

      return response?.choices?.[0]?.message?.content?.trim() || 'Great job completing the quiz! Keep practicing to master these concepts.';
    } catch (error) {
      console.error('Error generating feedback:', error);
      return 'Excellent work on completing the quiz! Your dedication to learning these marketing concepts will serve you well.';
    }
  };

  const endQuiz = async () => {
    if (!quizSession) return;
    
    // Calculate final stats
    const totalQuestions = Object.keys(quizSession.answers).length;
    const correctAnswers = Object.values(quizSession.answers).filter(answer => {
      const questionId = Object.keys(quizSession.answers).find(id => quizSession.answers[id] === answer);
      const question = quizSession.questions.find(q => q.id === questionId);
      return question && answer === question.correctAnswer;
    }).length;
    
    const finalAccuracy = (correctAnswers / totalQuestions) * 100;
    const totalTime = quizSession.timePerQuestion.reduce((sum, time) => sum + time, 0);
    const maxDifficulty = quizSession.questions.reduce((max, q) => {
      const difficultyOrder = { easy: 1, medium: 2, hard: 3, expert: 4 };
      return difficultyOrder[q.difficulty] > difficultyOrder[max] ? q.difficulty : max;
    }, 'easy');
    
    // Generate AI feedback
    const aiFeedback = await generateAIFeedback({
      conceptId: quizSession.conceptId,
      totalQuestions,
      correctAnswers,
      accuracy: finalAccuracy,
      totalTime,
      maxDifficulty
    });
    
    // Award completion XP
    const baseXP = 50;
    const accuracyBonus = Math.floor(finalAccuracy / 10) * 25;
    const difficultyBonus = { easy: 0, medium: 25, hard: 50, expert: 100 }[maxDifficulty];
    const speedBonus = quizMode === 'timed' && totalTime < 300 ? 25 : 0; // Under 5 minutes
    
    const totalXP = baseXP + accuracyBonus + difficultyBonus + speedBonus;
    earnXP(totalXP, `Completed Quiz: ${concepts.find(c => c.id === quizSession.conceptId)?.title}`);
    
    // Add to leaderboard
    const concept = concepts.find(c => c.id === quizSession.conceptId);
    if (concept && quizMode === 'timed') {
      addLeaderboardEntry({
        userName: useAppStore.getState().userName,
        concept: concept.title,
        accuracy: finalAccuracy,
        timeTaken: totalTime,
        questionsAnswered: totalQuestions,
        difficulty: maxDifficulty,
        mode: quizMode
      });
    }
    
    // Update analytics
    if (concept) {
      updateQuizAnalytics(concept.title, {
        questionsAnswered: totalQuestions,
        correctAnswers,
        timeTaken: totalTime,
        accuracy: finalAccuracy,
        difficulty: maxDifficulty
      });
    }
    
    // Complete module if this was the last concept
    const conceptIndex = concepts.findIndex(c => c.id === quizSession.conceptId);
    if (conceptIndex === concepts.length - 1) {
      completeModule('marketing-101');
    }
    
    // Show results dashboard
    setQuizResults({
      show: true,
      concept: concepts.find(c => c.id === quizSession.conceptId)?.title || '',
      stats: {
        questionsAnswered: totalQuestions,
        correctAnswers,
        accuracy: finalAccuracy,
        timeTaken: Math.round(totalTime / 60),
        averageTimePerQuestion: Math.round(totalTime / totalQuestions),
        maxDifficulty,
        mode: quizSession.mode
      },
      xpEarned: {
        base: baseXP,
        accuracy: accuracyBonus,
        difficulty: difficultyBonus,
        speed: speedBonus,
        total: totalXP
      },
      aiFeedback
    });
    
    // Reset quiz state
    setActiveQuiz(null);
    setQuizSession(null);
    setCurrentQuestion(null);
    setShowFeedback(false);
    setUserAnswer('');
    setTimerActive(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold font-heading mb-2">Marketing 101: Core Concepts</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        Master the fundamentals of marketing through interactive theory and unlimited AI-powered quizzes! 📚✨
      </p>
      
      <div className="space-y-6">
        {concepts.map((concept, index) => (
          <div key={index} className="relative">
            <motion.div 
              layout
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700"
            >
              <motion.button
                layout
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${concept.gradient} flex items-center justify-center text-2xl`}>
                    {concept.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-heading">{concept.title}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {activeQuiz === index ? 'Quiz in progress...' : 'Click to explore'}
                    </p>
                  </div>
                </div>
                <motion.div animate={{ rotate: openIndex === index ? 180 : 0 }}>
                  <ChevronDown className="w-6 h-6 text-coral-500" />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0">
                      <div ref={el => { sectionRefs.current[index] = el; }}>
                        {/* Progress Bar */}
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                              Reading Progress
                            </span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                              {Math.round(scrollProgress[index] || 0)}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <motion.div
                              className={`h-2 rounded-full bg-gradient-to-r ${concept.gradient}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${scrollProgress[index] || 0}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>

                        {/* Overview Section */}
                        <div className={`p-6 rounded-2xl bg-gradient-to-r ${concept.gradient} text-white mb-6`}>
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">{concept.icon}</span>
                            <h3 className="text-xl font-bold">What is {concept.title}?</h3>
                          </div>
                          <p className="text-lg mb-4 opacity-90">{concept.overview.what}</p>
                          <div className="bg-white/20 rounded-lg p-4">
                            <h4 className="font-semibold mb-2">Why it matters:</h4>
                            <p className="opacity-90">{concept.overview.why}</p>
                          </div>
                        </div>

                        {/* Key Concepts */}
                        <div className="mb-6">
                          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-coral-500" />
                            Key Concepts
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {concept.keyConcepts.map((kc, kcIndex) => (
                              <motion.div
                                key={kcIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: kcIndex * 0.1 }}
                                className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-coral-300 dark:hover:border-coral-600 transition-colors"
                              >
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-2xl">{kc.icon}</span>
                                  <h4 className="font-semibold text-slate-800 dark:text-slate-100">{kc.name}</h4>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{kc.description}</p>
                                <div className="text-xs text-slate-500 dark:text-slate-500">
                                  <strong>Examples:</strong> {kc.examples.join(', ')}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Real-World Examples */}
                        <div className="mb-6">
                          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-coral-500" />
                            Real-World Success Stories
                          </h3>
                          <div className="space-y-4">
                            {concept.realWorldExamples.map((example, exIndex) => (
                              <motion.div
                                key={exIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: exIndex * 0.1 }}
                                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-coral-100 dark:bg-coral-900/30 flex items-center justify-center flex-shrink-0">
                                    <span className="text-coral-600 dark:text-coral-400 font-bold">{exIndex + 1}</span>
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">{example.company}</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                      <strong>Strategy:</strong> {example.strategy}
                                    </p>
                                    <p className="text-sm text-green-600 dark:text-green-400">
                                      <strong>Result:</strong> {example.result}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Key Takeaways */}
                        <div className="mb-8">
                          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-coral-500" />
                            Key Takeaways
                          </h3>
                          <div className={`p-6 rounded-2xl bg-gradient-to-r ${concept.gradient} text-white`}>
                            <ul className="space-y-2">
                              {concept.keyTakeaways.map((takeaway, taIndex) => (
                                <motion.li
                                  key={taIndex}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: taIndex * 0.1 }}
                                  className="flex items-start gap-2"
                                >
                                  <span className="text-white/80 mt-1">•</span>
                                  <span className="opacity-90">{takeaway}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Quiz Unlock */}
                        {quizUnlocked[index] && !activeQuiz && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="text-center p-6 rounded-2xl bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800"
                          >
                            <div className="text-4xl mb-2">✅</div>
                            <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">
                              Quiz Unlocked!
                            </h3>
                            <p className="text-green-700 dark:text-green-400 mb-4">
                              You've read through the theory. Now test your knowledge with unlimited AI-generated questions!
                            </p>
                            
                            {/* Mode Selection */}
                            <div className="flex gap-4 justify-center mb-4">
                              <button
                                onClick={() => setQuizMode('practice')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                  quizMode === 'practice'
                                    ? 'bg-coral-500 text-white'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                Practice Mode
                              </button>
                              <button
                                onClick={() => setQuizMode('timed')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                  quizMode === 'timed'
                                    ? 'bg-coral-500 text-white'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                Timed Challenge
                              </button>
                            </div>
                            
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              animate={{ 
                                boxShadow: [
                                  "0 10px 25px rgba(251, 146, 60, 0.3)",
                                  "0 15px 35px rgba(251, 146, 60, 0.4)",
                                  "0 10px 25px rgba(251, 146, 60, 0.3)"
                                ]
                              }}
                              transition={{ 
                                boxShadow: { 
                                  duration: 2, 
                                  repeat: Infinity, 
                                  ease: "easeInOut" 
                                } 
                              }}
                              onClick={() => startQuiz(index)}
                              disabled={isGeneratingQuestion}
                              className="px-8 py-4 bg-gradient-to-r from-coral-500 to-warm-yellow-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                            >
                              {isGeneratingQuestion ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Generating Question...
                                </div>
                              ) : (
                                <>
                                  🎯 Take AI Quiz
                                  <div className="text-sm opacity-90 mt-1">
                                    Unlimited questions • Adaptive difficulty
                                  </div>
                                </>
                              )}
                            </motion.button>
                          </motion.div>
                        )}

                        {/* Active Quiz */}
                        {activeQuiz === index && currentQuestion && (
                          <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-2 border-coral-200 dark:border-coral-800"
                          >
                            {/* Quiz Header */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <Sparkles className="w-6 h-6 text-coral-500" />
                                <h3 className="text-xl font-bold">AI Quiz</h3>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-full text-sm font-medium">
                                  {currentQuestion.difficulty.toUpperCase()}
                                </span>
                                {quizMode === 'timed' && (
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-coral-500" />
                                    <span className={`font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                      {timeLeft}s
                                    </span>
                                  </div>
                                )}
                                <button
                                  onClick={endQuiz}
                                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm"
                                >
                                  End Quiz
                                </button>
                              </div>
                            </div>

                            {/* Question */}
                            <div className="mb-6">
                              <p className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">
                                {currentQuestion.question}
                              </p>

                              {/* Answer Options */}
                              {currentQuestion.type === 'mcq' && currentQuestion.options && (
                                <div className="space-y-2">
                                  {currentQuestion.options.map((option, optionIndex) => (
                                    <button
                                      key={optionIndex}
                                      onClick={() => setUserAnswer(option)}
                                      disabled={showFeedback}
                                      className={`w-full text-left p-4 rounded-lg transition-all ${
                                        userAnswer === option
                                          ? 'bg-coral-100 dark:bg-coral-900/30 border-2 border-coral-500'
                                          : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                                      } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                      {option}
                                    </button>
                                  ))}
                                </div>
                              )}

                              {currentQuestion.type === 'truefalse' && (
                                <div className="flex gap-4">
                                  <button
                                    onClick={() => setUserAnswer('True')}
                                    disabled={showFeedback}
                                    className={`flex-1 p-4 rounded-lg transition-all ${
                                      userAnswer === 'True'
                                        ? 'bg-coral-100 dark:bg-coral-900/30 border-2 border-coral-500'
                                        : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                                    } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                  >
                                    True
                                  </button>
                                  <button
                                    onClick={() => setUserAnswer('False')}
                                    disabled={showFeedback}
                                    className={`flex-1 p-4 rounded-lg transition-all ${
                                      userAnswer === 'False'
                                        ? 'bg-coral-100 dark:bg-coral-900/30 border-2 border-coral-500'
                                        : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                                    } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                  >
                                    False
                                  </button>
                                </div>
                              )}

                              {currentQuestion.type === 'fill' && (
                                <input
                                  type="text"
                                  value={userAnswer}
                                  onChange={(e) => setUserAnswer(e.target.value)}
                                  disabled={showFeedback}
                                  placeholder="Type your answer here..."
                                  className="w-full p-4 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-coral-500 focus:border-coral-500 outline-none"
                                />
                              )}

                              {currentQuestion.type === 'scenario' && (
                                <textarea
                                  value={userAnswer}
                                  onChange={(e) => setUserAnswer(e.target.value)}
                                  disabled={showFeedback}
                                  placeholder="Describe your approach..."
                                  rows={4}
                                  className="w-full p-4 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-coral-500 focus:border-coral-500 outline-none resize-none"
                                />
                              )}
                            </div>

                            {/* Submit Button */}
                            {userAnswer && !showFeedback && (
                              <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={handleSubmitAnswer}
                                className="w-full py-3 bg-coral-500 text-white font-semibold rounded-lg hover:bg-coral-600 transition-colors"
                              >
                                Submit Answer
                              </motion.button>
                            )}

                            {/* Feedback */}
                            {showFeedback && (
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                className={`p-4 rounded-lg ${
                                  isCorrect
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xl">{isCorrect ? '✅' : '❌'}</span>
                                  <span className="font-semibold">
                                    {isCorrect ? 'Correct! 🎉' : 'Not quite! 🤔'}
                                  </span>
                                </div>
                                <p className="text-sm mb-3">{currentQuestion.explanation}</p>
                                <div className="flex gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={generateNextQuestion}
                                    disabled={isGeneratingQuestion}
                                    className="flex-1 py-2 bg-coral-500 text-white font-medium rounded-lg hover:bg-coral-600 transition-colors disabled:opacity-50"
                                  >
                                    {isGeneratingQuestion ? 'Generating...' : 'Next Question'}
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
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Results Dashboard Modal */}
      <AnimatePresence>
        {quizResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setQuizResults(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      🎉 Quiz Complete!
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      {quizResults.concept} - {quizResults.stats.mode} Mode
                    </p>
                  </div>
                  <button
                    onClick={() => setQuizResults(null)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Performance Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <div className="text-3xl font-bold mb-1">{quizResults.stats.accuracy.toFixed(1)}%</div>
                    <div className="text-blue-100">Accuracy</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 text-white">
                    <div className="text-3xl font-bold mb-1">{quizResults.stats.questionsAnswered}</div>
                    <div className="text-green-100">Questions</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white">
                    <div className="text-3xl font-bold mb-1">{quizResults.stats.timeTaken}m</div>
                    <div className="text-orange-100">Time Taken</div>
                  </div>
                </div>

                {/* Detailed Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-coral-500" />
                      Performance Breakdown
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Correct Answers:</span>
                        <span className="font-medium">{quizResults.stats.correctAnswers}/{quizResults.stats.questionsAnswered}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Average Time/Question:</span>
                        <span className="font-medium">{quizResults.stats.averageTimePerQuestion}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Max Difficulty:</span>
                        <span className="font-medium capitalize">{quizResults.stats.maxDifficulty}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-coral-500" />
                      XP Breakdown
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Base XP:</span>
                        <span className="font-medium">+{quizResults.xpEarned.base}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Accuracy Bonus:</span>
                        <span className="font-medium">+{quizResults.xpEarned.accuracy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Difficulty Bonus:</span>
                        <span className="font-medium">+{quizResults.xpEarned.difficulty}</span>
                      </div>
                      {quizResults.xpEarned.speed > 0 && (
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Speed Bonus:</span>
                          <span className="font-medium">+{quizResults.xpEarned.speed}</span>
                        </div>
                      )}
                      <div className="border-t border-slate-200 dark:border-slate-700 pt-2">
                        <div className="flex justify-between font-bold">
                          <span>Total XP:</span>
                          <span className="text-coral-500">+{quizResults.xpEarned.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Feedback */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-coral-50 to-warm-yellow-50 dark:from-coral-900/20 dark:to-warm-yellow-900/20 border border-coral-200 dark:border-coral-800 mb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-coral-500" />
                    AI Tutor Feedback
                  </h3>
                  <div className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                    {quizResults.aiFeedback}
                  </div>
                </div>

                {/* Leaderboard (only for timed mode) */}
                {quizResults.stats.mode === 'timed' && (
                  <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 mb-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-coral-500" />
                      Timed Challenge Leaderboard
                    </h3>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Top performers for {quizResults.concept} - Timed Mode
                    </div>
                    <LeaderboardDisplay concept={quizResults.concept} mode="timed" />
                  </div>
                )}

                {/* Analytics Summary */}
                <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 mb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-coral-500" />
                    Your Progress on {quizResults.concept}
                  </h3>
                  <AnalyticsDisplay concept={quizResults.concept} />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setQuizResults(null);
                      // Find the concept index and start a new quiz
                      const conceptIndex = concepts.findIndex(c => c.title === quizResults.concept);
                      if (conceptIndex !== -1) {
                        startQuiz(conceptIndex);
                      }
                    }}
                    className="px-6 py-3 bg-coral-500 text-white font-semibold rounded-lg hover:bg-coral-600 transition-colors"
                  >
                    Try Again
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuizResults(null)}
                    className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    Continue Learning
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Analytics Display Component
interface AnalyticsDisplayProps {
  concept: string;
}

const AnalyticsDisplay: React.FC<AnalyticsDisplayProps> = ({ concept }) => {
  const getQuizAnalytics = useAppStore((state) => state.getQuizAnalytics);
  
  const analytics = getQuizAnalytics(concept);
  
  if (!analytics) {
    return (
      <div className="text-center py-4 text-slate-500 dark:text-slate-400">
        <p>No previous quiz data available.</p>
        <p className="text-sm">Complete more quizzes to see your progress! 📊</p>
      </div>
    );
  }
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg">
        <div className="text-2xl font-bold text-coral-500">{analytics.totalQuizzes}</div>
        <div className="text-xs text-slate-600 dark:text-slate-400">Total Quizzes</div>
      </div>
      <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg">
        <div className="text-2xl font-bold text-green-500">{analytics.averageAccuracy.toFixed(1)}%</div>
        <div className="text-xs text-slate-600 dark:text-slate-400">Avg Accuracy</div>
      </div>
      <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg">
        <div className="text-2xl font-bold text-blue-500">{analytics.totalQuestions}</div>
        <div className="text-xs text-slate-600 dark:text-slate-400">Questions</div>
      </div>
      <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg">
        <div className="text-2xl font-bold text-purple-500">{analytics.bestAccuracy.toFixed(1)}%</div>
        <div className="text-xs text-slate-600 dark:text-slate-400">Best Score</div>
      </div>
    </div>
  );
};

// Leaderboard Display Component
interface LeaderboardDisplayProps {
  concept: string;
  mode: 'timed' | 'practice';
}

const LeaderboardDisplay: React.FC<LeaderboardDisplayProps> = ({ concept, mode }) => {
  const getLeaderboard = useAppStore((state) => state.getLeaderboard);
  const userName = useAppStore((state) => state.userName);
  
  const leaderboard = getLeaderboard(concept, mode);
  
  if (leaderboard.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No timed challenges completed yet!</p>
        <p className="text-sm">Be the first to set a record! 🏆</p>
      </div>
    );
  }
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="space-y-2">
      {leaderboard.slice(0, 5).map((entry, index) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-center justify-between p-3 rounded-lg ${
            entry.userName === userName
              ? 'bg-coral-100 dark:bg-coral-900/30 border-2 border-coral-300 dark:border-coral-700'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              index === 0 ? 'bg-yellow-500 text-white' :
              index === 1 ? 'bg-gray-400 text-white' :
              index === 2 ? 'bg-orange-500 text-white' :
              'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}>
              {index + 1}
            </div>
            <div>
              <div className="font-medium text-slate-800 dark:text-slate-100">
                {entry.userName}
                {entry.userName === userName && (
                  <span className="ml-2 text-xs bg-coral-500 text-white px-2 py-1 rounded-full">You</span>
                )}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {entry.questionsAnswered} questions • {entry.difficulty}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-slate-800 dark:text-slate-100">
              {entry.accuracy.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {formatTime(entry.timeTaken)}
            </div>
          </div>
        </motion.div>
      ))}
      
      {leaderboard.length > 5 && (
        <div className="text-center pt-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            ... and {leaderboard.length - 5} more
          </span>
        </div>
      )}
    </div>
  );
};

export default Marketing101;