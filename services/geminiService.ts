
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { 
  DiagnosisResult, SoilResult, RegionalData, WeatherIntelligence, 
  AutomatedAgronomistResult, FailureReason, SimulationResult, 
  HybridStrategy, Language, ConsolidationResult, GlobalTransferResult,
  SafetyAuditResult
} from "../types";
import { LearningInteraction, SovereignKnowledgeNode } from "./evolutionService";

export const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * SAFETY AUDIT ENGINE: Evaluates agricultural advice for environmental responsibility.
 */
export async function performSafetyAudit(recommendation: string, context: string): Promise<SafetyAuditResult> {
  const ai = getAI();
  const prompt = `You are the AgriCore Safety & Sustainability Auditor.
  Review this agricultural recommendation: "${recommendation}"
  In the context of: "${context}"
  
  Tasks:
  1. Calculate a Safety Score (0-100) based on toxicity, soil degradation risk, and water contamination potential.
  2. Identify specific ecological risks (e.g. bee population harm, groundwater leaching).
  3. Propose safer, regenerative alternatives if risks are high.
  4. Predict long-term soil health impacts.
  
  Return ONLY JSON:
  {
    "safetyScore": number,
    "environmentalImpact": "low" | "medium" | "high",
    "risksDetected": ["string"],
    "safeAlternatives": ["string"],
    "longTermSoilHealthImpact": "string",
    "waterSafetyNote": "string"
  }`;

  const response = await ai.models.generateContent({
    // Using gemini-3-pro-preview for complex reasoning and structured JSON output
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 2000 }
    }
  });

  return JSON.parse(response.text || "{}");
}

/**
 * GLOBAL KNOWLEDGE TRANSFER: Adapts a successful technique from one region to another.
 */
