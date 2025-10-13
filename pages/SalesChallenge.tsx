import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Groq from 'groq-sdk';
import { useAppStore } from '../store/useStore';
import { Sparkles, RotateCw } from '../components/icons/Icons';

const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY || '', 
  dangerouslyAllowBrowser: true 
});

type ChallengeMode = 'quick' | 'full' | 'boss';
type BuyerPersonality = 'skeptic' | 'researcher' | 'budget' | 'quality' | 'impulsive' | 'technical' | 'silent';
type ProductMode = 'random' | 'custom';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

interface ChallengeResult {
  won: boolean;
  feedback: string;
  strengths: string[];
  improvements: string[];
  score: number;
  xpEarned: number;
}

const randomProducts = [
  'Premium Ballpoint Pen',
  'Stainless Steel Water Bottle',
  'Wireless Bluetooth Earbuds',
  'Portable Phone Charger',
  'Designer Sunglasses',
  'Leather Wallet',
  'Fitness Tracker Watch',
  'Coffee Mug with Temperature Control',
  'Umbrella with Auto-Open Feature',
  'Notebook with Smart Pages',
];

const personalities: Record<BuyerPersonality, { name: string; description: string; emoji: string }> = {
  skeptic: { name: 'The Skeptic', description: 'Questions everything, needs proof', emoji: '🤨' },
  researcher: { name: 'The Researcher', description: 'Compares with competitors', emoji: '📊' },
  budget: { name: 'Budget Buyer', description: 'Price-conscious, seeks value', emoji: '💰' },
  quality: { name: 'Quality Seeker', description: 'Premium buyer, wants the best', emoji: '⭐' },
  impulsive: { name: 'The Impulsive', description: 'Quick decisions, easily excited', emoji: '⚡' },
  technical: { name: 'The Technical', description: 'Wants specs and details', emoji: '🔬' },
  silent: { name: 'The Silent Type', description: 'Minimal responses, hard to read', emoji: '🤐' },
};

