
import React, { useState, useEffect } from 'react';
import { transferAndAdaptKnowledge } from '../services/geminiService';
import { EvolutionService, SovereignKnowledgeNode } from '../services/evolutionService';
import { GlobalTransferResult } from '../types';

const GlobalIntelligenceSharing: React.FC = () => {
  const [nodes, setNodes] = useState<SovereignKnowledgeNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [targetRegion, setTargetRegion] = useState('West Africa');
  const [targetClimate, setTargetClimate] = useState('Humid Tropical');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GlobalTransferResult | null>(null);

  useEffect(() => {
    setNodes(EvolutionService.getVault());
  }, []);

  const handleSync = async () => {
    const node = nodes.find(n => n.id === selectedNodeId);
    if (!node) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await transferAndAdaptKnowledge(
        node.data.organic,
        node.data.cluster || 'Unknown Source',
        targetRegion,
        targetClimate
      );
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const commitToTargetCluster = () => {
    if (!result) return;
    EvolutionService.commitToVault({
      topic: 'global_transfer',
      symptomKey: `transfer_${Date.now()}`,
      data: {
        diagnosis: `Global Sync: ${result.originalTechnique.substring(0, 30)}...`,
        severity: 'low',
        organic: result.refinedStrategy,
        chemical: 'Locally adapted',
        prevention: result.adaptationLogic,
        cluster: result.targetRegion,
        climate: targetClimate
      }
    });
    alert(`Adapted knowledge committed to ${result.targetRegion} cluster!`);
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-10 animate-fadeIn">
      <div className="bg-gradient-to-br from-blue-950 to-emerald-950 rounded-[4rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/30">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              Planetary Knowledge Mesh v2.0
            </div>
            <h2 className="text-4xl md:text-6xl font-black leading-tight text-white">Global <br/><span className="text-emerald-400">Sync Engine</span></h2>
            <p className="text-blue-100/60 font-bold max-w-xl text-lg leading-relaxed">
              When a technique succeeds in one region, AgriCore identifies similar climates elsewhere and adapts the protocol for local deployment.
            </p>
          </div>
          
          <div className="w-full lg:w-[400px] bg-white/5 p-8 rounded-[3rem] border border-white/10 space-y-5 backdrop-blur-md">
             <div className="space-y-4">
                <div>
                   <label className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-2 px-1">Source Success Node</label>
                   <select 
                     value={selectedNodeId} 
                     onChange={e => setSelectedNodeId(e.target.value)}
                     className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-emerald-500"
                   >
                     <option value="">Select Local Success...</option>
                     {nodes.map(n => <option key={n.id} value={n.id}>{n.data.diagnosis}</option>)}
                   </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-2 px-1">Target Region</label>
                    <input 
                      type="text" 
                      value={targetRegion} 
                      onChange={e => setTargetRegion(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-2 px-1">Target Climate</label>
                    <input 
                      type="text" 
                      value={targetClimate} 
                      onChange={e => setTargetClimate(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
             </div>
             <button 
              onClick={handleSync}
              disabled={loading || !selectedNodeId}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl transition-all disabled:opacity-30"
             >
               {loading ? 'Synthesizing Cross-Region Adaptations...' : 'Sync Global Intelligence'}
             </button>
          </div>
        </div>
        <div className="absolute top-0 left-0 p-8 text-[120px] text-emerald-500 opacity-[0.05] font-black pointer-events-none select-none">MESH</div>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-slideUp">
           <div className="lg:col-span-2 space-y-10">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
                 <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-black text-slate-800">Cross-Region Adaptation Logic</h3>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-emerald-600 uppercase">Match Score:</span>
                       <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${result.climateMatchScore}%` }}></div>
                       </div>
                       <span className="text-xs font-black text-slate-800">{result.climateMatchScore}%</span>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 relative">
                       <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Source Origin: {result.sourceRegion}</h5>
                       <p className="text-sm font-bold text-blue-900 leading-relaxed italic">"{result.originalTechnique}"</p>
                       <span className="absolute -top-4 -right-4 text-4xl grayscale opacity-20">🌍</span>
                    </div>
                    <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 relative">
                       <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Target Adaptation: {result.targetRegion}</h5>
                       <p className="text-sm font-bold text-emerald-900 leading-relaxed">"{result.refinedStrategy}"</p>
                       <span className="absolute -top-4 -right-4 text-4xl opacity-40">📍</span>
                    </div>
                 </div>

                 <div className="mt-10 p-8 bg-slate-900 rounded-[2.5rem] text-white">
                    <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 block">Refinement Rationale</label>
                    <p className="text-sm font-medium leading-relaxed opacity-80">{result.adaptationLogic}</p>
                 </div>
              </div>

              <div className="bg-emerald-950 p-10 rounded-[3rem] text-white shadow-2xl border border-emerald-500/20">
                 <div className="flex justify-between items-start mb-10">
                    <div>
                       <h3 className="text-2xl font-black text-emerald-400">Validated Global Protocol</h3>
                       <p className="text-emerald-100/60 font-bold mt-1">Sovereign intelligence transfer refined for local testing.</p>
                    </div>
                    <button onClick={commitToTargetCluster} className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all">
                       Deploy to Cluster
                    </button>
                 </div>
                 <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                    <h5 className="text-[10px] font-black text-emerald-500 uppercase mb-4 tracking-widest">Potential Yield Impact</h5>
                    <p className="text-2xl font-black">{result.potentialImpact}</p>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm text-center">
                 <div className="text-5xl mb-4">🛰️</div>
                 <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Planetary Learning</h4>
                 <p className="text-[11px] text-slate-500 font-bold mt-4 italic leading-relaxed">
                   "Agricultural breakthroughs shouldn't be trapped by geography. We mirror successes across the world's similar climate pockets."
                 </p>
              </div>

              <div className="bg-blue-600 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
                 <div className="relative z-10">
                    <h4 className="text-lg font-black mb-2">Cluster Mirroring</h4>
                    <p className="text-xs font-bold text-blue-100 leading-relaxed">
                      AgriCore automatically identifies that a successful soil pH fix in the Brazillian Cerrado might work for the Nigerian Savannah.
                    </p>
                    <div className="mt-4 flex gap-2">
                       <span className="text-[8px] bg-white/20 px-2 py-1 rounded">Climate Matching</span>
                       <span className="text-[8px] bg-white/20 px-2 py-1 rounded">Bio-Similar</span>
                    </div>
                 </div>
                 <div className="absolute -bottom-10 -right-10 text-9xl opacity-10 font-black">SYNC</div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default GlobalIntelligenceSharing;