export async function transferAndAdaptKnowledge(
  technique: string,
  sourceRegion: string,
  targetRegion: string,
  targetClimate: string
): Promise<GlobalTransferResult> {
  const ai = getAI();
  const prompt = `You are the AgriCore Global Knowledge Transfer Engine. 
  Adapt this technique: "${technique}" from ${sourceRegion} to ${targetRegion} (Climate: ${targetClimate}).
  Ensure the technique is adapted for sustainable and responsible application.
  Return a JSON object with: sourceRegion, targetRegion, originalTechnique, adaptationLogic, refinedStrategy, climateMatchScore (0-100), potentialImpact.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });

  return JSON.parse(response.text || "{}");
}

/**
 * LONG-TERM MEMORY CONSOLIDATION
 */
export async function consolidateKnowledgeVault(nodes: SovereignKnowledgeNode[]): Promise<ConsolidationResult> {
  const ai = getAI();
  const prompt = `You are the AgriCore Memory Architect. Review these ${nodes.length} nodes: ${JSON.stringify(nodes)}. 
  Prioritize knowledge that promotes soil health and biodiversity. Resolve conflicts and archive outdated nodes.
  Return JSON: { "summary": string, "conflictsResolved": number, "outdatedArchived": number, "accuracyBoost": number, "refinedNodes": array }`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || "{}");
}

/**
 * CULTURAL WISDOM SYNTHESIS
 */
export async function synthesizeCulturalHybrid(practice: string, region: string, lang: Language): Promise<HybridStrategy> {
  const ai = getAI();
  const prompt = `Bridge traditional wisdom and science for "${practice}" in ${region}. Focus on ecological preservation. 
  Provide translation and explanation in ${lang}.
  Return JSON: { "traditionalWisdom": string, "scientificValidation": string, "combinedRecommendation": string, "culturalNuance": string, "localLanguageOutput": string }`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || "{}");
}

/**
 * FARMING SCENARIO SIMULATION
 */
export async function runFarmingSimulation(params: any): Promise<SimulationResult> {
  const ai = getAI();
  const prompt = `Model farming season: ${JSON.stringify(params)}. Include an ecological footprint analysis. 
  Return JSON: { "steps": [{ "phase": string, "event": string, "impact": string }], "yieldPercentage": number, "soilHealthDelta": number, "profitability": number, "summary": string, "recommendedStrategy": string }`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || "{}");
}

/**
 * ERROR CORRECTION ANALYSIS: Analyzes failures and provides regenerative corrections.
 */
export async function performErrorCorrectionAnalysis(diag: string, reason: string, feedback: string, env: string): Promise<string> {
  const ai = getAI();
  const prompt = `Analyze failure of "${diag}" due to ${reason}. Feedback: "${feedback}". Context: ${env}. 
  Provide a corrected, regenerative strategy for the farmer.`;
  const response = await ai.models.generateContent({ 
    model: 'gemini-3-pro-preview', 
    contents: prompt,
    config: { thinkingConfig: { thinkingBudget: 4000 } }
  });
  return response.text || "";
}

/**
 * CROP DIAGNOSIS: Identifies diseases and provides sustainable treatments using image and text.
 */
export async function diagnoseCrop(img: string, info: string, stage: string, env: any, reg: any): Promise<DiagnosisResult> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { 
      parts: [
        { inlineData: { data: img.split(',')[1], mimeType: 'image/jpeg' } }, 
        { text: `Diagnose crop ${info} at stage ${stage}. Region data: ${JSON.stringify(reg)}. 
        Provide JSON with: name, severity, causeType, causeDescription, treatmentOrganic, treatmentChemical, prevention.` }
      ] 
    },
    config: { responseMimeType: "application/json" }
  });
  const diag = JSON.parse(response.text || "{}");
  // Auto-audit chemical recommendations if present
  if (diag.treatmentChemical && diag.treatmentChemical !== "None") {
    diag.safetyAudit = await performSafetyAudit(diag.treatmentChemical, info);
  }
  return diag;
}

/**
 * LIVESTOCK DIAGNOSIS: Provides veterinary analysis prioritizing welfare.
 */
export async function diagnoseLivestock(img: string, sym: string, meta: string): Promise<DiagnosisResult> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts: [ ...(img ? [{ inlineData: { data: img.split(',')[1], mimeType: 'image/jpeg' } }] : []), { text: `Vet diagnostic for ${meta}. Symptoms: ${sym}. Prioritize animal welfare and antibiotic stewardship. Return ONLY JSON.` }] },
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || "{}");
}

/**
 * WEATHER INTELLIGENCE: Fetches real-time weather advice using search grounding.
 */
export async function getRealtimeWeather(loc: { lat: number, lng: number }, crop: string) {
  const ai = getAI();
  const res = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Provide real-time weather-aware agricultural advice for ${crop} at latitude ${loc.lat}, longitude ${loc.lng}. Consider recent weather events and provide grounded irrigation and planting recommendations.`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return { text: res.text || "", sources: res.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
}

/**
 * HEALTHY CROP REFERENCE: Generates an image of a healthy plant for comparison.
 */
export async function generateHealthyCropReference(crop: string): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `A photorealistic, clear, and bright image of a perfectly healthy ${crop} plant growing in ideal soil conditions, demonstrating vibrant foliage and healthy growth patterns.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });
  
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated for healthy reference.");
}

/**
 * SEARCH-AUGMENTED LIVESTOCK DIAGNOSIS: Combines vision and search for current disease surveillance.
 */
export async function diagnoseLivestockWithSearch(img: string, sym: string, meta: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        ...(img ? [{ inlineData: { data: img.split(',')[1], mimeType: 'image/jpeg' } }] : []),
        { text: `Diagnose livestock issue: ${sym}. Context: ${meta}. Use Google Search to check for current regional outbreaks or veterinary alerts. Return a JSON diagnosis.` }
      ]
    },
    config: { tools: [{ googleSearch: {} }] }
  });
  
  // Extracting grounding info and text
  return {
    diagnosis: JSON.parse(response.text?.substring(response.text.indexOf('{'), response.text.lastIndexOf('}') + 1) || "{}"),
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
}

/**
 * SOIL ANALYSIS: Provides nutrient and management advice based on tests and images.
 */
export async function analyzeSoil(img: string | null, context: string): Promise<SoilResult> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        ...(img ? [{ inlineData: { data: img.split(',')[1], mimeType: 'image/jpeg' } }] : []),
        { text: `Analyze soil conditions: ${context}. Provide detailed NPK and pH advice. Return JSON with: classification, deficiencies (array), recommendedCrops (array), fertilizerAdvice, compostAdvice.` }
      ]
    },
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || "{}");
}

/**
 * MAPS LAB SEARCH: Finds nearby agricultural laboratories using Maps grounding.
 */
export async function findNearbySoilLabs(lat: number, lng: number): Promise<any[]> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Find professional soil testing laboratories and agricultural extension centers near my location.",
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng
          }
        }
      }
    }
  });
  return response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
}

/**
 * SEARCH-AUGMENTED RESEARCH: Performs deep web research for specific agricultural queries.
 */
export async function performSearchAugmentedResearch(query: string, region: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Research the following agricultural topic: "${query}" specifically for the region of ${region}. Provide the latest findings, trends, and evidence-based practices using search grounding.`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return {
    text: response.text || "",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
}

/**
 * AGRI-VISION ANALYSIS: Deep technical analysis of agricultural images.
 */
export async function automatedAgronomistInference(img: string): Promise<AutomatedAgronomistResult> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: img.split(',')[1], mimeType: 'image/jpeg' } },
        { text: "Perform a comprehensive technical agricultural inspection. Determine if the subject is a Crop, Livestock, or Soil. Identify condition, diagnosis, symptoms, and treatments. Return JSON." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subject_type: { type: Type.STRING },
          subject_name: { type: Type.STRING },
          condition: { type: Type.STRING },
          diagnosis: { type: Type.STRING },
          visual_symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
          severity: { type: Type.STRING },
          treatment_chemicals: { type: Type.ARRAY, items: { type: Type.STRING } },
          treatment_organic: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["subject_type", "subject_name", "condition", "diagnosis", "visual_symptoms", "severity", "treatment_chemicals", "treatment_organic"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
}

/**
 * SYNTHETIC QA GENERATION: Streams technical Q&A pairs for model training.
 */
export async function* generateSyntheticQA(topic: string) {
  const ai = getAI();
  const stream = await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: `Generate a sequence of high-fidelity agricultural Q&A pairs for training a localized expert model on the topic of ${topic}.`,
  });
  for await (const chunk of stream) {
    yield chunk.text;
  }
}

