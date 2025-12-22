
export type Section = 'dashboard' | 'crop' | 'livestock' | 'soil' | 'weather' | 'chat' | 'database' | 'ml-lab';

export interface DiagnosisResult {
  name: string;
  plantName?: string; // The identified plant species
  severity: 'low' | 'medium' | 'high';
  causeType: 'fungal' | 'bacterial' | 'pest' | 'nutrient' | 'viral' | 'unknown';
  causeDescription: string;
  treatmentOrganic: string;
  treatmentChemical: string;
  prevention: string; // Used for next season prevention
  feedingAndCare?: string; // Specific to livestock
  urgency?: string;
  firstAid?: string;
  vetCall?: string;
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
