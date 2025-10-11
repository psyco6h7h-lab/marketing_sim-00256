# 🎨 Lab Features - UI Sketches & Designs

This document contains visual sketches and detailed UI descriptions for all new features.

---

## 📊 SEGMENTATION LAB - New Features

### Feature 1: Custom Persona Creator (Modal)

```
┌─────────────────────────────────────────────────────────────┐
│  ✕  Create Custom Persona                                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Name: [___________________________________]                  │
│                                                               │
│  Age: [_____]    Occupation: [_________________]             │
│                                                               │
│  Income Level: [▼ Select                    ]                │
│                 • Low ($0-30K)                                │
│                 • Medium ($30K-80K)                           │
│                 • High ($80K-150K)                            │
│                 • Very High ($150K+)                          │
│                                                               │
│  Location: [___________________________________]              │
│                                                               │
│  Hobbies/Interests: [_________________________]              │
│                     [_________________________]              │
│                                                               │
│  Pain Points: [_______________________________]              │
│               [_______________________________]              │
│                                                               │
│  Goals: [_____________________________________]              │
│         [_____________________________________]              │
│                                                               │
│        [ Cancel ]    [ ✨ Create Persona ]                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Where it appears:** Button above "Available Personas" section
**Button style:** Coral gradient with "+" icon

---

### Feature 2: AI Persona Generator

```
┌─────────────────────────────────────────────────────────────────┐
│  🤖 AI Persona Generator                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Describe your target market and AI will create 3 personas:      │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ e.g., "fitness enthusiasts aged 25-35 who value health"  │  │
│  │ ___________________________________________________       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  [ ✨ Generate 3 Personas ]                                      │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 🔄 Generating personas... (appears when loading)            ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Location:** Above "Available Personas" grid
**Behavior:** 
- User types description
- Click button → AI generates 3 personas
- Personas auto-add to pool with animation
- Can be dragged to segment immediately

---

### Feature 3: Enhanced Analysis Display

```
┌──────────────────────────────────────────────────────────────────┐
│  📊 Segment Analysis: "Health-Conscious Professionals"           │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐      │
│  │  Market     │  Segment    │  Competitive │ Viability   │      │
│  │  Coverage   │  Cohesion   │  Position    │  Score      │      │
│  │             │             │              │             │      │
│  │    35%      │    8.5/10   │   Medium     │    92/100   │      │
│  │  ━━━━━━     │  ━━━━━━━━   │   ⚠️ 3 rivals │  ✅ High    │      │
│  └─────────────┴─────────────┴─────────────┴─────────────┘      │
│                                                                    │
│  📈 Demographic Breakdown                                         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                              │  │
│  │  Age Groups:      ████████ 25-34 (40%)                      │  │
│  │                   ████████ 35-44 (35%)                      │  │
│  │                   ███ 45-54 (25%)                           │  │
│  │                                                              │  │
│  │  Income:          ████████████ High (60%)                   │  │
│  │                   ██████ Medium (40%)                       │  │
│  │                                                              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  🎯 Competitive Intelligence                                      │
│  Similar segments are targeted by:                                │
│  • Whole Foods (premium health products)                          │
│  • Planet Fitness (affordable fitness)                            │
│  • Peloton (tech-enabled wellness)                                │
│                                                                    │
│  💡 Recommendations                                               │
│  • Your segment has strong cohesion - unified messaging will work │
│  • Consider sub-segmenting by age for targeted campaigns          │
│  • 35% market coverage is ideal - not too broad, not too narrow   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 POSITIONING STUDIO - New Features

### Feature 1: Multiple Map Types Selector

```
┌─────────────────────────────────────────────────────────────┐
│  Perceptual Map                                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Choose Map Type: [▼ Price vs Quality              ]         │
│                    • Price vs Quality               ✓         │
│                    • Innovation vs Tradition                  │
│                    • Luxury vs Affordable                     │
│                    • Convenience vs Customization             │
│                    • Performance vs Design                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Location:** Above perceptual map
**Behavior:** Changing map type updates axes labels and competitor positions

---

### Feature 2: Interactive Zone Insights (Perceptual Map)

