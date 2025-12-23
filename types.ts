
export type Section = 'dashboard' | 'crop' | 'livestock' | 'soil' | 'weather' | 'chat' | 'database' | 'ml-lab' | 'api-console' | 'live-field' | 'seasonal' | 'error-hub' | 'simulation' | 'culture' | 'memory' | 'global-sync' | 'safety-lab';

export type FarmingPhase = 'Planting' | 'Growth' | 'Harvest' | 'Post-Harvest' | 'Fallow';

export type FailureReason = 'weather' | 'soil' | 'timing' | 'pests' | 'practice' | 'unknown';

export type Language = 'English' | 'Shona' | 'Ndebele' | 'Swahili' | 'Yoruba' | 'French' | 'Hindi' | 'Spanish';

export interface SafetyAuditResult {
  safetyScore: number; // 0-100
  environmentalImpact: 'low' | 'medium' | 'high';
  risksDetected: string[];
  safeAlternatives: string[];
  longTermSoilHealthImpact: string;
  waterSafetyNote: string;
}

export interface GlobalTransferResult {
  sourceRegion: string;
  targetRegion: string;
  originalTechnique: string;
  adaptationLogic: string;
  refinedStrategy: string;
  climateMatchScore: number;
  potentialImpact: string;
}

export interface ConsolidationResult {
  summary: string;
  conflictsResolved: number;
  outdatedArchived: number;
  accuracyBoost: number;
  refinedNodes: any[];
}

export interface HybridStrategy {
  traditionalWisdom: string;
  scientificValidation: string;
  combinedRecommendation: string;
  culturalNuance: string;
  localLanguageOutput: string;
}

export interface SimulationResult {
  steps: { phase: string, event: string, impact: string }[];
  yieldPercentage: number;
  soilHealthDelta: number;
  profitability: number;
  summary: string;
  recommendedStrategy: string;
}

export interface ApiKeyRecord {
  id: string;
  name: string;
  key: string;
  created: string;
  usage: number;
  status: 'active' | 'revoked';
}

export interface DiagnosisResult {
  name: string;
  plantName?: string;
  severity: 'low' | 'medium' | 'high';
  causeType: 'fungal' | 'bacterial' | 'pest' | 'nutrient' | 'viral' | 'unknown';
  causeDescription: string;
  treatmentOrganic: string;
  treatmentChemical: string;
  prevention: string;
  feedingAndCare?: string;
  urgency?: string;
  firstAid?: string;
  vetCall?: string;
  source?: string;
  safetyAudit?: SafetyAuditResult;
}

export interface AutomatedAgronomistResult {
  subject_type: "Crop" | "Livestock" | "Soil";
  subject_name: string;
  condition: "Healthy" | "Diseased" | "Pest Infested" | "Unknown";
  diagnosis: string;
  visual_symptoms: string[];
  severity: "Low" | "Medium" | "High";
  treatment_chemicals: string[];
  treatment_organic: string[];
}

export interface SoilResult {
  classification: string;
  deficiencies: string[];
  recommendedCrops: string[];
  fertilizerAdvice: string;
  compostAdvice: string;
  nearbyLabs?: { title: string, uri: string }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface WeatherIntelligence {
  plantingRecommendation: string;
  irrigationAdvice: string;
  pestRiskAlerts: string;
  harvestTiming: string;
  summary: string;
}

export interface RegionalData {
  region: string;
  crops: CropVariety[];
  livestock: LivestockBreed[];
}

export interface CropVariety {
  name: string;
  climatePerformance: string;
  needs: string;
  commonIssues: string[];
}

export interface LivestockBreed {
  name: string;
  suitability: string;
  productivity: string;
  vulnerabilities: string[];
}
