
import React, { useState, useEffect } from 'react';
import { EvolutionService, getCurrentPhase } from '../services/evolutionService';
import { synthesizeSeasonalIntelligence } from '../services/geminiService';
import { FarmingPhase } from '../types';

const SeasonalIntelligence: React.FC = () => {
  const [stats, setStats] = useState(EvolutionService.getGrowthStats());
  const [currentPhase] = useState<FarmingPhase>(getCurrentPhase());
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Southern Africa');

  useEffect(() => {
    setStats(EvolutionService.getGrowthStats());
  }, []);

  const handleSynthesize = async () => {
    setLoading(true);
    try {
      const pool = EvolutionService.getPool();
      const res = await synthesizeSeasonalIntelligence(pool, selectedRegion);
      setReport(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const phaseDetails = {
    'Planting': { icon: '🌱', color: 'emerald', desc: 'Focus on soil prep, variety selection, and sowing timing.' },
    'Growth': { icon: '🌿', color: 'blue', desc: 'Monitoring pests, nutrient levels, and irrigation.' },
    'Harvest': { icon: '🚜', color: 'amber', desc: 'Determining peak maturity and logistics.' },
    'Post-Harvest': { icon: '📦', color: 'purple', desc: 'Storage, value addition, and fallow prep.' },
    'Fallow': { icon: '💤', color: 'slate', desc: 'Soil rest and next season planning.' }
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-10 animate-fadeIn">
      <div className="bg-emerald-950 rounded-[4rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sovereign Seasonal Loop Active
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Seasonal <br/><span className="text-emerald-400">Intelligence</span></h2>
            <p className="text-emerald-100/60 font-bold max-w-xl text-lg leading-relaxed">
              AgriCore learns from every season. Tracking outcomes from planting to post-harvest allows us to dynamically shift calendars for climate resilience.
            </p>
          </div>
          
          <div className="w-full md:w-80 space-y-4">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
              <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 block">Current Phase</label>
              <div className="flex items-center gap-4">
                 <span className="text-4xl">{phaseDetails[currentPhase].icon}</span>
                 <div>
                    <span className="text-xl font-black">{currentPhase}</span>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">In-field telemetry active</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-xl font-black text-slate-800">Season-Over-Season Performance</h3>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Learned Accuracy Evolution</span>
            </div>
            
            <div className="space-y-8">
              {stats.phaseSuccess.map((p, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-end mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{(phaseDetails as any)[p.phase].icon}</span>
                      <span className="text-sm font-black text-slate-700">{p.phase}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-4">Sample Size: {p.count}</span>
                      <span className="text-lg font-black text-emerald-600">{((p.score / 5) * 100).toFixed(0)}% Reliable</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-1000"
                      style={{ width: `${(p.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                   <h3 className="text-xl font-black text-slate-800">Dynamic Calendar Synthesis</h3>
                   <p className="text-sm text-slate-500 font-bold mt-1">Updates based on local yield reports and timing successes.</p>
                </div>
                <button 
                  onClick={handleSynthesize}
                  disabled={loading}
                  className="px-8 py-4 bg-emerald-950 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-800 transition-all shadow-xl"
                >
                  {loading ? 'Synthesizing...' : 'Generate Season Report'}
                </button>
             </div>

             {report ? (
               <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 prose prose-slate max-w-none prose-sm font-medium leading-relaxed">
                  {report.split('\n').map((line, i) => <p key={i}>{line}</p>)}
               </div>
             ) : (
               <div className="p-20 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
                  <div className="text-5xl mb-6">📅</div>
                  <p className="text-slate-400 font-bold max-w-sm mx-auto">Click "Generate Season Report" to analyze past successes and adjust the planting calendar.</p>
               </div>
             )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl">
             <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-6">Phase Insights</h4>
             <div className="space-y-6">
                {Object.entries(phaseDetails).map(([key, detail]) => (
                  <div key={key} className={`p-6 rounded-2xl border transition-all ${currentPhase === key ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-white/5 border-white/5 opacity-40'}`}>
                    <div className="flex items-center gap-4 mb-2">
                       <span className="text-2xl">{detail.icon}</span>
                       <span className="font-black text-sm">{key}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-bold leading-relaxed">{detail.desc}</p>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="bg-blue-600 p-8 rounded-[3rem] text-white shadow-xl">
             <div className="text-4xl mb-4">📈</div>
             <h4 className="text-lg font-black mb-2">Long-term Evolution</h4>
             <p className="text-xs font-bold text-blue-100 leading-relaxed">
               As you use AgriCore, the model remembers which varieties thrived in specific heat/rain conditions. Over multiple years, this becomes your farm's unique AI signature.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalIntelligence;
