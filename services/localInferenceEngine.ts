
import { LOCAL_INTELLIGENCE_CORE } from './localIntelligence';
import { DiagnosisResult } from '../types';
import { EvolutionService } from './evolutionService';

/**
 * AGRICORE PRIVATE INFERENCE ENGINE
 * Performs logic locally by matching inputs against the high-density Sovereign Knowledge Graph.
 * Now prioritized: Checks the Sovereign Vault (Learned Data) first.
 */
export const performLocalInference = (
  type: 'crop' | 'livestock', 
  subject: string, 
  symptomKey: string
): DiagnosisResult => {
  const core = LOCAL_INTELLIGENCE_CORE.pathology_engine;
  const vault = EvolutionService.getVault();
  
  // Normalize subject for matching
  const subjectLower = (subject || "").toLowerCase();
  let categoryKey = 'maize';
  
  if (type === 'crop') {
    if (subjectLower.includes('tobacco')) categoryKey = 'tobacco';
    else if (subjectLower.includes('soy')) categoryKey = 'soybeans';
    else if (subjectLower.includes('wheat')) categoryKey = 'wheat';
    else if (subjectLower.includes('cotton')) categoryKey = 'cotton';
    else if (subjectLower.includes('sorghum') || subjectLower.includes('millet')) categoryKey = 'sorghum';
    else if (subjectLower.includes('tomato') || subjectLower.includes('onion')) categoryKey = 'tomato';
    else if (subjectLower.includes('potato')) categoryKey = 'potato';
    else if (subjectLower.includes('groundnut')) categoryKey = 'groundnuts';
    else categoryKey = 'maize';
  } else {
    if (subjectLower.includes('poultry') || subjectLower.includes('chicken') || subjectLower.includes('bird')) categoryKey = 'poultry';
    else if (subjectLower.includes('goat') || subjectLower.includes('sheep')) categoryKey = 'goats';
    else categoryKey = 'cattle';
  }

  // 1. Check the SOVEREIGN VAULT first (Data learned by the user)
  const learnedNode = vault.find(node => 
    node.topic.toLowerCase() === categoryKey && 
    (node.symptomKey === symptomKey || node.data.diagnosis.toLowerCase().includes(symptomKey.replace('_', ' ')))
  );

  if (learnedNode) {
    return {
      name: learnedNode.data.diagnosis,
      plantName: subject,
      severity: learnedNode.data.severity,
      causeType: "unknown",
      causeDescription: "Sovereign Ingestion: Distilled from user-provided research.",
      treatmentOrganic: learnedNode.data.organic,
      treatmentChemical: learnedNode.data.chemical,
      prevention: learnedNode.data.prevention,
      source: learnedNode.data.source
    };
  }
  
  // 2. Fallback to STATIC CORE
  const entry = (core as any)[categoryKey]?.symptoms[symptomKey];

  if (!entry) {
    return {
      name: "Complex Condition Detected",
      plantName: subject,
      severity: "medium",
      causeType: "unknown",
      causeDescription: "The local sovereign brain recommends physical scouting as patterns match multiple nodes.",
      treatmentOrganic: "Apply general sustainable boosters: Compost tea or wood ash.",
      treatmentChemical: "Refer to the national pesticide registrar.",
      prevention: "Strengthen the farm ecosystem via crop diversification."
    };
  }

  return {
    name: entry.diagnosis,
    plantName: subject,
    severity: entry.severity,
    causeType: "unknown",
    causeDescription: "Inferred from Static Sovereign Core (v7).",
    treatmentOrganic: entry.organic || entry.first_aid,
    treatmentChemical: entry.chemical || "Consult expert",
    prevention: entry.prevention || "Standard biosecurity",
    urgency: entry.urgency,
    firstAid: entry.first_aid,
    vetCall: entry.vet_call
  };
};
