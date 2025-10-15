import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Groq from 'groq-sdk';
import { useAppStore } from '../store/useStore';
import { Sparkles, RotateCw } from '../components/icons/Icons';

const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY || '', 
  dangerouslyAllowBrowser: true 
});

type CampaignMode = 'basic' | 'boss';
type CustomerPersonality = 'skeptic' | 'researcher' | 'budget' | 'quality' | 'impulsive' | 'technical' | 'silent' | 'early-adopter' | 'practical' | 'trend-follower';
type ProductMode = 'random' | 'custom';

interface Customer {
  id: string;
  name: string;
  personality: CustomerPersonality;
  status: 'unsure' | 'interested' | 'convinced' | 'not-interested';
  emoji: string;
}

interface CustomerResult {
  customerId: string;
  customerName: string;
  convinced: boolean;
  score: number;
  feedback: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
  customerId?: string;  // For Boss Mode multi-customer tracking
  customerName?: string; // NEW: Display name for WhatsApp-style bubbles
}

interface CampaignResult {
  won: boolean;
  feedback: string;
  strengths: string[];
  improvements: string[];
  score: number;
  customerResults?: CustomerResult[];
  customersConvinced?: number;
  totalCustomers?: number;
}

const randomProducts = [
  // Original products
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
  // New diverse products
  'Monthly Meditation App Subscription',
  'Professional LinkedIn Profile Makeover Service',
  'Ergonomic Standing Desk Converter',
  'AI-Powered Resume Builder (SaaS)',
  'Organic Meal Prep Delivery Service',
  'Virtual Assistant Service (10 hours/month)',
  'Cloud Storage Plan (1TB)',
  'Custom Business Logo Design Package',
  'Noise-Canceling Desk Lamp',
  'Project Management Software License',
];

const personalities: Record<CustomerPersonality, { name: string; description: string; emoji: string }> = {
  skeptic: { name: 'The Skeptic', description: 'Questions everything, needs strong value prop', emoji: '🤨' },
  researcher: { name: 'The Researcher', description: 'Compares with competitors, needs differentiation', emoji: '📊' },
  budget: { name: 'Budget Conscious', description: 'Price-conscious, seeks ROI/value', emoji: '💰' },
  quality: { name: 'Quality Seeker', description: 'Premium buyer, wants positioning', emoji: '⭐' },
  impulsive: { name: 'The Impulsive', description: 'Quick decisions, easily excited', emoji: '⚡' },
  technical: { name: 'The Technical', description: 'Wants specs and details', emoji: '🔬' },
  silent: { name: 'The Silent Type', description: 'Minimal responses, hard to read', emoji: '🤐' },
  'early-adopter': { name: 'Early Adopter', description: 'Wants uniqueness and innovation', emoji: '🚀' },
  practical: { name: 'The Practical', description: 'Needs practical benefits', emoji: '🔧' },
  'trend-follower': { name: 'Trend Follower', description: 'Wants social proof and popularity', emoji: '📈' },
};

// Customer name generation
const customerNames = [
  'Sarah', 'Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn', 'Blake',
  'Cameron', 'Drew', 'Emery', 'Finley', 'Hayden', 'Jamie', 'Kendall', 'Logan', 'Parker', 'Reese'
];