```
┌───────────────────────────────────────────────────────────────────┐
│                         High Quality                               │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │                          │                                │    │
│   │   💎 Value Positioning   │   ⭐ Premium Positioning      │    │
│   │   (Hover for details)    │   (Hover for details)         │    │
│   │                          │                                │    │
│   │   • Value King ●         │   • Premium Plus ●            │    │
│   │                          │             ● Mid-Range       │    │
│   │                          │                                │    │
│ L │──────────────────────────┼─────────────────●YOU──────────│ H │
│ o │                          │                                │ i │
│ w │                          │                                │ g │
│   │                          │                                │ h │
│ P │   ⚠️ Risky Position       │   💰 Luxury Trap              │   │
│ r │   (Low price, low qual)  │   (High price, low qual)      │ P │
│ i │                          │                                │ r │
│ c │   ● Budget Brand         │                                │ i │
│ e │                          │                                │ c │
│   │                          │                                │ e │
│   └─────────────────────────────────────────────────────────┘    │
│                         Low Quality                                │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │ 💡 Your Position Analysis:                              │    │
│   │                                                          │    │
│   │ You're in the PREMIUM ZONE with 2 competitors           │    │
│   │ • Premium Plus (closest: 15% away)                      │    │
│   │ • Mid-Range Co (moderate: 28% away)                     │    │
│   │                                                          │    │
│   │ ⚠️ Warning: Close proximity to Premium Plus             │    │
│   │ 💡 Tip: Emphasize unique differentiators                │    │
│   └─────────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────────┘
```

**Hover Behavior:**
- Hover over TOP-RIGHT quadrant → Shows "Premium Positioning" tooltip
- Hover over TOP-LEFT → "Value Positioning" tooltip
- Hover over BOTTOM-RIGHT → "Luxury Trap" tooltip  
- Hover over BOTTOM-LEFT → "Risky/Budget" tooltip
- Each competitor dot shows name on hover

---

### Feature 3: Educational Tooltips

```
Target Market [?]
├─ Tooltip appears on hover:
│  ┌──────────────────────────────────────────┐
│  │ Who are you targeting?                   │
│  │                                           │
│  │ ✅ Good: "Busy professionals aged 25-40"│
│  │ ❌ Bad: "Everyone who needs this"        │
│  │                                           │
│  │ Be specific about demographics           │
│  └──────────────────────────────────────────┘
```

**Every input field has a (?) icon with helpful tooltips**

---

## 🎪 TARGETING LAB - New Features

### Feature 1: Budget Health Indicator (Enhanced)

```
┌─────────────────────────────────────────────────────────────────┐
│  💰 Marketing Budget                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  75 / 100                  ✅ Healthy Allocation                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░░░                     │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Budget Breakdown (Pie Chart):                           │   │
│  │                                                           │   │
│  │      ╱▔▔▔▔▔▔╲     • Tech Millennials: 40 (53%)          │   │
│  │    ╱  40%    ╲    • Urban Professionals: 25 (33%)        │   │
│  │   │   🔵     │    • Gen Z: 10 (14%)                      │   │
│  │   │ 25%  10% │                                           │   │
│  │    ╲   🟢   ╱                                            │   │
│  │      ╲▁▁▁▁▁╱      Status: Good mix of high & low cost   │   │
│  │                   segments                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Color Coding:**
- Green (0-80): "Healthy allocation"
- Yellow (81-100): "Consider diversifying"  
- Red (>100): "Over budget! Remove segments"

---

### Feature 2: Segment Cards with Industry Examples

```
┌────────────────────────────────────────────────────────┐
│  Tech-Savvy Millennials                      [✓]       │
├────────────────────────────────────────────────────────┤
│  Ages 25-40, high income, early adopters               │
│  Size: 500K potential customers                        │
│                                                         │
│  ┌────────────────────────────────────────────────┐   │
│  │ 🏢 Brands Targeting This Segment:              │   │
│  │                                                 │   │
│  │  [🍎 Apple]  [🚗 Tesla]  [📺 Netflix]         │   │
│  │                                                 │   │
│  └────────────────────────────────────────────────┘   │
│                                                         │
│  Market Size:      ━━━━━━━━━ 9/10                     │
│  Competition:      ━━━━━━━━░ 8/10                     │
│  Profit Potential: ━━━━━━━━━ 9/10                     │
│  Strategic Fit:    ━━━━━━━━░ 8/10                     │
│                                                         │
│  Budget Cost: 40 [?] ← Why this cost?                  │
│  ├─ Tooltip: "High cost due to strong competition     │
│  │   and need for premium marketing channels"         │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**Brand logos are small badges with hover tooltips explaining WHY they target this segment**