const SalesChallenge: React.FC = () => {
  const [stage, setStage] = useState<'setup' | 'challenge' | 'result'>('setup');
  const [mode, setMode] = useState<ChallengeMode>('quick');
  const [productMode, setProductMode] = useState<ProductMode>('random');
  const [customProduct, setCustomProduct] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [personality, setPersonality] = useState<BuyerPersonality>('skeptic');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes for quick mode
  const [result, setResult] = useState<ChallengeResult | null>(null);
  const [challengeAttempts, setChallengeAttempts] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const incrementAI = useAppStore((state) => state.incrementAIInteractions);
  const earnXP = useAppStore((state) => state.earnXP);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    // Only run timer if AI is NOT typing (fair time for student)
    if (conversationStarted && timer > 0 && stage === 'challenge' && !isAITyping) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && stage === 'challenge') {
      handleTimeUp();
    }
  }, [conversationStarted, timer, stage, isAITyping]);
  
  const startChallenge = () => {
    let product = '';
    if (productMode === 'random') {
      product = randomProducts[Math.floor(Math.random() * randomProducts.length)];
    } else {
      product = customProduct;
    }
    
    setSelectedProduct(product);
    const randomPersonality = Object.keys(personalities)[Math.floor(Math.random() * Object.keys(personalities).length)] as BuyerPersonality;
    setPersonality(randomPersonality);
    setStage('challenge');
    setChallengeAttempts(prev => prev + 1);
    
    // Set timer based on mode (extended for better conversations)
    if (mode === 'quick') setTimer(300); // 5 minutes (was 2 minutes)
    else if (mode === 'full') setTimer(600); // 10 minutes (was 7 minutes)
    else setTimer(900); // 15 minutes (was 10 minutes)
    
    // AI sends opening message based on personality
    const openings: Record<BuyerPersonality, string> = {
      skeptic: "Okay... I'm listening. But I've heard sales pitches before. Convince me. 🤨",
      researcher: "Hi. I've done my research on similar products. What makes yours different? 📊",
      budget: "Hello. Before you start, what's the price? I'm on a tight budget. 💰",
      quality: "Good day. I only buy premium quality. Is this the best you have? ⭐",
      impulsive: "Hey! Ooh, what are you selling? Tell me quick! 🤩",
      technical: "Hello. I need full technical specifications before making any decision. 🔧",
      silent: "...Go ahead. 👀",
    };
    
    setTimeout(() => {
      sendAIMessage(openings[randomPersonality] || "Hello. So you want to sell me something? Go ahead, I'm listening...");
      setConversationStarted(true);
    }, 1000);
  };
  
  const sendAIMessage = (text: string) => {
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      sender: 'ai',
      text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };
  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      sender: 'user',
      text: inputValue,
      timestamp: Date.now(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsAITyping(true);
    
    try {
      // Build conversation history
      const conversationHistory = messages.map(m => 
        `${m.sender === 'user' ? 'Student' : 'Buyer'}: ${m.text}`
      ).join('\n');
      
      const personalityData = personalities[personality];
      const productInfo = productMode === 'custom' && customDescription 
        ? `${selectedProduct} - ${customDescription}`
        : selectedProduct;
      
      const difficultyPrompt = mode === 'boss' 
        ? 'EXTREMELY TOUGH - Only buy if absolutely convinced. 5-10% win rate.'
        : mode === 'full'
        ? 'VERY SKEPTICAL - Need solid proof. 15% win rate.'
        : 'SKEPTICAL - Show me why I need this. 20% win rate.';
      
      const prompt = `You are a REAL buyer in a sales conversation. Act naturally with emotions and reactions.

BUYER PROFILE:
- Personality: ${personalityData.name} - ${personalityData.description}
- Product being sold: "${productInfo}"
- Your mood: ${difficultyPrompt}

CONVERSATION SO FAR:
${conversationHistory}

LATEST MESSAGE FROM SELLER:
"${inputValue}"

HOW TO ACT LIKE A REAL BUYER WITH EMOJIS:

1. SHOW EMOTIONS & REACTIONS:
   - Curious: "Hmm, tell me more... 🤔", "Interesting... 🧐", "Go on... 👀"
   - Skeptical: "I'm not convinced 😒", "Prove it 🤨", "Really? 🤷‍♂️"
   - Interested: "Wait, that sounds good! 😮", "Oh! 😯", "I like that 👍"
   - Frustrated: "Ugh, too expensive 💸", "This isn't for me 😤", "I don't get it 🤯"
   - Excited: "Wow! 🤩", "That's exactly what I need! 🎯", "Amazing! ✨"

2. ACT ACCORDING TO YOUR PERSONALITY:
   ${personality === 'skeptic' ? '- Question everything: "Prove it 🤨", "How do I know? 🤔", "I doubt that 🙄", "Show me evidence 📊"' : ''}
   ${personality === 'researcher' ? '- Compare: "What about [competitor]? 🔍", "I read that... 📚", "The reviews say... ⭐", "Let me check... 🔎"' : ''}
   ${personality === 'budget' ? '- Focus on price: "Too expensive 💰", "Can you do better? 💸", "What\'s the cheapest option? 🏷️", "Any discounts? 🎫"' : ''}
   ${personality === 'quality' ? '- Demand premium: "Is this the best? ⭐", "What makes it special? 💎", "I want top quality 👑", "Show me the craftsmanship 🔨"' : ''}
   ${personality === 'impulsive' ? '- Get excited: "Ooh! 🤩", "I want it! 😍", "Sold! 🎉", "Let\'s do this! 🚀", "Tell me more! 🔥"' : ''}
   ${personality === 'technical' ? '- Ask specs: "What are the exact specs? 🔧", "How does it work? ⚙️", "Technical details? 📋", "What\'s the capacity? 📊"' : ''}
   ${personality === 'silent' ? '- Be brief: "Okay 👍", "Hmm 🤔", "And? 👀", "Go on... ➡️", "I see 👁️"' : ''}

3. ASK REALISTIC QUESTIONS based on product type:
   ${productInfo.toLowerCase().includes('tech') || productInfo.toLowerCase().includes('app') || productInfo.toLowerCase().includes('software') ? 
     '- "What about data security?", "Does it work on mobile?", "What if it breaks?"' : ''}
   ${productInfo.toLowerCase().includes('service') || productInfo.toLowerCase().includes('freelance') ? 
     '- "What\'s your experience?", "Can I see examples?", "How much per hour?"' : ''}
   - "Why is this better than [competitor]?"
   - "What if I don\'t like it?"
   - "How much does it cost exactly?"

4. SHOW BUYING SIGNALS IF CONVINCED:
   - "Okay, I'm starting to see the value 💡"
   - "Tell me more about the pricing 💰"
   - "What are the next steps? 🚀"
   - "How do I get this? 🛒"
   - "I'll buy it! 🎉" (ONLY if truly convinced)

5. STAY IN CHARACTER & BE BRIEF:
   - Max 2-3 sentences
   - Sound natural and human
   - Show personality through word choice
   - React emotionally
   - Remember what was said before

RESPOND NOW as the buyer (20-40 words max):`;
      
      // Use Groq for FAST AI responses (< 1 second!)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('timeout')), 15000)
      );
      
      const responsePromise = groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a buyer in a sales conversation. Stay in character and respond naturally.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 150,
      });
      
      const response = await Promise.race([responsePromise, timeoutPromise]) as any;
      
      // Validate response before using
      const aiResponse = response?.choices?.[0]?.message?.content?.trim() || '';
      
      if (!aiResponse || aiResponse.length < 3) {
        throw new Error('Empty or invalid AI response');
      }
      
      setIsAITyping(false);
      sendAIMessage(aiResponse);
      
      // Check if conversation should end (if AI mentions buying or refusing strongly)
      const lowerResponse = aiResponse.toLowerCase();
      if (lowerResponse.includes("i'll buy it") || lowerResponse.includes("you've convinced me") || lowerResponse.includes("deal") || lowerResponse.includes("sold")) {
        setTimeout(() => evaluateConversation(true), 2000);
      }
      
    } catch (error: any) {
      console.error('AI Error:', error);
      setIsAITyping(false);
      
      // Better fallback messages based on personality
      const fallbackMessages = {
        skeptic: "Hmm, I zoned out. Say that again? 🤔",
        researcher: "Sorry, got distracted looking at competitor reviews. What? 📚",
        budget: "Wait, what was the price again? 💰",
        quality: "Sorry, repeat that? 👂",
        impulsive: "Huh? I wasn't listening. Go on! 🔥",
        technical: "System error. Please restate. 🔧",
        silent: "... 👀",
      };
      
      sendAIMessage(fallbackMessages[personality] || "Sorry, what was that?");
    }
  };
  
  const handleTimeUp = () => {
    evaluateConversation(false);
  };
  
  const evaluateConversation = async (buyerInterested: boolean) => {
    setIsAITyping(true);
    
    try {
      const conversationHistory = messages.map(m => 
        `${m.sender === 'user' ? 'Student' : 'Buyer'}: ${m.text}`
      ).join('\n');
      
      const productInfo = productMode === 'custom' && customDescription 
        ? `${selectedProduct} - ${customDescription}`
        : selectedProduct;
      
      const prompt = `You are evaluating a sales conversation. The student tried to sell: "${productInfo}"
Buyer personality: ${personalities[personality].name}
Challenge mode: ${mode}
Time limit: ${mode === 'quick' ? '5 minutes' : mode === 'full' ? '10 minutes' : '15 minutes'}

Full conversation:
${conversationHistory}

Evaluate the student's performance:
1. Did they demonstrate good marketing knowledge (4Ps, AIDA, feature-benefit, urgency, etc.)?
2. Did they handle objections well?
3. Did they adapt to the buyer's personality?
4. Did they make a compelling case?

Based on difficulty (${mode === 'boss' ? '5-10%' : mode === 'full' ? '15%' : '20%'} win rate), decide if the buyer would actually buy.

Be TOUGH in your evaluation. Only grant a win if the student truly demonstrated excellent sales and marketing skills.

IMPORTANT: Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{
  "won": true or false,
  "feedback": "overall feedback string",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "score": number between 0-100
}`;
      
      const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a sales evaluation expert. Return only valid JSON, no markdown or extra text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });
      
      let responseText = response?.choices?.[0]?.message?.content?.trim() || '';
      
      // Remove markdown code blocks if present
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const evaluation = JSON.parse(responseText);
      
      // Validate required fields
      if (!evaluation.hasOwnProperty('won') || !evaluation.feedback || !evaluation.strengths || !evaluation.improvements || !evaluation.score) {
        throw new Error('Invalid evaluation format');
      }
      
      const xpEarned = evaluation.won 
        ? (mode === 'boss' ? 500 : mode === 'full' ? 200 : 100)
        : 10;
      
      const finalResult: ChallengeResult = {
        ...evaluation,
        xpEarned,
      };
      
      setResult(finalResult);
      setStage('result');
      setIsAITyping(false);
      
      // Award XP
      earnXP(xpEarned, evaluation.won ? `Won Sales Challenge: ${selectedProduct}` : 'Sales Challenge Attempt');
      incrementAI();
      
    } catch (error) {
      console.error('Evaluation Error:', error);
      setIsAITyping(false);
      setResult({
        won: false,
        feedback: "The buyer walked away. Keep practicing!",
        strengths: ["You showed up and tried"],
        improvements: ["Study more marketing concepts", "Practice objection handling"],
        score: 50,
        xpEarned: 10,
      });
      setStage('result');
    }
  };
  
  const resetChallenge = () => {
    setStage('setup');
    setMessages([]);
    setInputValue('');
    setConversationStarted(false);
    setResult(null);
    setCustomProduct('');
    setCustomDescription('');
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold font-heading mb-2">AI Sales Challenge</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        Face a tough AI buyer and prove your sales skills. Only 20% win rate - can you close the deal?
      </p>
      
      <AnimatePresence mode="wait">
        {stage === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Challenge Mode Selection */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold font-heading mb-4">Select Challenge Mode</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {[
                   { id: 'quick', name: 'Quick Pitch', time: '5 min', difficulty: '20%', emoji: '⚡' },
                   { id: 'full', name: 'Full Presentation', time: '10 min', difficulty: '15%', emoji: '🎯' },
                   { id: 'boss', name: 'Boss Battle', time: '15 min', difficulty: '5-10%', emoji: '🔥', locked: challengeAttempts < 10 },
                 ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => !m.locked && setMode(m.id as ChallengeMode)}
                    disabled={m.locked}
                    className={`p-4 rounded-xl transition-all ${
                      mode === m.id
                        ? 'bg-gradient-to-br from-coral-500 to-warm-yellow-500 text-white shadow-xl'
                        : m.locked
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <div className="text-3xl mb-2">{m.emoji}</div>
                    <h3 className="font-bold">{m.name}</h3>
                    <p className="text-sm opacity-90">{m.time} • {m.difficulty} win rate</p>
                    {m.locked && <p className="text-xs mt-2">🔒 Complete 10 challenges</p>}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Product Selection */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold font-heading mb-4">Choose Your Product</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setProductMode('random')}
                  className={`p-6 rounded-xl transition-all text-left ${
                    productMode === 'random'
                      ? 'bg-gradient-to-br from-deep-blue-500 to-deep-blue-600 text-white shadow-xl'
                      : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <div className="text-3xl mb-2">🎲</div>
                  <h3 className="font-bold text-lg mb-1">Surprise Me!</h3>
                  <p className="text-sm opacity-90">Get a random product to sell</p>
                </button>
                
                <button
                  onClick={() => setProductMode('custom')}
                  className={`p-6 rounded-xl transition-all text-left ${
                    productMode === 'custom'
                      ? 'bg-gradient-to-br from-coral-500 to-warm-yellow-500 text-white shadow-xl'
                      : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <div className="text-3xl mb-2">✏️</div>
                  <h3 className="font-bold text-lg mb-1">My Product</h3>
                  <p className="text-sm opacity-90">Sell YOUR own product/service</p>
                </button>
              </div>
              
              {productMode === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Product/Service Name *
                    </label>
                    <input
                      type="text"
                      value={customProduct}
                      onChange={(e) => setCustomProduct(e.target.value)}
                      placeholder="e.g., My SaaS App, Freelance Design Services, Handmade Jewelry"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-coral-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Short Description (Optional)
                    </label>
                    <textarea
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      placeholder="e.g., A project management tool for small teams"
                      rows={2}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-coral-500 outline-none resize-none"
                    />
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Start Button */}
            <div className="flex justify-center">
              <motion.button
                onClick={startChallenge}
                disabled={productMode === 'custom' && !customProduct.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-4 bg-gradient-to-r from-coral-500 to-warm-yellow-500 text-white text-xl font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🚀 Start Challenge
              </motion.button>
            </div>
          </motion.div>
        )}
        
        {stage === 'challenge' && (
          <motion.div
            key="challenge"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Challenge Info Bar */}
            <div className="bg-gradient-to-r from-deep-blue-500 to-deep-blue-600 text-white p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Selling:</p>
                <p className="font-bold text-lg">{selectedProduct}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90">Buyer Type:</p>
                <p className="font-bold">
                  {personalities[personality].emoji} {personalities[personality].name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Time Left:</p>
                <p className={`font-bold text-2xl ${timer < 30 ? 'text-red-300 animate-pulse' : ''}`}>
                  {formatTime(timer)}
                </p>
              </div>
            </div>
            
            {/* Chat Interface */}
            <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700">
              <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                {messages.map((message, idx) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[75%]">
                      {message.sender === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-deep-blue-400 to-deep-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {personalities[personality].emoji}
                        </div>
                      )}
                      <div
                        className={`px-5 py-3 rounded-2xl shadow-md ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-coral-500 to-coral-600 text-white rounded-br-sm'
                            : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-sm border border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        <p className="text-[15px] leading-relaxed">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-white/70' : 'text-slate-400'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {message.sender === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral-400 to-warm-yellow-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          You
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {isAITyping && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start items-end gap-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-deep-blue-400 to-deep-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      {personalities[personality].emoji}
                    </div>
                    <div className="bg-white dark:bg-slate-700 px-5 py-3 rounded-2xl rounded-bl-sm shadow-md border border-slate-200 dark:border-slate-600">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-deep-blue-500 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-deep-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                          <div className="w-2 h-2 bg-deep-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                          {personalities[personality].name} is thinking...
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 italic">⏸️ Timer paused</p>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input Area */}
              <div className="border-t-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                {mode === 'full' && messages.length === 1 && (
                  <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm text-blue-800 dark:text-blue-300 font-semibold">
                      💡 Full Presentation Tip: Follow the sales stages:
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                      1. Greet & build rapport → 2. Ask about their needs → 3. Present your solution → 4. Handle objections → 5. Close the deal
                    </p>
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isAITyping && handleSendMessage()}
                    placeholder={isAITyping ? "Wait for buyer to respond..." : "Type your message..."}
                    disabled={isAITyping}
                    className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-coral-500 outline-none disabled:opacity-50 transition-all text-[15px]"
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isAITyping}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-coral-500 to-coral-600 text-white font-bold rounded-xl hover:from-coral-600 hover:to-coral-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg disabled:shadow-none"
                  >
                    Send →
                  </motion.button>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                  {isAITyping ? '⏸️ Timer paused while AI responds' : '⏱️ Timer is running'}
                </p>
              </div>
            </div>
            
            {/* Manual End Button */}
            <div className="flex justify-center">
              <button
                onClick={() => evaluateConversation(false)}
                className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                End Conversation
              </button>
            </div>
          </motion.div>
        )}
        
        {stage === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-6"
          >
            {/* Result Header */}
            <div className={`p-8 rounded-2xl text-center ${
              result.won
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
            }`}>
              <div className="text-6xl mb-4">{result.won ? '🎉' : '😔'}</div>
              <h2 className="text-3xl font-bold mb-2">
                {result.won ? 'YOU MADE THE SALE!' : 'No Sale This Time'}
              </h2>
              <p className="text-xl opacity-90">+{result.xpEarned} XP</p>
              <div className="mt-4">
                <p className="text-sm opacity-90">Performance Score</p>
                <p className="text-5xl font-bold">{result.score}/100</p>
              </div>
            </div>
            
            {/* Feedback */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold font-heading mb-4">Feedback</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {result.feedback}
              </p>
            </div>
            
            {/* Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border-2 border-green-200 dark:border-green-800">
                <h3 className="text-lg font-bold font-heading mb-4 text-green-700 dark:text-green-400 flex items-center gap-2">
                  <span>✓</span> Strengths
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((strength, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className="text-green-500 flex-shrink-0">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-2xl border-2 border-yellow-200 dark:border-yellow-800">
                <h3 className="text-lg font-bold font-heading mb-4 text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                  <span>→</span> Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {result.improvements.map((improvement, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className="text-yellow-500 flex-shrink-0">•</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={resetChallenge}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-coral-500 to-warm-yellow-500 text-white font-bold rounded-lg shadow-lg"
              >
                Try Again 🔄
              </motion.button>
              <button
                onClick={() => window.location.href = '#/dashboard'}
                className="px-8 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SalesChallenge;

