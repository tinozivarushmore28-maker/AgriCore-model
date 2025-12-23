
import { ChatMessage, DiagnosisResult, FarmingPhase, FailureReason } from '../types';

export interface LearningInteraction {
  id: string;
  timestamp: number;
  input: string;
  modelOutput: any;
  userCorrection?: string;
  rating: number;
  phase: FarmingPhase;
  failureReason?: FailureReason;
}

export interface SovereignKnowledgeNode {
  id: string;
  topic: string; // e.g. "maize"
  symptomKey: string; // e.g. "yellow_spots_2025"
  confidence: number; // 0 to 1
  correctionHistory: { timestamp: number, reason: FailureReason, fix: string }[];
  data: {
    diagnosis: string;
    severity: 'low' | 'medium' | 'high';
    organic: string;
    chemical: string;
    prevention: string;
    source?: string;
    cluster?: string; // Regional Cluster
    climate?: string; // Climate Profile
  };
  timestamp: number;
}

const STORAGE_KEY = 'agricore_evolution_pool';
const VAULT_KEY = 'agricore_sovereign_vault';

export const getCurrentPhase = (): FarmingPhase => {
  const month = new Date().getMonth();
  if (month >= 9 && month <= 11) return 'Planting';
  if (month >= 0 && month <= 2) return 'Growth';
  if (month >= 3 && month <= 5) return 'Harvest';
  if (month >= 6 && month <= 8) return 'Post-Harvest';
  return 'Fallow';
};

export const EvolutionService = {
  recordInteraction: (input: string, output: any, rating: number, correction?: string, failureReason?: FailureReason) => {
    const pool: LearningInteraction[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newInteraction: LearningInteraction = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      input,
      modelOutput: output,
      rating,
      userCorrection: correction,
      phase: getCurrentPhase(),
      failureReason
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...pool, newInteraction]));

    if (rating <= 2 || rating === 5) {
      EvolutionService.adjustConfidenceHeuristically(input, rating);
    }
  },

  adjustConfidenceHeuristically: (input: string, rating: number) => {
    const vault = EvolutionService.getVault();
    const updatedVault = vault.map(node => {
      if (input.toLowerCase().includes(node.topic.toLowerCase())) {
        const adjustment = rating === 5 ? 0.05 : -0.15;
        return { ...node, confidence: Math.max(0, Math.min(1, node.confidence + adjustment)) };
      }
      return node;
    });
    localStorage.setItem(VAULT_KEY, JSON.stringify(updatedVault));
  },

  commitToVault: (node: Omit<SovereignKnowledgeNode, 'id' | 'timestamp' | 'confidence' | 'correctionHistory'>) => {
    const vault: SovereignKnowledgeNode[] = JSON.parse(localStorage.getItem(VAULT_KEY) || '[]');
    const newNode: SovereignKnowledgeNode = {
      ...node,
      id: `node_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      confidence: 0.85,
      correctionHistory: []
    };
    localStorage.setItem(VAULT_KEY, JSON.stringify([...vault, newNode]));
    return newNode;
  },

  overwriteVault: (nodes: SovereignKnowledgeNode[]) => {
    localStorage.setItem(VAULT_KEY, JSON.stringify(nodes));
  },

  updateNodeWithCorrection: (id: string, newStrategy: string, reason: FailureReason) => {
    const vault = EvolutionService.getVault();
    const updated = vault.map(node => {
      if (node.id === id) {
        return {
          ...node,
          confidence: Math.min(node.confidence + 0.1, 1),
          correctionHistory: [...node.correctionHistory, { timestamp: Date.now(), reason, fix: newStrategy }],
          data: { ...node.data, organic: newStrategy }
        };
      }
      return node;
    });
    localStorage.setItem(VAULT_KEY, JSON.stringify(updated));
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
    const failures = pool.filter(i => i.rating <= 2);
    
    const reasonCounts = failures.reduce((acc, curr) => {
      const r = curr.failureReason || 'unknown';
      acc[r] = (acc[r] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const phases: FarmingPhase[] = ['Planting', 'Growth', 'Harvest', 'Post-Harvest'];
    const phaseSuccess = phases.map(p => {
      const pInteractions = pool.filter(i => i.phase === p);
      const avgRating = pInteractions.length > 0 
        ? pInteractions.reduce((acc, curr) => acc + curr.rating, 0) / pInteractions.length 
        : 0;
      return { phase: p, score: avgRating, count: pInteractions.length };
    });

    return {
      synapses: 12500 + vault.length,
      plasticity: (failures.length / (pool.length || 1)) * 100,
      totalInteractions: pool.length,
      vaultSize: vault.length,
      failureReasons: reasonCounts,
      avgConfidence: vault.length > 0 ? (vault.reduce((acc, n) => acc + n.confidence, 0) / vault.length) * 100 : 92,
      phaseSuccess
    };
  },

  clearPool: () => localStorage.removeItem(STORAGE_KEY),
  clearVault: () => localStorage.removeItem(VAULT_KEY)
};