---

### Feature 3: Custom Segment Builder

```
┌─────────────────────────────────────────────────────────────┐
│  ✕  Create Custom Segment                                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Segment Name:                                                │
│  [_____________________________________]                      │
│  e.g., "Eco-Conscious Parents"                                │
│                                                               │
│  Target Characteristics:                                      │
│  [_____________________________________________]              │
│  [_____________________________________________]              │
│  e.g., "Parents with young children, value sustainability"   │
│                                                               │
│  Estimated Size:                                              │
│  [▼ Select size         ]                                     │
│   • Small (<100K)                                             │
│   • Medium (100K-500K)                                        │
│   • Large (500K+)                                             │
│                                                               │
│  Key Traits (select all that apply):                          │
│  ☐ Price Sensitive       ☐ Quality Focused                   │
│  ☐ Brand Loyal           ☐ Early Adopter                     │
│  ☐ Eco-Conscious         ☐ Tech-Savvy                        │
│  ☐ Convenience Seeker    ☐ Status-Driven                     │
│                                                               │
│        [ Cancel ]    [ 🤖 Let AI Evaluate ]                  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ AI will analyze your segment and assign:             │   │
│  │ • Market size score                                   │   │
│  │ • Competition level                                   │   │
│  │ • Profit potential                                    │   │
│  │ • Strategic fit                                       │   │
│  │ • Budget cost                                         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**After AI evaluation, the custom segment appears in the grid with other segments**

---

## 🎨 PRODUCT STRATEGY LAB (NEW)

### Full Page Layout

```
┌────────────────────────────────────────────────────────────────────┐
│  Product Strategy Lab                                               │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  Step 1: Choose Your Target Market                                 │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [▼ Select from your saved segments]  or  [Describe custom market] │
│                                                                      │
│  Selected: Tech-Savvy Millennials                                   │
│  Characteristics: Ages 25-40, high income, value innovation         │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  Step 2: Three-Level Product Model                                 │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                  ╔═══════════════════════════════╗                  │
│                  ║   AUGMENTED PRODUCT           ║                  │
│                  ║  ┌───────────────────────┐   ║                  │
│                  ║  │   ACTUAL PRODUCT      │   ║                  │
│                  ║  │  ┌───────────────┐   │   ║                  │
│                  ║  │  │     CORE      │   │   ║                  │
│                  ║  │  │   PRODUCT     │   │   ║                  │
│                  ║  │  │               │   │   ║                  │
│                  ║  │  │ Transportation│   │   ║                  │
│                  ║  │  └───────────────┘   │   ║                  │
│                  ║  │                       │   ║                  │
│                  ║  │ Quality: Premium      │   ║                  │
│                  ║  │ Features: Advanced    │   ║                  │
│                  ║  │ Design: Modern        │   ║                  │
│                  ║  └───────────────────────┘   ║                  │
│                  ║                               ║                  │
│                  ║ Warranty: 3 years             ║                  │
│                  ║ Support: 24/7, Live Chat      ║                  │
│                  ║ Delivery: Express shipping    ║                  │
│                  ╚═══════════════════════════════╝                  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  CORE PRODUCT (The fundamental benefit)                      │  │
│  │  What core benefit does your product provide?                │  │
│  │  [____________________________________________]               │  │
│  │  e.g., "Safe transportation from A to B"                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  ACTUAL PRODUCT (Tangible features)                          │  │
│  │                                                               │  │
│  │  Quality Level:  [━━━━━━━●━━━]  Premium                      │  │
│  │                   Budget ────────→ Luxury                     │  │
│  │                                                               │  │
│  │  Features (select):                                           │  │
│  │  ☐ Basic  ☑ Standard  ☑ Advanced  ☐ Innovative              │  │
│  │                                                               │  │
│  │  Design Style:  [▼ Modern              ]                     │  │
│  │  Brand Name:    [____________________]                       │  │
│  │  Packaging:     [▼ Premium             ]                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  AUGMENTED PRODUCT (Extra services)                          │  │
│  │                                                               │  │
│  │  Warranty:         [▼ 3 years                    ]           │  │
│  │  Customer Support: ☑ 24/7  ☑ Live Chat  ☐ Phone  ☐ Email   │  │
│  │  Delivery:         ☑ Standard  ☑ Express  ☐ Same-day        │  │
│  │  After-Sales:      ☑ Installation  ☐ Training  ☐ Maintenance│  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  Step 3: Product Attributes                                        │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Adjust sliders to define your product's attributes:                │
│                                                                      │
│  Quality:        [━━━━━━━━━●━]  90/100  ⭐⭐⭐⭐⭐               │
│  Durability:     [━━━━━━━●━━━]  75/100                            │
│  Reliability:    [━━━━━━━━●━━]  85/100                            │
│  Style/Design:   [━━━━━━━━━●━]  95/100  🎨                        │
│  Innovation:     [━━━━━●━━━━━]  55/100                            │
│  Sustainability: [━━━●━━━━━━━]  40/100  ⚠️ Low for target!        │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                   [ ✨ Analyze Product Strategy ]                   │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  📊 AI Product Evaluation                                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Market Fit Score: 78/100  🟡 Good, but room for improvement       │
│                                                                      │
│  ✅ Strengths:                                                      │
│  • Premium quality aligns with Tech-Savvy Millennials' expectations│
│  • Modern design appeals to target's aesthetic preferences          │
│  • Advanced features match their early adopter mentality            │
│                                                                      │
│  ⚠️ Mismatches:                                                     │
│  • Low sustainability score (40) but target values eco-friendly    │
│  • Missing innovative features for tech-savvy audience              │
│                                                                      │
│  🏢 Competitor Comparison:                                          │
│  • Apple: Quality 95, Innovation 98, Sustainability 70              │
│  • Your product: Quality 90, Innovation 55, Sustainability 40       │
│  • Gap: You're behind in innovation and sustainability              │
│                                                                      │
│  💡 Recommendations:                                                │
│  1. Increase sustainability to 70+ (eco-friendly packaging, carbon) │
│  2. Add innovative tech features (app integration, AI, IoT)         │
│  3. Consider premium warranty (lifetime) for brand positioning      │
│  4. Emphasize design as key differentiator in marketing             │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
```

---

## 💰 PRICING LAB (NEW)

### Full Page Layout

```
┌────────────────────────────────────────────────────────────────────┐
│  Pricing Lab                                                        │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  Product Context                                                    │
├────────────────────────────────────────────────────────────────────┤
│  Product: SmartPhone X  |  Target: Tech Millennials  |  Quality: Premium │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  Cost Structure                                                     │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Fixed Costs:    $50,000  (overhead, rent, salaries)               │
│  Variable Cost:  $200     (materials, labor per unit)              │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Total Cost per Unit:  $200 + ($50,000 ÷ units)             │  │
│  │  Break-Even Quantity:  [Calculated based on price]           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  Choose Pricing Strategy (Click to select)                         │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────┐│
│  │    💵    │  │    💎    │  │    ⚖️    │  │    📉    │  │  📈  ││
│  │Cost-Plus │  │  Value   │  │Competitive│  │Penetrate │  │ Skim ││
│  │          │  │  Based   │  │   Based   │  │   ion    │  │ ming ││
│  │ [SELECT] │  │ [SELECT] │  │ [SELECT]  │  │ [SELECT] │  │[SELE]││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────┘│
│                      ▲ SELECTED                                     │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  💎 Value-Based Pricing (Selected)                                 │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Customer Perceived Value:  [━━━━━━●━━━━━]  $650                   │
│                              $0 ──────────→ $1000                   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Competitor Reference Prices:                                │  │
│  │  • Apple iPhone:    $999                                     │  │
│  │  • Samsung Galaxy:  $799                                     │  │
│  │  • Google Pixel:    $699                                     │  │
│  │                                                               │  │
│  │  Average: $832                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Your Price (based on value): $650                                  │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  📊 Pricing Calculator Dashboard                                   │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│            YOUR PRICE: $650                                         │
│                                                                      │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐    │
│  │ Profit Margin│ Break-Even   │   ROI        │  Positioning │    │
│  │              │   Quantity   │              │              │    │
│  │    69% 🟢    │  112 units   │    145%      │ Mid-Premium  │    │
│  │  (Healthy)   │              │              │              │    │
│  └──────────────┴──────────────┴──────────────┴──────────────┘    │
│                                                                      │
│  Revenue Projections:                                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Units  │  Revenue   │  Profit   │  Margin                  │  │
│  ├─────────┼────────────┼───────────┼──────────────────────────┤  │
│  │   100   │  $65,000   │  $15,000  │  23%  ━━━━░░░░░░         │  │
│  │   500   │  $325,000  │  $225,000 │  69%  ━━━━━━━━━░         │  │
│  │  1,000  │  $650,000  │  $500,000 │  77%  ━━━━━━━━━━         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  🎯 Psychological Pricing Options                                  │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ☑ Charm Pricing:      $649.99 instead of $650  (Feels cheaper)   │
│  ☐ Prestige Pricing:   $650 (Round number = premium feel)          │
│  ☐ Bundle Pricing:     $750 with accessories                       │
│  ☐ Launch Discount:    $549 (15% off) for early adopters           │
│                                                                      │
│  Adjusted Price: $649.99                                            │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                    [ 🤖 Get Pricing Feedback ]                     │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  💡 AI Pricing Analysis                                            │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Overall Score: 82/100  ✅ Strong pricing strategy                 │
│                                                                      │
│  ✅ Price-Quality Match:                                            │
│  Your $650 price aligns well with Premium positioning               │
│                                                                      │
│  ✅ Target Market Affordability:                                    │
│  Tech Millennials have high income - price is affordable            │
│                                                                      │
│  ⚠️ Competitive Position:                                           │
│  You're 22% cheaper than Apple but 7% cheaper than Google Pixel.    │
│  This positions you as "value premium" which can work well.         │
│                                                                      │
│  ✅ Strategy Fit:                                                   │
│  Value-based pricing matches your differentiation strategy          │
│                                                                      │
│  💡 Recommendations:                                                │
│  1. Consider raising to $699 - you're leaving money on the table    │
│  2. Charm pricing ($649.99) is good for perception                  │
│  3. Offer payment plans to increase accessibility                   │
│  4. Bundle with accessories at $799 (perceived value boost)         │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
```

---

## 📢 PROMOTION LAB (NEW)

### Full Page Layout

```
┌────────────────────────────────────────────────────────────────────┐
│  Promotion Lab                                                      │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  Campaign Context                                                   │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Product:    SmartPhone X                                           │
│  Target:     Tech-Savvy Millennials                                 │
│  Budget:     [$10,000         ]                                     │
│  Duration:   [▼ 3 months]                                           │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  Budget Allocation (Drag sliders to allocate)                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│          ╱▔▔▔▔▔▔▔▔▔╲                                               │
│        ╱  30% 🔴     ╲                                              │
│      ╱  Advertising   ╲                                             │
│     │                  │                                             │
│     │ 10%            25% │      1. Advertising:      30%  $3,000   │
│     │ 🟡           🔵   │      2. Public Relations:  25%  $2,500   │
│     │                  │      3. Sales Promotion:   20%  $2,000   │
│     │ Direct       │      4. Personal Selling:   15%  $1,500   │
│      ╲  15% 🟢 Sales ╱       5. Direct Marketing:   10%  $1,000   │
│        ╲   Promo   ╱                                                │
│          ╲▁▁▁20%▁╱           Total: 100% ✅  $10,000                │
│                                                                      │
│  Advertising:      [━━━━━●━━━━━]  30%   $3,000                     │
│  Public Relations: [━━━━●━━━━━━]  25%   $2,500                     │
│  Sales Promotion:  [━━━●━━━━━━━]  20%   $2,000                     │
│  Personal Selling: [━━●━━━━━━━━]  15%   $1,500                     │
│  Direct Marketing: [━●━━━━━━━━━]  10%   $1,000                     │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  Select Tactics (Available based on budget allocation)             │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  📺 ADVERTISING ($3,000 allocated)                                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Choose tactics:                                               │  │
│  │                                                               │  │
│  │ ☑ Social Media Ads         Cost: $1,500  Reach: High         │  │
│  │   (Facebook, Instagram, TikTok)                               │  │
│  │   Best for: Gen Z, Millennials                                │  │
│  │                                                               │  │
│  │ ☑ Influencer Marketing     Cost: $1,000  Reach: Medium       │  │
│  │   (Tech reviewers, lifestyle influencers)                     │  │
│  │   Best for: Trust-building                                    │  │
│  │                                                               │  │
│  │ ☐ TV Commercials           Cost: $2,500  Reach: High         │  │
│  │   (Expensive, broad reach)                                    │  │
│  │   Best for: Mass market      ⚠️ Over budget!                 │  │
│  │                                                               │  │
│  │ ☑ YouTube Pre-Roll Ads     Cost: $500    Reach: Medium       │  │
│  │   (Video platform, targeted)                                  │  │
│  │   Best for: Tech-savvy audiences                              │  │
│  │                                                               │  │
│  │ Selected total: $3,000 ✅                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  📰 PUBLIC RELATIONS ($2,500 allocated)                            │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ ☑ Press Releases           Cost: $500    Reach: Medium       │  │
│  │ ☑ Tech Blog Reviews        Cost: $1,000  Reach: High         │  │
│  │ ☑ Event Sponsorships       Cost: $1,000  Reach: Medium       │  │
│  │                                                               │  │
│  │ Selected total: $2,500 ✅                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  🎁 SALES PROMOTION ($2,000 allocated)                             │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ ☑ Launch Discount (15% off) Cost: $1,500  Boost: High       │  │
│  │ ☑ Referral Program          Cost: $500    Boost: Medium     │  │
│  │                                                               │  │
│  │ Selected total: $2,000 ✅                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [Similar sections for Personal Selling & Direct Marketing...]      │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  📅 Campaign Timeline (3 months)                                   │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Month 1          │  Month 2          │  Month 3                   │
│  ─────────────────┼───────────────────┼───────────────────         │
│                   │                   │                             │
│  Social Media ━━━━┼━━━━━━━━━━━━━━━━━━┼━━━━━━━━━                  │
│  Influencer    ━━━┼━━━━━━━━━━━━━━━━━━┼━━━━━━━━━                  │
│  Press Release █  │                   │                             │
│  Launch Disc   ███│                   │                             │
│  Tech Reviews     │  ████████████     │                             │
│  Event Sponsor    │        █████      │                             │
│                                                                      │
│  Intensity:   High │      Medium      │      Low                   │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  📊 Estimated Reach & Impact                                       │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Estimated Impressions:      2,500,000                              │
│  Estimated Reach:            35% of target market (175K people)     │
│  Average Frequency:          7.1 exposures per person  ✅ Good!    │
│  Engagement Rate:            4.2%                                   │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                   [ 🤖 Analyze Promotional Mix ]                   │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  💡 AI Campaign Analysis                                           │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Audience Alignment Score: 88/100  ✅ Excellent!                   │
│                                                                      │
│  ✅ What's Working:                                                 │
│  • 30% advertising budget focused on social media - perfect for     │
│    Tech-Savvy Millennials who spend 3+ hours/day on social         │
│  • Influencer marketing (tech reviewers) builds credibility         │
│  • Launch discount creates urgency and trial                        │
│                                                                      │
│  ⚠️ Potential Issues:                                               │
│  • Personal Selling (15%) may be too high for a tech product        │
│    that sells primarily online                                      │
│  • Direct Marketing (10%) is low - email campaigns work well for    │
│    this audience                                                    │
│                                                                      │
│  📊 Budget Efficiency:                                              │
│  • High ROI tactics: Social media ads, influencers, referral program│
│  • Medium ROI: Press releases, event sponsorships                   │
│  • Consider shifting: Move 5% from Personal Selling to Direct       │
│    Marketing (email/retargeting)                                    │
│                                                                      │
│  🎯 Channel Mix Balance:                                            │
│  • Push (Selling): 35% ✅ Good                                      │
│  • Pull (Branding): 65% ✅ Excellent for new product launch        │
│                                                                      │
│  ⏰ Timing Strategy:                                                │
│  • Front-loaded campaign is smart for product launch                │
│  • Consider extending social media ads into Month 3 for sustained   │
│    awareness                                                        │
│                                                                      │
│  🏢 Industry Comparison:                                            │
│  • Apple spends: 40% Advertising, 30% PR, 20% Digital, 10% Events  │
│  • Your mix is similar but more digitally focused - good!           │
│                                                                      │
│  💡 Recommendations:                                                │
│  1. Shift 5% from Personal Selling to Direct Marketing              │
│  2. Add retargeting ads in Month 2-3 to recapture interested users  │
│  3. Create user-generated content campaign for authenticity          │
│  4. Partner with tech podcasts for credibility boost                │
│  5. Your frequency (7.1) is perfect - maintain this level           │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🔗 CROSS-LAB INTEGRATION

