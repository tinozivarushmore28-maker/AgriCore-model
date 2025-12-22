
import { ChatMessage, DiagnosisResult } from '../types';

export interface LearningInteraction {
  id: string;
  timestamp: number;
  input: string;
  modelOutput: any;
  userCorrection?: string;
  rating: number;
}

export interface SovereignKnowledgeNode {
  id: string;
  topic: string; // e.g. "maize"
  symptomKey: string; // e.g. "yellow_spots_2025"
  data: {
    diagnosis: string;
    severity: 'low' | 'medium' | 'high';
    organic: string;
    chemical: string;
    prevention: string;
    source?: string;
  };
  timestamp: number;
}

const STORAGE_KEY = 'agricore_evolution_pool';
const VAULT_KEY = 'agricore_sovereign_vault';

export const EvolutionService = {
  // Record an interaction for the model to "think about" later
  recordInteraction: (input: string, output: any, rating: number, correction?: string) => {
    const pool: LearningInteraction[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newInteraction: LearningInteraction = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      input,
      modelOutput: output,
      rating,
      userCorrection: correction
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...pool, newInteraction]));
  },

  // Commit synthesized knowledge to the permanent local vault
  commitToVault: (node: Omit<SovereignKnowledgeNode, 'id' | 'timestamp'>) => {
    const vault: SovereignKnowledgeNode[] = JSON.parse(localStorage.getItem(VAULT_KEY) || '[]');
    const newNode: SovereignKnowledgeNode = {
      ...node,
      id: `node_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };
    localStorage.setItem(VAULT_KEY, JSON.stringify([...vault, newNode]));
    return newNode;
  },

  getVault: (): SovereignKnowledgeNode[] => {
    return JSON.parse(localStorage.getItem(VAULT_KEY) || '[]');
  },

  getPool: (): LearningInteraction[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  },

  getGrowthStats: () => {
    const pool = EvolutionService.getPool();
    const vault = EvolutionService.getVault();
    const learnedNodes = pool.filter(i => i.rating > 3).length;
    const correctionNodes = pool.filter(i => i.userCorrection).length;
    return {
      synapses: 12500 + vault.length, // Base nodes + permanently committed nodes
      plasticity: (correctionNodes / (pool.length || 1)) * 100,
      totalInteractions: pool.length,
      vaultSize: vault.length
    };
  },

  clearPool: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  clearVault: () => {
    localStorage.removeItem(VAULT_KEY);
  }
};
