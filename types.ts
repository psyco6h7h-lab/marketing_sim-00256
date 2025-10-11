
export interface Module {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'Core Concepts' | 'Labs' | 'Advanced';
}

export interface Persona {
    id: string;
    name: string;
    avatar: string;
    details: { [key: string]: string };
}

export interface AnalysisResult {
    segmentName: string;
    keyCharacteristics: string;
    marketingStrategies: string[];
    // Enhanced metrics
    marketCoverage?: number;
    segmentCohesion?: number;
    competitivePosition?: string;
    viabilityScore?: number;
    demographicBreakdown?: {
        ageGroups: { [key: string]: number };
        incomeLevels: { [key: string]: number };
    };
    competitiveIntelligence?: string[] | string;
    recommendations?: string[];
}
