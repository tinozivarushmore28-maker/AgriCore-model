
import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosisResult, SoilResult, RegionalData, WeatherIntelligence, AutomatedAgronomistResult } from "../types";
import { CROP_PATHOLOGY_DB, LIVESTOCK_VET_DB, SOIL_PROFILES, GENERAL_FARMING_KNOWLEDGE, FINE_TUNING_DATA } from "./knowledgeBase";

/**
 * SYSTEM INSTRUCTION: Fully Fine-Tuned Foundation Model.
 */
const SYSTEM_INSTRUCTION = `You are the AgriCore Inference Engine, a Foundation Model fully fine-tuned on localized agricultural datasets.
GROUND TRUTH: You MUST prioritize the LOCAL_DATA provided in the prompt. This data is the result of your Step 4 Fine-Tuning phase.

LOCAL_DATA (Fine-Tuned Intelligence):
- REGIONAL_FINE_TUNING: ${JSON.stringify(FINE_TUNING_DATA)}
- GENERAL_FARMING_KNOWLEDGE: ${JSON.stringify(GENERAL_FARMING_KNOWLEDGE)}
- CROP_PATHOLOGY: ${JSON.stringify(CROP_PATHOLOGY_DB)}
- LIVESTOCK_VETERINARY: ${JSON.stringify(LIVESTOCK_VET_DB)}
- SOIL_PROFILES: ${JSON.stringify(SOIL_PROFILES)}

Your task:
1. Act with "Localization Awareness". If the user mentions a region like Zimbabwe, use the SC-Series hybrids and Mashona-cattle specific knowledge from FINE_TUNING_DATA.
2. Use GENERAL_FARMING_KNOWLEDGE for strategy (IPM/Rotation).
3. Match symptoms to CROP_PATHOLOGY and LIVESTOCK_VETERINARY.
4. If a condition is localized (e.g., 'January Disease' in Southern Africa), use that terminology.
5. Provide professional, grounded, and concise advice.`;

export const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function automatedAgronomistInference(imageB64: string): Promise<AutomatedAgronomistResult> {
  const ai = getAI();
  const prompt = `Analyze this agricultural image strictly for the purpose of creating a machine learning training dataset. Return the response in this exact JSON format only:
  {
    "subject_type": "Crop" | "Livestock" | "Soil",
    "subject_name": "Name (e.g., Maize, Cow, Clay Soil)",
    "condition": "Healthy" | "Diseased" | "Pest Infested",
    "diagnosis": "Specific disease name (e.g., Maize Streak Virus)",
    "visual_symptoms": ["list", "key", "visual", "features"],
    "severity": "Low" | "Medium" | "High",
    "treatment_chemicals": ["chemical 1", "chemical 2"],
    "treatment_organic": ["organic method 1", "organic method 2"]
  }
  If the image is unclear, set condition to 'Unknown'. Do not add markdown or conversational text, just the JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: imageB64.split(',')[1], mimeType: 'image/jpeg' } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function diagnoseCrop(
  imageB64: string, 
  cropInfo: string, 
  growthStage: string,
  environmentalContext: { soilType: string, weatherEvents: string },
  regionalContext?: RegionalData
): Promise<DiagnosisResult> {
  const ai = getAI();
  const prompt = `INFERENCE TASK: Localized Diagnosis.
  USER_INPUT: ${cropInfo}, Stage: ${growthStage}.
  ENV: Soil ${environmentalContext.soilType}, Weather ${environmentalContext.weatherEvents}.
  ${regionalContext ? `REGION: ${regionalContext.region}` : ''}
  
  REQUIRED: Analyze the image and find the match in the Pathology Encyclopedia. 
  Apply REGIONAL_FINE_TUNING logic for variety-specific advice.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: imageB64.split(',')[1], mimeType: 'image/jpeg' } },
        { text: prompt }
      ]
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          plantName: { type: Type.STRING },
          name: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
          causeType: { type: Type.STRING, enum: ['fungal', 'bacterial', 'pest', 'nutrient', 'viral', 'unknown'] },
          causeDescription: { type: Type.STRING },
          treatmentOrganic: { type: Type.STRING },
          treatmentChemical: { type: Type.STRING },
          prevention: { type: Type.STRING }
        },
        required: ["plantName", "name", "severity", "causeType", "causeDescription", "treatmentOrganic", "treatmentChemical", "prevention"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
}

export async function generateHealthyPlantImage(plantName: string, growthStage: string): Promise<string> {
  const ai = getAI();
  const prompt = `Agricultural photograph of a perfectly healthy ${plantName} plant at ${growthStage} stage. Vibrant green. Professional farming photography. High quality.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Failed to generate healthy plant image");
}

export async function diagnoseLivestock(
  imageB64: string, 
  symptoms: string, 
  animalMeta: string,
  regionalContext?: RegionalData
): Promise<DiagnosisResult> {
  const ai = getAI();
  const prompt = `INFERENCE TASK: Localized Veterinary Intel.
  INPUT: ${animalMeta}. Symptoms: ${symptoms}.
  Use fine-tuned regional livestock data if applicable (e.g. Mashona or Boran cattle quirks).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        ...(imageB64 ? [{ inlineData: { data: imageB64.split(',')[1], mimeType: 'image/jpeg' } }] : []),
        { text: prompt }
      ]
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
          urgency: { type: Type.STRING },
          firstAid: { type: Type.STRING },
          vetCall: { type: Type.STRING },
          feedingAndCare: { type: Type.STRING },
          causeDescription: { type: Type.STRING },
          prevention: { type: Type.STRING },
          treatmentOrganic: { type: Type.STRING },
          treatmentChemical: { type: Type.STRING },
          causeType: { type: Type.STRING }
        },
        required: ["name", "urgency", "firstAid", "vetCall", "feedingAndCare", "prevention"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
}

export async function analyzeSoil(imageB64: string | null, testData: string): Promise<SoilResult> {
  const ai = getAI();
  const prompt = `INFERENCE TASK: Localized Soil Intelligence.
  INPUT: ${testData}.
  Apply regional fine-tuning for soil types (e.g. Vlei soils in ZWE, Lateritic in NGA).`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        ...(imageB64 ? [{ inlineData: { data: imageB64.split(',')[1], mimeType: 'image/jpeg' } }] : []),
        { text: prompt }
      ]
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          classification: { type: Type.STRING },
          deficiencies: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendedCrops: { type: Type.ARRAY, items: { type: Type.STRING } },
          fertilizerAdvice: { type: Type.STRING },
          compostAdvice: { type: Type.STRING }
        },
        required: ["classification", "deficiencies", "recommendedCrops", "fertilizerAdvice", "compostAdvice"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
}

export async function getWeatherAdvice(location: { lat: number; lng: number }, cropType: string): Promise<WeatherIntelligence> {
  const ai = getAI();
  const prompt = `Loc: ${location.lat}, ${location.lng}. Crop: ${cropType}. 
  Localized weather-aware farming intelligence using planetary datasets.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          plantingRecommendation: { type: Type.STRING },
          irrigationAdvice: { type: Type.STRING },
          pestRiskAlerts: { type: Type.STRING },
          harvestTiming: { type: Type.STRING },
          summary: { type: Type.STRING }
        },
        required: ["plantingRecommendation", "irrigationAdvice", "pestRiskAlerts", "harvestTiming", "summary"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
}
