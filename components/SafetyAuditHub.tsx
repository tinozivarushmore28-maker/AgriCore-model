
import React, { useState, useEffect } from 'react';
import { EvolutionService } from '../services/evolutionService';
import { performSafetyAudit } from '../services/geminiService';
import { SafetyAuditResult } from '../types';

const SafetyAuditHub: React.FC = () => {
  const [interactions, setInteractions] = useState(EvolutionService.getPool());
  const [selectedAudit, setSelectedAudit] = useState<SafetyAuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [ecoStats, setEcoStats] = useState({
    avgSafetyScore: 88,
    lowImpactAdvice: 0,
    chemicalReductions: 12
  });

  useEffect(() => {
    const pool = EvolutionService.getPool();
    const safetyInteractions = pool.filter(i => i.modelOutput?.safetyAudit);
    if (safetyInteractions.length > 0) {
      const avg = safetyInteractions.reduce((acc, curr) => acc + (curr.modelOutput.safetyAudit.safetyScore || 0), 0) / safetyInteractions.length;
      setEcoStats(prev => ({ ...prev, avgSafetyScore: Math.round(avg), lowImpactAdvice: safetyInteractions.length }));
    }
  }, []);

  const handleManualAudit = async (recommendation: string) => {
    setLoading(true);
    try {
      const result = await performSafetyAudit(recommendation, "Manual User Check");
      setSelectedAudit(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-10 animate-fadeIn">
      <div className="bg-emerald-950 rounded-[4rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden border border-emerald-500/20">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Responsible Farming Protocol v1
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Safety & <br/><span className="text-emerald-400">Trust Lab</span></h2>
            <p className="text-emerald-100/60 font-bold max-w-xl text-lg leading-relaxed">
              AgriCore audits every chemical and intensive recommendation. We prioritize long-term soil vitality and ecosystem health over short-term yields.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
             <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                <div className="text-3xl font-black mb-1">{ecoStats.avgSafetyScore}%</div>
                <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Trust Index</div>
             </div>
             <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                <div className="text-3xl font-black mb-1">{ecoStats.chemicalReductions}%</div>
                <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Toxicity Reduction</div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-2">Audited History</h3>
              <div className="space-y-4 max-h-[500px] overflow-y-auto no-scrollbar pr-2">
                 {interactions.filter(i => i.modelOutput?.safetyAudit).map(i => (
                   <button
                    key={i.id}
                    onClick={() => setSelectedAudit(i.modelOutput.safetyAudit)}
                    className="w-full p-6 rounded-3xl border border-slate-100 bg-slate-50 text-left hover:border-emerald-200 transition-all group"
                   >
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">{new Date(i.timestamp).toLocaleDateString()}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${i.modelOutput.safetyAudit.safetyScore > 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                           Score: {i.modelOutput.safetyAudit.safetyScore}
                        </span>
                     </div>
                     <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{i.input}</h4>
                   </button>
                 ))}
                 {interactions.length === 0 && <p className="text-center text-slate-400 py-10 font-bold">No safety logs found.</p>}
              </div>
           </div>

           <div className="bg-amber-50 p-8 rounded-[3rem] border border-amber-100">
              <h3 className="text-sm font-black text-amber-800 uppercase tracking-[0.2em] mb-6">Manual Safety Audit</h3>
              <p className="text-xs text-amber-700 font-bold mb-6 leading-relaxed">Have a specific pesticide or practice you want audited? AgriCore will evaluate its environmental footprint.</p>
              <textarea 
                placeholder="e.g. Glyphosate application on maize stalks..."
                className="w-full h-32 p-4 bg-white border border-amber-200 rounded-2xl text-xs font-medium outline-none focus:border-amber-500 mb-4 resize-none"
                onBlur={(e) => e.target.value && handleManualAudit(e.target.value)}
              />
              <div className="flex items-center gap-2 text-[9px] text-amber-600 font-black uppercase">
                 <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                 Safety Protocol v1.4 Active
              </div>
           </div>
        </div>

        <div className="lg:col-span-2">
           {selectedAudit ? (
             <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-xl animate-slideUp">
                <div className="flex justify-between items-start mb-10">
                   <div>
                      <h3 className="text-2xl font-black text-slate-900">Ecological Audit Report</h3>
                      <p className="text-slate-500 font-bold mt-1">Deep analysis of recommendation impact.</p>
                   </div>
                   <div className="flex flex-col items-end">
                      <div className={`text-4xl font-black ${selectedAudit.safetyScore > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{selectedAudit.safetyScore}</div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Safety Index</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                   <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                      <h5 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-4">Detected Risks</h5>
                      <ul className="space-y-2">
                         {selectedAudit.risksDetected.map((r, idx) => (
                           <li key={idx} className="text-xs font-bold text-red-900 flex items-center gap-2">
                              <span className="w-1 h-1 bg-red-400 rounded-full"></span> {r}
                           </li>
                         ))}
                      </ul>
                   </div>
                   <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                      <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Safe Alternatives</h5>
                      <ul className="space-y-2">
                         {selectedAudit.safeAlternatives.map((s, idx) => (
                           <li key={idx} className="text-xs font-bold text-emerald-900 flex items-center gap-2">
                              <span className="w-1 h-1 bg-emerald-400 rounded-full"></span> {s}
                           </li>
                         ))}
                      </ul>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="p-8 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
                      <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">Long-term Soil Health Impact</h5>
                      <p className="text-sm font-medium leading-relaxed opacity-80">{selectedAudit.longTermSoilHealthImpact}</p>
                      <div className="absolute top-0 right-0 p-4 text-4xl opacity-10">🌱</div>
                   </div>
                   <div className="p-8 bg-blue-900 rounded-3xl text-white relative overflow-hidden">
                      <h5 className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-4">Water Catchment Note</h5>
                      <p className="text-sm font-medium leading-relaxed opacity-80">{selectedAudit.waterSafetyNote}</p>
                      <div className="absolute top-0 right-0 p-4 text-4xl opacity-10">💧</div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[4rem] h-full flex flex-col items-center justify-center text-center p-20">
                <div className="text-6xl mb-6">🛡️</div>
                <h4 className="text-xl font-black text-slate-800">Sovereign Safety Monitoring</h4>
                <p className="text-slate-500 font-bold max-w-sm mt-2">Select an audited interaction from your history or run a manual audit to see detailed impact reports.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default SafetyAuditHub;