### Navigation Hints (Appears after completing a lab)

```
┌────────────────────────────────────────────────────────────────────┐
│  🎉 Congratulations! Lab Complete                                  │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  You've successfully completed the Segmentation Lab!                │
│  Your segment "Health-Conscious Professionals" has been saved.      │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🗺️ Continue Your Marketing Journey                          │  │
│  │                                                               │  │
│  │  Next Step: Define your targeting strategy                   │  │
│  │                                                               │  │
│  │  In the Targeting Lab, you can:                              │  │
│  │  • Choose which segments to target                           │  │
│  │  • Allocate marketing budget                                 │  │
│  │  • Get AI feedback on your targeting mix                     │  │
│  │                                                               │  │
│  │  [ Go to Targeting Lab → ]    [ Back to Dashboard ]         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
```

---

## 📈 DASHBOARD - Progress Tracking

### Updated Dashboard Section

```
┌────────────────────────────────────────────────────────────────────┐
│  🎯 Marketing Strategy Journey                                     │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Complete all 6 labs to master marketing strategy!                  │
│                                                                      │
│  Progress: 3/6 Labs Complete (50%)                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░░░░░                         │
│                                                                      │
│  ┌────────────┬────────────┬────────────┬────────────┬──────────┐ │
│  │     1      │     2      │     3      │     4      │    5     │ │
│  │ Segment    │  Targeting │ Positioning│  Product   │  Pricing │ │
│  │            │            │            │            │          │ │
│  │     ✅     │     ✅     │     ✅     │     ⏳     │    ⏳    │ │
│  │  Complete  │  Complete  │  Complete  │  Start Lab │ Locked   │ │
│  └────────────┴────────────┴────────────┴────────────┴──────────┘ │
│                                                                      │
│  ┌────────────┐                                                     │
│  │     6      │   🏆 Complete all 6 to unlock:                      │
│  │ Promotion  │   • "Marketing Strategist" Badge                    │
│  │            │   • Full strategy report                            │
│  │     ⏳     │   • Certificate of completion                       │
│  │   Locked   │                                                     │
│  └────────────┘                                                     │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 UI Design Notes

### Color Scheme (Consistent Across All Labs)
- **Primary Actions:** Coral gradient (#FF6B6B → #FFA94D)
- **Success States:** Green (#10B981)
- **Warning States:** Yellow (#F59E0B)
- **Error States:** Red (#EF4444)
- **Info/Educational:** Blue (#3B82F6)
- **AI Features:** Purple gradient (#8B5CF6 → #EC4899)

### Animation Patterns
- **Cards appearing:** Fade in + slide up (0.3s)
- **Drag interactions:** Scale 1.05 on drag
- **Button clicks:** Scale 0.95 on tap
- **Progress bars:** Smooth width animation (0.5s)
- **Modals:** Fade backdrop + scale content (0.2s)

### Responsive Breakpoints
- **Mobile:** < 640px (Stack all elements, full-width cards)
- **Tablet:** 640px - 1024px (2-column grids)
- **Desktop:** > 1024px (3-column grids, side-by-side layouts)

---

## ✅ Implementation Priority

**Week 1:** API Migration + Segmentation Lab enhancements
**Week 2:** Positioning Studio + Targeting Lab enhancements
**Week 3:** Product Strategy Lab (new)
**Week 4:** Pricing Lab (new)
**Week 5:** Promotion Lab (new)
**Week 6:** Integration, testing, polish

---

**This completes the visual sketches for all new features!** 🎉

Each sketch shows exact layout, interactions, and content for implementation.

