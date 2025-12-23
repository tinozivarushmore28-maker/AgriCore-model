
import React, { useState } from 'react';
import { runFarmingSimulation } from '../services/geminiService';
import { SimulationResult } from '../types';
import { EvolutionService } from '../services/evolutionService';

const FarmingSimulation: React.FC = () => {
  const [params, setParams] = useState({
    crop: 'Maize',
    soil: 'Loamy',
    climate: 'Tropical Savannah',
    pests: 'Medium (Stemborers)',
    rainfall: 'Variable / Unpredictable'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleSimulate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await runFarmingSimulation(params);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const commitSimToVault = () => {
    if (!result) return;
    EvolutionService.commitToVault({
      topic: params.crop.toLowerCase(),
      symptomKey: `sim_success_${Date.now()}`,
      data: {
        diagnosis: `Simulation: ${params.crop} in ${params.climate}`,
        severity: 'low',
        organic: result.recommendedStrategy,
        chemical: 'Refer to sim results.',
        prevention: 'Maintain soil health via delta checks.',
        cluster: params.climate,
        climate: params.climate
      }
    });
    alert("Simulated strategy committed to Private Vault!");
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-10 animate-fadeIn">
      <div className="bg-slate-900 rounded-[3.5rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/30">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Farming Scenario Simulator v1.0
            </div>
            <h2 className="text-4xl md:text-6xl font-black leading-tight">Virtual <br/><span className="text-blue-400">Field Lab</span></h2>
            <p className="text-slate-400 font-bold max-w-xl text-lg leading-relaxed">
              Test agricultural strategies in high-fidelity virtual environments before field deployment. Learn from failures without risking actual yields.
            </p>
          </div>
          
          <div className="w-full lg:w-96 bg-white/5 p-8 rounded-[3rem] border border-white/10 space-y-4">
             <div className="space-y-4">
                {Object.entries(params).map(([key, val]) => (
                  <div key={key}>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">{key}</label>
                    <input 
                      type="text" 
                      value={val} 
                      onChange={e => setParams({...params, [key]: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
             </div>
             <button 
              onClick={handleSimulate}
              disabled={loading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl transition-all"
             >
               {loading ? 'Synthesizing Season...' : 'Run Simulation'}
             </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-slideUp">
           <div className="lg:col-span-2 space-y-10">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
                 <h3 className="text-xl font-black text-slate-800 mb-8">Season Timeline Analysis</h3>
                 <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    {result.steps.map((step, i) => (
                      <div key={i} className="pl-10 relative">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-4 border-blue-500 z-10"></div>
                        <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{step.phase}</div>
                        <h4 className="text-sm font-black text-slate-800 mb-1">{step.event}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.impact}</p>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-emerald-950 p-10 rounded-[3rem] text-white shadow-2xl border border-emerald-500/20">
                 <div className="flex justify-between items-start mb-10">
                    <div>
                       <h3 className="text-2xl font-black text-emerald-400">Validated Strategy</h3>
                       <p className="text-emerald-100/60 font-bold mt-1">This strategy performed optimally in the current sim.</p>
                    </div>
                    <button onClick={commitSimToVault} className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all">
                       Commit to Vault
                    </button>
                 </div>
                 <div className="prose prose-invert prose-sm max-w-none font-medium leading-relaxed">
                    {result.recommendedStrategy}
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm text-center">
                 <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Yield Performance</div>
                 <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-slate-100">
                    <span className="text-3xl font-black text-slate-800">{result.yieldPercentage}%</span>
                 </div>
                 <p className="text-[11px] text-slate-500 font-bold mt-4 italic">"{result.summary}"</p>
              </div>

              <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Soil Health Impact</span>
                    <span className={`text-sm font-black ${result.soilHealthDelta > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                       {result.soilHealthDelta > 0 ? '+' : ''}{result.soilHealthDelta} Delta
                    </span>
                 </div>
                 <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${result.soilHealthDelta > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.abs(result.soilHealthDelta) * 10}%` }}
                    />
                 </div>
              </div>

              <div className="bg-blue-600 p-8 rounded-[3rem] text-white shadow-xl">
                 <div className="text-4xl mb-4">💰</div>
                 <h4 className="text-lg font-black mb-2">Profitability Projection</h4>
                 <p className="text-2xl font-black">${result.profitability.toLocaleString()}</p>
                 <p className="text-[10px] text-blue-100/70 font-bold mt-2 uppercase tracking-widest">Projected Net ROI</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default FarmingSimulation;