/**
 * PYTORCH SCRIPT GENERATION: Generates ML code for agricultural classification.
 */
export async function generatePyTorchScript(numClasses: number): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Write a robust PyTorch training script for an agricultural image classifier with ${numClasses} classes. Include data augmentation and a standard ResNet architecture.`,
    config: { thinkingConfig: { thinkingBudget: 4000 } }
  });
  return response.text || "";
}

/**
 * MODEL SELF-REFLECTION: Analyzes interaction history to identifying systemic errors.
 */
export async function performSelfReflection(pool: LearningInteraction[]): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Review the following interaction pool and identifying patterns of failure or knowledge gaps in the current agricultural model: ${JSON.stringify(pool)}. Provide a strategic reflection report for retraining.`,
    config: { thinkingConfig: { thinkingBudget: 4000 } }
  });
  return response.text || "";
}

/**
 * RAW WEB DATA DISTILLATION: Transforms messy internet text into clean knowledge nodes.
 */
export async function distillRawWebData(text: string, topic: string, region: string, climate: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Distill this unstructured web data: "${text}" regarding ${topic} for ${region} (${climate}). 
    Format the output as a JSON knowledge node with fields: Core_Pattern, Localized_Strategy, Scientific_Verification, Regional_Cluster, Climate_Profile.`,
    config: { responseMimeType: "application/json" }
  });
  return {
    node: response.text || "{}",
    confidence: 0.95
  };
}

/**
 * LIVE FIELD LINK: Connects to the Live API for real-time voice and audio assistance.
 */
export async function connectToFieldLive(callbacks: any) {
  const ai = getAI();
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks: callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: 'You are an expert real-time field agronomist. Listen to the farmer and provide immediate, practical advice.',
      outputAudioTranscription: {},
      inputAudioTranscription: {}
    }
  });
}

/**
 * SEASONAL INTELLIGENCE SYNTHESIS: Analyzes seasonal data to provide strategic reports.
 */
export async function synthesizeSeasonalIntelligence(pool: LearningInteraction[], region: string): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Based on the provided seasonal interaction history from ${region}: ${JSON.stringify(pool)}, synthesize a strategic intelligence report for future crop planning and climate adaptation.`,
    config: { thinkingConfig: { thinkingBudget: 4000 } }
  });
  return response.text || "";
}
