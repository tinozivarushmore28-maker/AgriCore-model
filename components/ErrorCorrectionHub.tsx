
import React, { useState, useEffect } from 'react';
import { EvolutionService, SovereignKnowledgeNode } from '../services/evolutionService';
import { performErrorCorrectionAnalysis } from '../services/geminiService';
import { FailureReason } from '../types';

const ErrorCorrectionHub: React.FC = () => {
  const [stats, setStats] = useState(EvolutionService.getGrowthStats());
  const [nodes, setNodes] = useState<SovereignKnowledgeNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<SovereignKnowledgeNode | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [correctionResult, setCorrectionResult] = useState('');
  const [failureReason, setFailureReason] = useState<FailureReason>('unknown');

  useEffect(() => {
    setNodes(EvolutionService.getVault().sort((a, b) => a.confidence - b.confidence));
  }, []);

  const handleRunCorrection = async () => {
    if (!selectedNode) return;
    setIsAnalyzing(true);
    setCorrectionResult('');
    try {
      const result = await performErrorCorrectionAnalysis(
        selectedNode.data.diagnosis,
        failureReason,
        "The previous treatment did not stop the spread. Yield loss occurred.",
        `Cluster: ${selectedNode.data.cluster || 'Global'}, Climate: ${selectedNode.data.climate || 'Default'}`
      );
      setCorrectionResult(result);
      // Automatically update the node with the new strategy
      EvolutionService.updateNodeWithCorrection(selectedNode.id, result.substring(0, 500), failureReason);
      setStats(EvolutionService.getGrowthStats());
      setNodes(EvolutionService.getVault().sort((a, b) => a.confidence - b.confidence));
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reasonIcons: Record<string, string> = {
    weather: '🌦️',
    soil: '🪨',
    timing: '⏱️',
    pests: '🐛',
    practice: '👨‍🌾',
    unknown: '❓'
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-10 animate-fadeIn">
      <div className="bg-red-950 rounded-[4rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-400/20 text-red-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-red-400/30">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Error-Correction Protocol Active
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Failure <br/><span className="text-red-400">Analysis Lab</span></h2>
            <p className="text-red-100/60 font-bold max-w-xl text-lg leading-relaxed">
              AgriCore evolves by detecting mistakes. We analyze failed outcomes to adjust future recommendations, reducing confidence in unreliable advice.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
             <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                <div className="text-3xl font-black mb-1">{stats.avgConfidence.toFixed(0)}%</div>
                <div className="text-[9px] font-black text-red-400 uppercase tracking-widest">Global Confidence</div>
             </div>
             <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                <div className="text-3xl font-black mb-1">{stats.plasticity.toFixed(1)}%</div>
                <div className="text-[9px] font-black text-red-400 uppercase tracking-widest">Error Plasticity</div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-2">Confidence Monitoring</h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto no-scrollbar pr-2">
                 {nodes.map(node => (
                   <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`w-full p-6 rounded-3xl border text-left transition-all ${selectedNode?.id === node.id ? 'bg-red-50 border-red-200 ring-2 ring-red-100' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}
                   >
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-black text-slate-800">{node.data.diagnosis}</span>
                        <span className={`text-[10px] font-black ${node.confidence < 0.5 ? 'text-red-500' : 'text-emerald-500'}`}>
                           {(node.confidence * 100).toFixed(0)}%
                        </span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
                        <div 
                          className={`h-full transition-all duration-1000 ${node.confidence < 0.5 ? 'bg-red-500' : 'bg-emerald-500'}`}
                          style={{ width: `${node.confidence * 100}%` }}
                        />
                     </div>
                     {node.correctionHistory.length > 0 && (
                       <div className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                          {node.correctionHistory.length} Manual Corrected
                       </div>
                     )}
                   </button>
                 ))}
                 {nodes.length === 0 && <p className="text-center text-slate-400 py-10 font-bold">No nodes in vault.</p>}
              </div>
           </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
           {selectedNode ? (
             <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm animate-slideUp">
                <div className="flex justify-between items-start mb-10">
                   <div>
                      <h3 className="text-2xl font-black text-slate-900">{selectedNode.data.diagnosis}</h3>
                      <p className="text-slate-500 font-bold">Identify why this recommendation failed in the field.</p>
                   </div>
                   <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center gap-3">
                      <span className="text-2xl animate-pulse">⚠️</span>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase leading-none">Status</span>
                        <span className="text-xs font-bold">Needs Refinement</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Failure Root Cause</label>
                      <div className="grid grid-cols-3 gap-3">
                         {(['weather', 'soil', 'timing', 'pests', 'practice', 'unknown'] as FailureReason[]).map(r => (
                           <button
                            key={r}
                            onClick={() => setFailureReason(r)}
                            className={`p-4 rounded-2xl border text-center transition-all ${failureReason === r ? 'bg-red-600 text-white border-red-700 shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                           >
                             <div className="text-xl mb-1">{reasonIcons[r]}</div>
                             <div className="text-[8px] font-black uppercase tracking-tighter">{r}</div>
                           </button>
                         ))}
                      </div>
                   </div>
                   <div className="flex flex-col justify-center">
                      <button
                        onClick={handleRunCorrection}
                        disabled={isAnalyzing}
                        className="w-full py-6 bg-red-600 text-white rounded-[2rem] font-black uppercase text-sm tracking-widest hover:bg-red-700 transition-all shadow-xl disabled:opacity-50"
                      >
                        {isAnalyzing ? 'Re-training Weights...' : 'Analyze & Evolve Strategy'}
                      </button>
                   </div>
                </div>

                {correctionResult && (
                  <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-red-500/20 text-white">
                     <h4 className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em] mb-6">Revised Sovereign Strategy</h4>
                     <div className="prose prose-invert prose-sm max-w-none font-medium leading-relaxed">
                        {correctionResult.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                     </div>
                  </div>
                )}
             </div>
           ) : (
             <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center flex flex-col items-center justify-center">
                <div className="text-6xl mb-6">🔬</div>
                <h4 className="text-xl font-black text-slate-800">Select a Node to Analyze</h4>
                <p className="text-slate-500 font-bold max-w-sm mt-2">AgriCore monitors confidence across your vault. Nodes with falling confidence need error-correction analysis.</p>
             </div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900 p-8 rounded-[3rem] text-white">
                 <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-6">Learning Distribution</h4>
                 <div className="space-y-4">
                    {Object.entries(stats.failureReasons).map(([reason, count]) => (
                      <div key={reason} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                         <span className="flex items-center gap-3">
                            <span>{reasonIcons[reason] || '❓'}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">{reason}</span>
                         </span>
                         <span className="text-sm font-black text-emerald-400">{count} Events</span>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="bg-white p-8 rounded-[3rem] border border-slate-200 flex flex-col items-center justify-center text-center">
                 <div className="text-5xl mb-4">🧠</div>
                 <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">Auto-Improvement</h4>
                 <p className="text-[11px] text-slate-500 font-bold italic">
                   "We learn more from failures than successes. Every corrected node increases the overall planetary model resilience."
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorCorrectionHub;
