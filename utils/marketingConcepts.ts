// Marketing concepts data for Learn Marketing page and Quiz
export interface MarketingConcept {
  id: string;
  title: string;
  icon: string;
  gradient: string;
  overview: {
    what: string;
    why: string;
  };
  keyConcepts: {
    name: string;
    icon: string;
    description: string;
    examples: string[];
    color: string;
  }[];
  realWorldExamples: {
    company: string;
    strategy: string;
    result: string;
  }[];
  keyTakeaways: string[];
}

export const marketingConcepts: MarketingConcept[] = [
  {
    id: 'marketing-mix',
    title: "The 4 Ps of Marketing",
    icon: "📊",
    gradient: "from-blue-500 to-purple-600",
    overview: {
      what: "The Marketing Mix, also known as the 4Ps of Marketing, is the foundational framework that defines the tactical components of marketing strategy. Developed by E. Jerome McCarthy in 1960, it consists of four controllable elements that businesses can adjust to influence customer behavior and achieve their marketing objectives. This framework helps marketers systematically plan and execute strategies that create, communicate, and deliver value to target customers while building profitable relationships.",
      why: "Mastering the 4Ps enables businesses to create integrated marketing strategies that work synergistically rather than in isolation. Each P affects and is affected by the others, creating a cohesive approach that maximizes customer satisfaction and business profitability. This framework provides a structured way to analyze market opportunities, develop competitive advantages, and ensure all marketing activities align with business goals and customer needs."
    },
    keyConcepts: [
      {
        name: "Product",
        icon: "📦",
        description: "The core offering that satisfies customer needs and wants. This includes not just the physical product or service, but also its features, quality, design, brand, packaging, warranties, and after-sales support. Product decisions encompass the entire customer experience and value proposition.",
        examples: [
          "iPhone 15 Pro - Advanced camera system, titanium design, A17 Pro chip, iOS ecosystem",
          "Tesla Model 3 - Electric powertrain, autopilot features, over-the-air updates, supercharger network",
          "Netflix - Streaming content library, original programming, personalized recommendations, multiple device access",
          "McDonald's Big Mac - Consistent taste globally, standardized ingredients, fast preparation, recognizable brand"
        ],
        color: "blue"
      },
      {
        name: "Price",
        icon: "💰",
        description: "The amount customers pay for the product, including pricing strategies, discounts, payment terms, and value perception. Pricing affects profitability, market positioning, and customer psychology. It must reflect the value delivered while remaining competitive and profitable.",
        examples: [
          "Apple iPhone - Premium pricing ($999+) reflecting innovation and status, high margins",
          "Walmart - Everyday low prices, cost leadership strategy, high volume, low margins",
          "Uber - Dynamic pricing based on demand and supply, surge pricing during peak times",
          "Spotify - Freemium model with ads vs premium subscription, student discounts"
        ],
        color: "green"
      },
      {
        name: "Place",
        icon: "🏪",
        description: "Distribution channels and locations where customers can access and purchase the product. This includes physical stores, online platforms, distribution networks, inventory management, and logistics. Place decisions affect accessibility, convenience, and customer experience.",
        examples: [
          "Amazon - Global e-commerce platform, Prime delivery network, marketplace for third parties",
          "Starbucks - 32,000+ locations globally, drive-through, mobile ordering, licensed stores",
          "Tesla - Direct-to-consumer sales, showrooms, service centers, online ordering",
          "Coca-Cola - Mass distribution through retailers, restaurants, vending machines, global reach"
        ],
        color: "orange"
      },
      {
        name: "Promotion",
        icon: "📢",
        description: "Marketing communications used to inform, persuade, and remind customers about the product. This includes advertising, public relations, sales promotion, personal selling, digital marketing, and content marketing. Promotion creates awareness and drives customer action.",
        examples: [
          "Nike - 'Just Do It' campaigns, athlete endorsements, social media, experiential marketing",
          "Coca-Cola - Global advertising campaigns, sponsorships, seasonal promotions, social media",
          "Red Bull - Extreme sports sponsorships, content marketing, events, influencer partnerships",
          "HubSpot - Inbound marketing, content creation, SEO, webinars, thought leadership"
        ],
        color: "red"
      }
    ],
    realWorldExamples: [
      {
        company: "Apple",
        strategy: "Premium Product (innovative design, superior quality) + Premium Price (high margins) + Exclusive Distribution (Apple Stores, select retailers) + Emotional Promotion (lifestyle marketing, ecosystem benefits)",
        result: "Most valuable company globally with $3+ trillion market cap, 20%+ profit margins, cult-like customer loyalty, and premium brand positioning that competitors struggle to match"
      },
      {
        company: "McDonald's",
        strategy: "Consistent Product (standardized menu globally) + Affordable Price (value meals, dollar menu) + Global Placement (38,000+ locations, drive-through, delivery) + Family Promotion (Ronald McDonald, happy meals, community involvement)",
        result: "World's largest restaurant chain serving 69 million customers daily, $23+ billion revenue, strong brand recognition in 120+ countries, and consistent profitability through operational efficiency"
      },
      {
        company: "Tesla",
        strategy: "Innovative Product (electric vehicles, autopilot, over-the-air updates) + Premium Price (luxury positioning) + Direct Distribution (showrooms, online sales, no dealers) + Mission-Driven Promotion (sustainability focus, Elon Musk's personal brand, word-of-mouth)",
        result: "Revolutionized automotive industry, became most valuable car company, achieved 30%+ market share in luxury EVs, created new market category without traditional advertising"
      }
    ],
    keyTakeaways: [
      "All 4Ps must work together harmoniously - changes in one P affect all others and must be coordinated",
      "Customer needs and market conditions should drive decisions in each P, not internal convenience",
      "Consistency across all Ps builds strong brand equity and customer trust over time",
      "Regular review and adjustment of the marketing mix is essential as markets evolve",
      "The 4Ps framework applies to all industries but requires customization for specific contexts",
      "Successful companies often excel in one P while maintaining competence in others",
      "Digital transformation has expanded the scope of each P, especially Place and Promotion",
      "Measuring the effectiveness of each P separately and together is crucial for optimization"
    ]
  },
  {
    id: 'stp-framework',
    title: "STP: Segmentation, Targeting, Positioning",
    icon: "🎯",
    gradient: "from-green-500 to-teal-600",
    overview: {
      what: "The STP (Segmentation, Targeting, Positioning) model is a strategic marketing framework developed by Philip Kotler that guides businesses through the process of identifying and serving their most valuable customers. This three-step approach helps companies move from a mass marketing mindset to a more focused, customer-centric strategy. Segmentation involves dividing the heterogeneous market into smaller, homogeneous groups based on shared characteristics. Targeting involves evaluating these segments and selecting the most attractive ones to serve. Positioning involves creating a unique and compelling value proposition that differentiates the brand in the minds of target customers.",
      why: "The STP framework enables businesses to allocate resources more efficiently by focusing on the most profitable customer segments rather than trying to serve everyone. This targeted approach leads to higher customer satisfaction, stronger brand loyalty, and improved profitability. By understanding distinct customer groups and their unique needs, companies can develop more relevant products, create more effective marketing messages, and build stronger competitive advantages. The framework also helps businesses avoid the trap of being everything to everyone, which often leads to diluted brand positioning and mediocre results."
    },
    keyConcepts: [
      {
        name: "Segmentation",
        icon: "🔍",
        description: "The process of dividing a heterogeneous market into smaller, more homogeneous groups based on shared characteristics, needs, behaviors, or preferences. Effective segmentation creates groups that are internally similar but externally different from other segments.",
        examples: [
          "Demographic - Age (Gen Z: 18-26, Millennials: 27-42), Income (High-income: $100k+, Middle-income: $40-100k), Education (College-educated vs high school)",
          "Psychographic - Lifestyle (Health-conscious, Tech-savvy, Eco-friendly), Values (Sustainability, Innovation, Tradition), Personality (Adventurous, Conservative, Social)",
          "Behavioral - Usage patterns (Heavy users, Occasional users, Non-users), Purchase behavior (Brand loyal, Price-sensitive, Impulse buyers), Benefits sought (Quality, Convenience, Status)",
          "Geographic - Location (Urban, Suburban, Rural), Climate (Tropical, Temperate, Cold), Culture (Western, Eastern, Latin American)"
        ],
        color: "blue"
      },
      {
        name: "Targeting",
        icon: "🎯",
        description: "The process of evaluating market segments and selecting the most attractive ones to serve based on criteria such as size, growth potential, profitability, competition, and company capabilities. Targeting involves making strategic decisions about which segments to prioritize.",
        examples: [
          "Tesla - Targets affluent tech enthusiasts and early adopters who value innovation, sustainability, and premium quality",
          "Spotify - Targets music lovers across all demographics but focuses on younger users (18-34) who are tech-savvy and streaming-native",
          "Peloton - Targets fitness enthusiasts with disposable income who prefer convenience and premium experiences",
          "Walmart - Targets price-conscious families and budget-conscious consumers seeking value and convenience"
        ],
        color: "green"
      },
      {
        name: "Positioning",
        icon: "📍",
        description: "The process of creating a unique and compelling image of the brand in the minds of target customers relative to competitors. Positioning involves identifying the brand's key differentiators and communicating them effectively to create a distinct market position.",
        examples: [
          "BMW - 'Ultimate Driving Machine' - Positions as the brand for driving enthusiasts who value performance and luxury",
          "Volvo - 'Safety First' - Positions as the family car brand that prioritizes safety above all else",
          "Harley-Davidson - 'Freedom' - Positions as the motorcycle brand for rebels and free spirits seeking adventure",
          "Patagonia - 'Environmental Activism' - Positions as the outdoor brand for environmentally conscious consumers"
        ],
        color: "orange"
      }
    ],
    realWorldExamples: [
      {
        company: "Tesla",
        strategy: "Segments luxury EV market into early adopters and tech enthusiasts → Targets affluent, environmentally conscious consumers who value innovation → Positions as the premium, innovative leader in sustainable transportation with superior technology and performance",
        result: "Dominates high-end EV market with 30%+ market share, achieved $1 trillion market cap, created cult-like brand loyalty, and forced traditional automakers to accelerate EV development"
      },
      {
        company: "Dollar Shave Club",
        strategy: "Segments men's grooming market into price-conscious and convenience-seeking consumers → Targets men aged 18-45 who are frustrated with expensive razors → Positions against Gillette's high prices with simple, affordable, subscription-based razor delivery",
        result: "Disrupted Gillette's 70% market share dominance, achieved $1 billion acquisition by Unilever, created new direct-to-consumer model that competitors copied"
      },
      {
        company: "Airbnb",
        strategy: "Segments travel market into budget-conscious and experience-seeking travelers → Targets millennials and digital natives who prefer authentic experiences → Positions as the platform for unique, local accommodations that offer authentic travel experiences vs. sterile hotels",
        result: "Revolutionized travel industry, achieved $100+ billion valuation, forced hotels to adapt their business models, created new category of 'sharing economy'"
      }
    ],
    keyTakeaways: [
      "Segmentation must be measurable, accessible, substantial, and actionable - segments should be large enough to be profitable and reachable through marketing efforts",
      "Target segments should be evaluated on size, growth potential, profitability, competition intensity, and alignment with company capabilities and resources",
      "Positioning requires clear differentiation and must be consistently communicated across all touchpoints to build strong brand associations",
      "Regular reassessment of STP strategy is essential as markets evolve, competitors change, and customer preferences shift",
      "The three steps are sequential and interdependent - poor segmentation leads to poor targeting, which leads to weak positioning",
      "Digital tools and data analytics have made segmentation more sophisticated and targeting more precise than ever before",
      "Successful positioning often focuses on one key benefit or attribute rather than trying to be everything to everyone",
      "STP should align with the company's overall business strategy and competitive advantages to ensure sustainable success"
    ]
  },
  {
    id: 'marketing-funnel',
    title: "The Marketing Funnel",
    icon: "🔄",
    gradient: "from-purple-500 to-pink-600",
    overview: {
      what: "The marketing funnel is a visual representation of the customer journey from initial awareness to final purchase and beyond. It illustrates how prospects move through different stages of engagement, with each stage representing a narrowing of the audience as some prospects drop out while others advance. The funnel concept helps marketers understand customer behavior patterns, identify bottlenecks in the conversion process, and develop targeted strategies for each stage. Modern funnels often include post-purchase stages like retention, advocacy, and repeat purchases, recognizing that customer acquisition is just the beginning of the relationship.",
      why: "Understanding the marketing funnel enables businesses to optimize each stage of the customer journey, improving conversion rates and maximizing the lifetime value of customers. By identifying where prospects drop off, companies can address specific pain points and barriers to conversion. The funnel framework helps allocate marketing resources more effectively, ensuring that tactics align with where prospects are in their decision-making process. It also enables measurement and optimization of the entire customer acquisition and retention process, leading to more efficient marketing spend and higher ROI."
    },
    keyConcepts: [
      {
        name: "Awareness",
        icon: "👁️",
        description: "The top of the funnel where prospects first become aware of your brand, product, or service. This stage focuses on creating visibility and generating initial interest through broad-reaching marketing activities.",
        examples: [
          "Social media advertising - Facebook, Instagram, LinkedIn ads targeting broad demographics",
          "Content marketing - Blog posts, videos, podcasts that address customer pain points",
          "Public relations - Media coverage, press releases, thought leadership articles",
          "Search engine optimization - Ranking for relevant keywords in organic search",
          "Influencer partnerships - Collaborations with industry experts and celebrities",
          "Display advertising - Banner ads on relevant websites and platforms"
        ],
        color: "blue"
      },
      {
        name: "Interest",
        icon: "🤔",
        description: "Prospects show genuine interest and begin seeking more information about your offering. They're willing to engage further but haven't committed to purchasing yet.",
        examples: [
          "Email signups - Newsletter subscriptions, lead magnets, gated content",
          "Website visits - Multiple page views, time spent on site, return visits",
          "Content downloads - Whitepapers, e-books, guides, case studies",
          "Social media engagement - Likes, shares, comments, follows",
          "Webinar attendance - Educational sessions, product demos, expert panels",
          "Free trials - Software trials, sample products, consultation bookings"
        ],
        color: "green"
      },
      {
        name: "Consideration",
        icon: "⚖️",
        description: "Prospects actively evaluate your offering against competitors and are closer to making a purchase decision. They need detailed information and reassurance.",
        examples: [
          "Product demonstrations - Live demos, video walkthroughs, hands-on trials",
          "Comparison content - Feature comparisons, pricing guides, competitor analyses",
          "Customer testimonials - Reviews, case studies, success stories, references",
          "Sales conversations - Consultations, proposals, personalized recommendations",
          "Free consultations - Strategy sessions, needs assessments, custom solutions",
          "Limited-time offers - Discounts, bonuses, exclusive access to encourage decision"
        ],
        color: "orange"
      },
      {
        name: "Purchase",
        icon: "🛒",
        description: "Prospects convert into paying customers through a transaction. This stage focuses on making the purchase process smooth and satisfying.",
        examples: [
          "Sales calls - Direct sales conversations, closing techniques, objection handling",
          "Special offers - Discounts, bundles, limited-time promotions",
          "Easy checkout - Streamlined purchase process, multiple payment options",
          "Sales support - Live chat, phone support, personal assistance",
          "Risk reduction - Guarantees, warranties, money-back promises",
          "Urgency tactics - Limited availability, countdown timers, exclusive access"
        ],
        color: "red"
      },
      {
        name: "Retention & Advocacy",
        icon: "❤️",
        description: "Post-purchase stages focusing on customer satisfaction, retention, and turning customers into advocates who promote your brand.",
        examples: [
          "Onboarding programs - Welcome sequences, tutorials, success guidance",
          "Customer support - Help desks, knowledge bases, community forums",
          "Loyalty programs - Points systems, exclusive benefits, VIP treatment",
          "Referral programs - Incentives for bringing new customers",
          "Upselling/Cross-selling - Additional products, premium features, upgrades",
          "Feedback collection - Surveys, reviews, testimonials, case studies"
        ],
        color: "purple"
      }
    ],
    realWorldExamples: [
      {
        company: "HubSpot",
        strategy: "Awareness through free content marketing and SEO → Interest via valuable resources and lead magnets → Consideration with free CRM tools and demos → Purchase through premium features and sales conversations → Retention via excellent onboarding and support",
        result: "Built $1.5+ billion business through inbound marketing funnel, 100,000+ customers, industry-leading customer success rates"
      },
      {
        company: "Shopify",
        strategy: "Awareness through entrepreneurship content and success stories → Interest with free trials and educational resources → Consideration via competitor comparisons and customer testimonials → Purchase through easy setup and support → Retention via app ecosystem and community",
        result: "Powers 1.7+ million businesses globally, $4.6+ billion revenue, transformed e-commerce industry"
      },
      {
        company: "Slack",
        strategy: "Awareness through viral growth and word-of-mouth → Interest via free team trials and integrations → Consideration through productivity benefits and team collaboration features → Purchase via team adoption and enterprise features → Retention through network effects and habit formation",
        result: "Achieved $27+ billion valuation, 12+ million daily active users, revolutionized workplace communication"
      }
    ],
    keyTakeaways: [
      "Each stage requires different marketing tactics and messaging - awareness focuses on reach while consideration focuses on conversion",
      "Not all prospects move through the funnel linearly - many skip stages or move back and forth based on their needs",
      "Nurturing and follow-up are crucial for conversion - most prospects need multiple touchpoints before purchasing",
      "Post-purchase experience directly affects retention, referrals, and lifetime value - the funnel extends beyond acquisition",
      "Funnel metrics and analytics are essential for optimization - measure conversion rates at each stage",
      "Personalization becomes more important as prospects move deeper into the funnel",
      "Content should be tailored to each stage - educational content for awareness, comparison content for consideration",
      "The funnel should be viewed as a continuous cycle rather than a one-way journey"
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