const PromotionCampaign: React.FC = () => {
  const [stage, setStage] = useState<'setup' | 'campaign' | 'result'>('setup');
  const [mode, setMode] = useState<CampaignMode>('basic');
  const [productMode, setProductMode] = useState<ProductMode>('random');
  const [customProduct, setCustomProduct] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [personality, setPersonality] = useState<CustomerPersonality>('skeptic');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes default
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [duration, setDuration] = useState<number>(5); // minutes
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const incrementAI = useAppStore((state) => state.incrementAIInteractions);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    // Only run timer if AI is NOT typing (fair time for student)
    if (conversationStarted && timer > 0 && stage === 'campaign' && !isAITyping) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && stage === 'campaign') {
      handleTimeUp();
    }
  }, [conversationStarted, timer, stage, isAITyping]);
  
  const generateCustomers = (): Customer[] => {
    if (mode === 'basic') {
      // Single customer for basic mode
      const personality = Object.keys(personalities)[Math.floor(Math.random() * Object.keys(personalities).length)] as CustomerPersonality;
      const name = customerNames[Math.floor(Math.random() * customerNames.length)];
      return [{
        id: `customer-1`,
        name,
        personality,
        status: 'unsure',
        emoji: personalities[personality].emoji
      }];
    } else {
      // 2-4 customers for boss mode
      const numCustomers = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4
      const availablePersonalities = Object.keys(personalities) as CustomerPersonality[];
      const selectedPersonalities = [];
      
      // Ensure unique personalities
      while (selectedPersonalities.length < numCustomers) {
        const randomPersonality = availablePersonalities[Math.floor(Math.random() * availablePersonalities.length)];
        if (!selectedPersonalities.includes(randomPersonality)) {
          selectedPersonalities.push(randomPersonality);
        }
      }
      
      return selectedPersonalities.map((personality, index) => {
        const name = customerNames[Math.floor(Math.random() * customerNames.length)];
        return {
          id: `customer-${index + 1}`,
          name,
          personality,
          status: 'unsure',
          emoji: personalities[personality].emoji
        };
      });
    }
  };

  const startCampaign = () => {
    let product = '';
    if (productMode === 'random') {
      product = randomProducts[Math.floor(Math.random() * randomProducts.length)];
    } else {
      product = customProduct;
    }
    
    setSelectedProduct(product);
    
    // Generate customers based on mode
    const generatedCustomers = generateCustomers();
    setCustomers(generatedCustomers);
    
    if (mode === 'basic') {
      setPersonality(generatedCustomers[0].personality);
    }
    
    setStage('campaign');
    
    // Set timer based on mode and duration
    if (mode === 'basic') {
      setTimer(duration * 60); // Convert minutes to seconds
    } else {
      setTimer(1200); // 20 minutes for boss mode
    }
    
    // AI sends opening message based on mode
    setTimeout(() => {
      if (mode === 'basic') {
        // Single customer opening
        const customer = generatedCustomers[0];
        const openings: Record<CustomerPersonality, string> = {
          skeptic: "Why should I care about this product? I've seen similar things before. 🤨",
          researcher: "I've researched similar products. What makes this different? 📊",
          budget: "What is the value here? I need to know if it is worth my time. 💰",
          quality: "Is this actually better than what I have now? I only want the best. ⭐",
          impulsive: "Ooh, tell me about this! What makes it special? 🤩",
          technical: "I need to understand how this works and what the benefits are. 🔧",
          silent: "....... 👀",
          'early-adopter': "What is new and innovative about this? I love trying new things! 🚀",
          practical: "How exactly will this help me in my daily life? 🔧",
          'trend-follower': "Is this popular? What do other people think about it? 📈",
        };
        sendAIMessage(`${customer.name}: ${openings[customer.personality]}`);
      } else {
        // Multiple customers opening (1-2 random customers respond)
        const respondingCustomers = generatedCustomers
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 2) + 1); // 1 or 2 customers
        
        const openings: Record<CustomerPersonality, string> = {
          skeptic: "Why should I care about this product?",
          researcher: "What makes this different from competitors?",
          budget: "What is the value proposition here?",
          quality: "Is this actually better than what I have now?",
          impulsive: "Tell me about this! What makes it special?",
          technical: "How does this work and what are the benefits?",
          silent: ".......",
          'early-adopter': "What is new and innovative about this?",
          practical: "How will this help me in my daily life?",
          'trend-follower': "Is this popular? What do others think?",
        };
        
        // Send opening messages from each customer individually
        respondingCustomers.forEach((customer, index) => {
    setTimeout(() => {
            sendAIMessage(openings[customer.personality], customer.id, customer.name);
          }, index * 500); // Stagger messages by 500ms
        });
      }
      setConversationStarted(true);
    }, 1000);
  };
  
  const sendAIMessage = (text: string, customerId?: string, customerName?: string) => {
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      sender: 'ai',
      text,
      timestamp: Date.now(),
      customerId, // Store which customer sent this
      customerName, // Store customer name for display
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
      
      const productInfo = productMode === 'custom' && customDescription 
        ? `${selectedProduct} - ${customDescription}`
        : selectedProduct;
      
      const difficultyPrompt = mode === 'boss' 
        ? 'EXTREMELY TOUGH - Only show interest if absolutely convinced. 50% success rate.'
        : 'SKEPTICAL - Show me why I should care about this. 30% success rate.';
      
      const prompt = mode === 'basic' 
        ? `You are a REAL customer in a marketing conversation. Act naturally with emotions and reactions.

CUSTOMER PROFILE:
- Personality: ${personalities[personality].name} - ${personalities[personality].description}
- Product being promoted: "${productInfo}"
- Your mood: ${difficultyPrompt}

CONVERSATION SO FAR:
${conversationHistory}

LATEST MESSAGE FROM MARKETER:
"${inputValue}"

HOW TO ACT LIKE A REAL CUSTOMER WITH EMOJIS:

1. SHOW EMOTIONS & REACTIONS:
   - Curious: "Hmm, tell me more... 🤔", "Interesting... 🧐", "Go on... 👀"
   - Skeptical: "I'm not convinced 😒", "Why should I care? 🤨", "Really? 🤷‍♂️"
   - Interested: "Wait, that sounds good! 😮", "Oh! 😯", "I like that 👍"
   - Frustrated: "This isn't relevant to me 😤", "I don't get it 🤯", "Not for me 🙅‍♂️"
   - Excited: "Wow! 🤩", "That's exactly what I need! 🎯", "Amazing! ✨"

2. ACT ACCORDING TO YOUR PERSONALITY:
   ${personality === 'skeptic' ? '- Question value: "Why should I care? 🤨", "What is the point? 🤔", "I doubt that 🙄", "Show me the benefit 📊"' : ''}
   ${personality === 'researcher' ? '- Compare: "What about [competitor]? 🔍", "I read that... 📚", "The reviews say... ⭐", "Let me check... 🔎"' : ''}
   ${personality === 'budget' ? '- Focus on value: "What is the ROI? 💰", "Is it worth it? 💸", "What is the benefit? 🏷️", "Show me the value 🎫"' : ''}
   ${personality === 'quality' ? '- Demand premium: "Is this the best? ⭐", "What makes it special? 💎", "I want top quality 👑", "Show me the quality 🔨"' : ''}
   ${personality === 'impulsive' ? '- Get excited: "Ooh! 🤩", "I want it! 😍", "Tell me more! 🚀", "This sounds great! 🔥"' : ''}
   ${personality === 'technical' ? '- Ask details: "How does it work? 🔧", "What are the features? ⚙️", "Technical details? 📋", "What is the process? 📊"' : ''}
   ${personality === 'silent' ? '- Be brief: "Okay 👍", "Hmm 🤔", "And? 👀", "Go on... ➡️", "I see 👁️"' : ''}
   ${personality === 'early-adopter' ? '- Seek innovation: "What is new? 🚀", "How is this different? 💡", "What is unique? ✨", "I love new things! 🔥"' : ''}
   ${personality === 'practical' ? '- Focus on benefits: "How will this help me? 🔧", "What is the practical use? 💪", "Real benefits? 📈", "Daily impact? ⚡"' : ''}
   ${personality === 'trend-follower' ? '- Want social proof: "Is this popular? 📈", "What do others say? 👥", "Any testimonials? ⭐", "Social proof? 🏆"' : ''}

3. ASK MARKETING-FOCUSED QUESTIONS:
   - "Why should I care about this?"
   - "What problem does this solve?"
   - "How is this different from alternatives?"
   - "What is the benefit to me?"
   - "Who else uses this?"

4. SHOW INTEREST SIGNALS IF CONVINCED:
   - "Okay, I'm starting to see the value 💡"
   - "Tell me more about the benefits 💰"
   - "How do I learn more? 🚀"
   - "This sounds interesting! 🛒"
   - "I'm interested! 🎉" (ONLY if truly convinced)

5. STAY IN CHARACTER & BE BRIEF:
   - Max 2-3 sentences
   - Sound natural and human
   - Show personality through word choice
   - React emotionally
   - Remember what was said before

RESPOND NOW as the customer (20-40 words max):`
        : `You are multiple REAL customers in a marketing conversation. Act naturally with emotions and reactions.

CUSTOMERS PRESENT:
${customers.map(c => `- ${c.name} (${personalities[c.personality].name}): ${personalities[c.personality].description}`).join('\n')}
- Product being promoted: "${productInfo}"
- Your mood: ${difficultyPrompt}

CONVERSATION SO FAR:
${conversationHistory}

LATEST MESSAGE FROM MARKETER:
"${inputValue}"

HOW TO ACT LIKE REAL CUSTOMERS:

1. NOT ALL CUSTOMERS RESPOND EVERY TIME (randomize 1-3 customers)
2. EACH CUSTOMER HAS DIFFERENT CONCERNS:
   - Skeptic: "Why should I care?", "What is the point?"
   - Researcher: "How is this different?", "What about competitors?"
   - Budget: "What is the value?", "Is it worth it?"
   - Quality: "Is this the best?", "What makes it special?"
   - Impulsive: "Tell me more!", "This sounds great!"
   - Technical: "How does it work?", "What are the features?"
   - Silent: "Hmm...", "I see...", ".......", "🤔"
   - Early Adopter: "What is new?", "How is this innovative?"
   - Practical: "How will this help me?", "What is the benefit?"
   - Trend Follower: "Is this popular?", "What do others think?"

3. FORMAT: "Customer Name: message\n\nCustomer Name: message"
4. BE BRIEF: Max 1-2 sentences per customer
5. SHOW INTEREST IF CONVINCED: "I'm interested!", "Tell me more!", "This sounds good!"
6. SILENT CUSTOMERS: If a customer is quiet/thinking, respond with natural silence like ".......", "hmm...", "🤔", "I'm thinking...", "Let me process this..."

RESPOND NOW as 1-3 random customers (format: "Name: message"):`;
      
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
      
      // Handle Boss Mode multi-customer responses
      if (mode === 'boss' && aiResponse.includes(':')) {
        // Split multi-customer response and send each message individually
        const customerMessages = aiResponse.split('\n\n').filter(msg => msg.trim());
        customerMessages.forEach((msg, index) => {
          setTimeout(() => {
            // Parse: "Alex: Message content here"
            const nameMatch = msg.match(/^([^:]+):\s*(.+)$/s);
            
            if (nameMatch) {
              const customerName = nameMatch[1].trim();
              const messageContent = nameMatch[2].trim();
              const customer = customers.find(c => c.name === customerName);
              
              // Send with clean content and metadata
              sendAIMessage(messageContent, customer?.id, customerName);
            } else {
              sendAIMessage(msg);
            }
          }, index * 500); // Stagger messages by 500ms
        });
      } else {
        // Basic mode or single response
      sendAIMessage(aiResponse);
      }
      
      // Check if conversation should end (if AI mentions interest or refusing strongly)
      const lowerResponse = aiResponse.toLowerCase();
      if (lowerResponse.includes("i'm interested") || lowerResponse.includes("you've convinced me") || lowerResponse.includes("this sounds good") || lowerResponse.includes("tell me more")) {
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
  
  const evaluateConversation = async (customersInterested: boolean) => {
    setIsAITyping(true);
    
    try {
      const conversationHistory = messages.map(m => 
        `${m.sender === 'user' ? 'Marketer' : 'Customer'}: ${m.text}`
      ).join('\n');
      
      const productInfo = productMode === 'custom' && customDescription 
        ? `${selectedProduct} - ${customDescription}`
        : selectedProduct;
      
      const prompt = mode === 'basic' 
        ? `You are evaluating a marketing campaign. The marketer tried to promote: "${productInfo}"
Customer personality: ${personalities[personality].name}
Campaign mode: ${mode}
Time limit: ${timeOption} minutes

Full conversation:
${conversationHistory}

Evaluate the marketer's performance:
1. Did they demonstrate good marketing knowledge (AIDA, value proposition, positioning, benefits, etc.)?
2. Did they handle objections well?
3. Did they adapt to the customer's personality?
4. Did they create interest and desire?

Based on difficulty (${mode === 'boss' ? '50%' : '30%'} success rate), decide if the customer would be interested.

Be TOUGH in your evaluation. Only grant a win if the marketer truly demonstrated excellent marketing skills.

IMPORTANT: Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{
  "won": true or false,
  "feedback": "overall feedback string",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "score": number between 0-100
}`
        : `You are evaluating a multi-customer marketing campaign. The marketer tried to promote: "${productInfo}"
Customers present: ${customers.map(c => `${c.name} (${personalities[c.personality].name})`).join(', ')}
Campaign mode: ${mode}
Time limit: 20 minutes

Full conversation:
${conversationHistory}

Evaluate the marketer's performance:
1. Did they demonstrate good marketing knowledge (AIDA, value proposition, positioning, benefits, etc.)?
2. Did they handle objections from different customer types?
3. Did they adapt to multiple customer personalities?
4. Did they create interest and desire across the group?

Based on difficulty (50% success rate), decide which customers would be interested.

For each customer, evaluate individually:
${customers.map(c => `- ${c.name} (${personalities[c.personality].name}): convinced or not, score 0-100, brief feedback`).join('\n')}

Be TOUGH in your evaluation. Only grant wins if the marketer truly demonstrated excellent marketing skills.

IMPORTANT: Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{
  "won": true or false,
  "feedback": "overall feedback string",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "score": number between 0-100,
  "customerResults": [
    {
      "customerId": "customer-1",
      "customerName": "Name",
      "convinced": true or false,
      "score": number 0-100,
      "feedback": "brief feedback string"
    }
  ]
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
      
      const finalResult: CampaignResult = {
        ...evaluation,
        customerResults: evaluation.customerResults,
        customersConvinced: evaluation.customerResults?.filter(r => r.convinced).length || 0,
        totalCustomers: customers.length,
      };
      
      setResult(finalResult);
      setStage('result');
      setIsAITyping(false);
      
      // Campaign completed
      incrementAI();
      
    } catch (error) {
      console.error('Evaluation Error:', error);
      setIsAITyping(false);
      setResult({
        won: false,
        feedback: "The audience wasn't convinced. Keep practicing!",
        strengths: ["You showed up and tried"],
        improvements: ["Study more marketing concepts", "Practice value proposition"],
        score: 50,
      });
      setStage('result');
    }
  };
  
  const resetCampaign = () => {
    setStage('setup');
    setMessages([]);
    setInputValue('');
    setConversationStarted(false);
    setResult(null);
    setCustomProduct('');
    setCustomDescription('');
    setCustomers([]);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold font-heading mb-2">🎯 Product Promotion Campaign</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        Test your marketing skills by promoting products to real audience members. Can you create desire and drive interest?
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
            {/* Campaign Mode Selection */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold font-heading mb-4">Select Campaign Mode</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   { id: 'basic', name: 'Basic Campaign', description: 'Single Customer', difficulty: '30% success rate', emoji: '⚡' },
                   { id: 'boss', name: 'Boss Mode', description: 'Multi-Customer Panel', difficulty: '50% success rate', emoji: '🔥' },
                 ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id as CampaignMode)}
                    className={`p-6 rounded-xl transition-all ${
                      mode === m.id
                        ? 'bg-gradient-to-br from-coral-500 to-warm-yellow-500 text-white shadow-xl'
                        : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <div className="text-4xl mb-3">{m.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{m.name}</h3>
                    <p className="text-sm opacity-90 mb-1">{m.description}</p>
                    <p className="text-xs opacity-75">{m.difficulty}</p>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Campaign Settings */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold font-heading mb-4">Campaign Settings</h2>
              
              {/* Duration Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  ⏱️ Campaign Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-coral-500 outline-none text-base appearance-none cursor-pointer hover:border-coral-400 transition-colors"
                >
                  {mode === 'basic' ? (
                    <>
                      <option value={5}>⚡ 5 minutes</option>
                      <option value={10}>🎯 10 minutes</option>
                      <option value={15}>🔥 15 minutes</option>
                    </>
                  ) : (
                    <option value={20}>🔥 20 minutes</option>
                  )}
                </select>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {mode === 'basic' ? 'Choose your campaign duration' : 'Boss Mode is fixed at 20 minutes'}
                </p>
              </div>
              
              {/* Product Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  🎯 Product Selection
                </label>
                <select
                  value={productMode}
                  onChange={(e) => setProductMode(e.target.value as 'random' | 'custom')}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-coral-500 outline-none text-base appearance-none cursor-pointer hover:border-coral-400 transition-colors"
                >
                  <option value="random">🎲 Surprise Me - Random from 20 products</option>
                  <option value="custom">✏️ My Product - Promote your own</option>
                </select>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Choose how to select your product
                </p>
              </div>
              
              {/* Custom Product Inputs */}
              {productMode === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
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
                      placeholder="e.g., My SaaS App, Freelance Design Services"
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
                onClick={startCampaign}
                disabled={productMode === 'custom' && !customProduct.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full md:w-auto md:px-12 py-4 bg-gradient-to-r from-coral-500 to-warm-yellow-500 text-white text-xl font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🚀 Start Campaign
              </motion.button>
            </div>
          </motion.div>
        )}
        
        {stage === 'campaign' && (
          <motion.div
            key="challenge"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Campaign Info Bar */}
            <div className="bg-gradient-to-r from-deep-blue-500 to-deep-blue-600 text-white p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Promoting:</p>
                <p className="font-bold text-lg">{selectedProduct}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90">Mode:</p>
                <p className="font-bold">
                  {mode === 'basic' ? '⚡ Basic Campaign' : '🔥 Boss Mode'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Time Left:</p>
                <p className={`font-bold text-2xl ${timer < 30 ? 'text-red-300 animate-pulse' : ''}`}>
                  {formatTime(timer)}
                </p>
              </div>
            </div>
            
            {/* Customer Panel for Boss Mode */}
            {mode === 'boss' && customers.length > 0 && (
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold font-heading mb-3 text-center">Target Audience Panel</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {customers.map((customer) => (
                    <div key={customer.id} className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="text-2xl mb-1">{customer.emoji}</div>
                      <p className="font-semibold text-sm">{customer.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{personalities[customer.personality].name}</p>
                      <div className="mt-1">
                        {customer.status === 'convinced' && <span className="text-green-500">✅</span>}
                        {customer.status === 'interested' && <span className="text-blue-500">😊</span>}
                        {customer.status === 'unsure' && <span className="text-yellow-500">😐</span>}
                        {customer.status === 'not-interested' && <span className="text-red-500">❌</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
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
                          {mode === 'basic' ? (
                            // Basic mode: show single customer emoji
                            personalities[personality].emoji
                          ) : (
                            // Boss mode: find customer by ID or parse from message
                            (() => {
                              if (message.customerId) {
                                // Use stored customer ID
                                const customer = customers.find(c => c.id === message.customerId);
                                return customer ? customer.emoji : '👥';
                              } else {
                                // Fallback: parse customer name from message text
                                const nameMatch = message.text.match(/^([^:]+):/);
                                if (nameMatch) {
                                  const customerName = nameMatch[1].trim();
                                  const customer = customers.find(c => c.name === customerName);
                                  return customer ? customer.emoji : '👥';
                                }
                                return '👥';
                              }
                            })()
                          )}
                        </div>
                      )}
                      <div
                        className={`px-5 py-3 rounded-2xl shadow-md ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-coral-500 to-coral-600 text-white rounded-br-sm'
                            : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-sm border border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        {/* Boss Mode: Customer Name Header */}
                        {message.sender === 'ai' && mode === 'boss' && message.customerName && (
                          <>
                            <p className="font-bold text-sm text-deep-blue-600 dark:text-deep-blue-400 mb-2">
                              {message.customerName}
                            </p>
                            <div className="border-t border-slate-300 dark:border-slate-600 mb-2"></div>
                          </>
                        )}
                        
                        {/* Message Content */}
                        <p className="text-[15px] leading-relaxed">{message.text}</p>
                        
                        {/* Timestamp */}
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
                      {mode === 'basic' ? personalities[personality].emoji : '👥'}
                    </div>
                    <div className="bg-white dark:bg-slate-700 px-5 py-3 rounded-2xl rounded-bl-sm shadow-md border border-slate-200 dark:border-slate-600">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-deep-blue-500 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-deep-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                          <div className="w-2 h-2 bg-deep-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                          {mode === 'basic' ? `${personalities[personality].name} is thinking...` : 'Audience is thinking...'}
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
                
                {/* Product Name Banner */}
                <div className="mb-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                    📦 Promoting: <span className="font-bold">{selectedProduct}</span>
                  </p>
                </div>
                {mode === 'basic' && duration >= 10 && messages.length === 1 && (
                  <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm text-blue-800 dark:text-blue-300 font-semibold">
                      💡 Extended Campaign Tip: Follow the AIDA model:
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                      1. Create Awareness → 2. Generate Interest → 3. Build Desire → 4. Drive Action
                    </p>
                  </div>
                )}
                {mode === 'boss' && messages.length === 1 && (
                  <div className="mb-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
                    <p className="text-sm text-purple-800 dark:text-purple-300 font-semibold">
                      💡 Boss Mode Tip: Address different customer needs:
                    </p>
                    <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
                      Each customer has different concerns. Address multiple needs in your messages to convince the majority.
                    </p>
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isAITyping && handleSendMessage()}
                    placeholder={isAITyping ? "Wait for audience to respond..." : "Type your marketing message..."}
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
                {result.won ? 'SUCCESSFUL CAMPAIGN!' : 'Campaign Needs Work'}
              </h2>
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
            
            {/* Customer Results for Boss Mode */}
            {mode === 'boss' && result.customerResults && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold font-heading mb-4">Individual Customer Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.customerResults.map((customerResult, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border-2 ${
                      customerResult.convinced 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{customers.find(c => c.id === customerResult.customerId)?.emoji}</span>
                        <h4 className="font-bold">{customerResult.customerName}</h4>
                        {customerResult.convinced ? <span className="text-green-500">✅</span> : <span className="text-red-500">❌</span>}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                        Score: {customerResult.score}/100
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {customerResult.feedback}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-lg font-bold text-slate-700 dark:text-slate-300">
                    {result.customersConvinced} out of {result.totalCustomers} customers convinced
                  </p>
                </div>
              </div>
            )}
            
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
                onClick={resetCampaign}
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

export default PromotionCampaign;

