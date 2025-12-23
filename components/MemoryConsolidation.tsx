
import React, { useState, useEffect } from 'react';
import { EvolutionService, SovereignKnowledgeNode } from '../services/evolutionService';
import { consolidateKnowledgeVault } from '../services/geminiService';
import { ConsolidationResult } from '../types';

const MemoryConsolidation: React.FC = () => {
  const [nodes, setNodes] = useState<SovereignKnowledgeNode[]>([]);
  const [isConsolidating, setIsConsolidating] = useState(false);
  const [result, setResult] = useState<ConsolidationResult | null>(null);

  useEffect(() => {
    setNodes(EvolutionService.getVault());
  }, []);

  const handleConsolidate = async () => {
    if (nodes.length === 0) return;
    setIsConsolidating(true);
    setResult(null);
    try {
      const data = await consolidateKnowledgeVault(nodes);
      setResult(data);
      // Overwrite the vault with refined nodes
      EvolutionService.overwriteVault(data.refinedNodes);
      setNodes(data.refinedNodes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsConsolidating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-10 animate-fadeIn">
      <div className="bg-indigo-950 rounded-[4rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-500/30">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              Long-Term Memory Consolidation
            </div>
            <h2 className="text-4xl md:text-6xl font-black leading-tight text-white">Neural <br/><span className="text-indigo-400">Archiving</span></h2>
            <p className="text-indigo-100/60 font-bold max-w-xl text-lg leading-relaxed">
              AgriCore periodic maintenance. We summarize learned insights, resolve conflicting knowledge, and archive the outdated to maintain peak accuracy.
            </p>
          </div>
          
          <div className="w-full lg:w-96 bg-white/5 p-8 rounded-[3rem] border border-white/10 space-y-4 backdrop-blur-md text-center">
             <div className="text-5xl mb-4">🧠</div>
             <h4 className="text-xl font-black mb-2">Vault Health</h4>
             <p className="text-3xl font-black text-indigo-400">{nodes.length} Nodes</p>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Active in Sovereign Memory</p>
             <button 
              onClick={handleConsolidate}
              disabled={isConsolidating || nodes.length === 0}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl transition-all mt-6 disabled:opacity-30"
             >
               {isConsolidating ? 'Consolidating Synapses...' : 'Execute Consolidation'}
             </button>
          </div>
        </div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-slideUp">
           <div className="lg:col-span-2 space-y-10">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
                 <h3 className="text-xl font-black text-slate-800 mb-8">Consolidation Summary</h3>
                 <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 relative">
                    <p className="text-lg font-bold text-indigo-950 italic leading-relaxed">
                      "{result.summary}"
                    </p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                       <div className="text-2xl font-black text-emerald-600">+{result.accuracyBoost}%</div>
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Accuracy Delta</div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                       <div className="text-2xl font-black text-blue-600">{result.conflictsResolved}</div>
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Conflicts Resolved</div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                       <div className="text-2xl font-black text-red-600">{result.outdatedArchived}</div>
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nodes Archived</div>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
                 <h3 className="text-xl font-black mb-8 text-indigo-400">Refined Knowledge Vault</h3>
                 <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-4">
                    {result.refinedNodes.map((node, i) => (
                      <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10 group hover:border-indigo-500/30 transition-all">
                         <div className="flex justify-between items-start mb-2">
                           <h4 className="text-sm font-black text-white">{node.data.diagnosis}</h4>
                           <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Confidence: {(node.confidence * 100).toFixed(0)}%</span>
                         </div>
                         <p className="text-[11px] text-slate-400 leading-relaxed">{node.data.organic}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm text-center">
                 <div className="text-5xl mb-4">🧹</div>
                 <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Accuracy Over Volume</h4>
                 <p className="text-[11px] text-slate-500 font-bold mt-4 italic leading-relaxed">
                   "A model that remembers everything but understands nothing is useless. We prune the weak synapses to strengthen the core logic."
                 </p>
              </div>

              <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                 <div className="relative z-10">
                    <h4 className="text-lg font-black mb-2">Self-Cleaning Loop</h4>
                    <p className="text-xs font-bold text-indigo-100 leading-relaxed">
                      This process ensures that your AgriCore instance doesn't suffer from 'knowledge drift' as your farm evolves through different seasons and experiments.
                    </p>
                 </div>
                 <div className="absolute -bottom-10 -right-10 text-9xl opacity-10 font-black">AI</div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MemoryConsolidation;
