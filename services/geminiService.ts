
import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosisResult, SoilResult, RegionalData, WeatherIntelligence, AutomatedAgronomistResult } from "../types";
import { LearningInteraction } from "./evolutionService";

const PRIVATE_GATEWAY_URL = "http://localhost:8080";

async function isPrivateBrainOnline(): Promise<boolean> {
  try {
    const res = await fetch(`${PRIVATE_GATEWAY_URL}/docs`, { method: 'HEAD', mode: 'no-cors' });
    return true; 
  } catch {
    return false;
  }
}

export const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * SOVEREIGN DISTILLER: Takes raw internet data (pasted text) and structures it 
 * into a private Knowledge Node. This removes reliance on external search tools.
 */
export async function distillRawWebData(rawText: string, topic: string): Promise<{ node: string, confidence: number }> {
  const ai = getAI();
  const prompt = `You are a Knowledge Distillation Engine. 
  Read this raw data from the internet about ${topic}:
  "${rawText}"
  
  Convert this into a structured JSON "Knowledge Node" for the AgriCore Sovereign Brain.
  Strictly follow this JSON schema:
  {
    "Core_Pattern": "Name of disease/condition",
    "severity": "low|medium|high",
    "Localized_Strategy": "Organic treatment or cultural management specific to the text",
    "chemical": "Recommended chemical active ingredients if mentioned",
    "Scientific_Verification": "Prevention tips and scientific cause"
  }
  
  Ensure the response is ONLY the JSON object.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });

  return { 
    node: response.text || "{}", 
    confidence: 0.98 
  };
}

/**
 * SELF-EVOLUTION TEACHER: Synthesizes feedback into new knowledge nodes.
 */
export async function evolveLocalBrain(interactions: LearningInteraction[]): Promise<string> {
  const ai = getAI();
  const prompt = `You are a Senior Agricultural Scientist Teacher. 
  Review the following user feedback and interactions from a private AI farm node.
  Synthesize this into NEW knowledge nodes for 'localIntelligence.ts'.
  
  DATA POOL: ${JSON.stringify(interactions)}
  
  OUTPUT REQUIREMENT: Return a JSON object representing new or updated logic nodes.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });

  return response.text || "{}";
}

export async function diagnoseCrop(
  imageB64: string, 
  cropInfo: string, 
  growthStage: string,
  environmentalContext: { soilType: string, weatherEvents: string },
  regionalContext?: RegionalData
): Promise<DiagnosisResult> {
  const privateOnline = await isPrivateBrainOnline();
  if (privateOnline) {
    try {
      const blob = await (await fetch(imageB64)).blob();
      const formData = new FormData();
      formData.append('file', blob, 'inference.jpg');
      formData.append('crop_type', cropInfo);
      formData.append('region', regionalContext?.region || 'Zimbabwe');
      const res = await fetch(`${PRIVATE_GATEWAY_URL}/v3/predict/crop`, {
        method: 'POST',
        headers: { 'X-API-Key': 'sk_live_sovereign_local_host' },
        body: formData
      });
      const privateData = await res.json();
      return {
        name: privateData.diagnosis,
        plantName: cropInfo,
        severity: "high",
        causeType: "unknown",
        causeDescription: `Private Inference. Region: ${privateData.region_context}`,
        treatmentOrganic: "Refer to ALIC local node.",
        treatmentChemical: "Refer to extension officer.",
        prevention: "Standard protocols apply."
      };
    } catch (e) { console.warn("Private Gateway failed."); }
  }

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: imageB64.split(',')[1], mimeType: 'image/jpeg' } },
        { text: `Diagnose ${cropInfo} at ${growthStage}.` }
      ]
    },
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || "{}");
}

export async function diagnoseLivestock(imageB64: string, symptoms: string, animalMeta: string): Promise<DiagnosisResult> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        ...(imageB64 ? [{ inlineData: { data: imageB64.split(',')[1], mimeType: 'image/jpeg' } }] : []),
        { text: `Vet Diagnosis: ${animalMeta}. Symptoms: ${symptoms}` }
      ]
    },
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || "{}");
}

export async function analyzeSoil(imageB64: string | null, testData: string): Promise<SoilResult> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        ...(imageB64 ? [{ inlineData: { data: imageB64.split(',')[1], mimeType: 'image/jpeg' } }] : []),
        { text: `Soil Analysis: ${testData}` }
      ]
    },
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || "{}");
}

export async function getWeatherAdvice(location: { lat: number; lng: number }, cropType: string): Promise<WeatherIntelligence> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Weather Intel for ${cropType} at ${location.lat}, ${location.lng}`,
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || "{}");
}

export async function automatedAgronomistInference(imageB64: string): Promise<AutomatedAgronomistResult> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: imageB64.split(',')[1], mimeType: 'image/jpeg' } },
        { text: `Create ML dataset from this image.` }
      ]
    },
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || "{}");
}

export async function generatePyTorchScript(numClasses: number): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Write PyTorch script for ${numClasses} classes.`,
  });
  return response.text || "";
}

export async function* generateSyntheticQA(topic: string) {
  const ai = getAI();
  const response = await ai.models.generateContentStream({
    model: 'gemini-3-pro-preview',
    contents: `Generate training QA for ${topic}`,
  });
  for await (const chunk of response) { yield chunk.text; }
}
