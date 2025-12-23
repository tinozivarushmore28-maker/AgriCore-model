
import React, { useState } from 'react';
import { synthesizeCulturalHybrid } from '../services/geminiService';
import { HybridStrategy, Language } from '../types';
import { EvolutionService } from '../services/evolutionService';

const CulturalLearningHub: React.FC = () => {
  const [practice, setPractice] = useState('');
  const [region, setRegion] = useState('Southern Africa (ZWE)');
  const [language, setLanguage] = useState<Language>('Shona');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HybridStrategy | null>(null);

  const languages: Language[] = ['English', 'Shona', 'Ndebele', 'Swahili', 'Yoruba', 'Hindi', 'Spanish', 'French'];

  const handleIntegrate = async () => {
    if (!practice.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const hybrid = await synthesizeCulturalHybrid(practice, region, language);
      setResult(hybrid);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const commitToVault = () => {
    if (!result) return;
    EvolutionService.commitToVault({
      topic: 'cultural_wisdom',
      symptomKey: `culture_${Date.now()}`,
      data: {
        diagnosis: `Cultural Integration: ${practice.substring(0, 30)}...`,
        severity: 'low',
        organic: result.combinedRecommendation,
        chemical: 'Cultural preference: Organic/Tradition',
        prevention: result.scientificValidation,
        cluster: region,
        climate: 'Mixed'
      }
    });
    alert("Wisdom Cluster stored in Sovereign Vault!");
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-10 animate-fadeIn">
      <div className="bg-[#4a3728] rounded-[4rem] p-10 md:p-16 text-[#fdf5e6] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-200 text-[10px] font-black uppercase tracking-[0.2em] border border-orange-500/30">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
              Traditional Knowledge Bridge
            </div>
            <h2 className="text-4xl md:text-6xl font-black leading-tight text-[#fdf5e6]">Cultural <br/><span className="text-orange-400">Intelligence</span></h2>
            <p className="text-orange-100/60 font-bold max-w-xl text-lg leading-relaxed">
              Farming is culture. AgriCore respects traditional wisdom by scientifically validating local practices and translating them back into indigenous languages.
            </p>
          </div>
          
          <div className="w-full lg:w-96 bg-black/20 p-8 rounded-[3rem] border border-white/10 space-y-4 backdrop-blur-md">
             <div className="space-y-4">
                <div>
                   <label className="text-[9px] font-black text-orange-200 uppercase tracking-widest block mb-2 px-1">Local Language</label>
                   <select 
                     value={language} 
                     onChange={e => setLanguage(e.target.value as Language)}
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-orange-500"
                   >
                     {languages.map(l => <option key={l} value={l} className="bg-slate-900">{l}</option>)}
                   </select>
                </div>
                <div>
                   <label className="text-[9px] font-black text-orange-200 uppercase tracking-widest block mb-2 px-1">Region Context</label>
                   <input 
                     type="text" 
                     value={region} 
                     onChange={e => setRegion(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-orange-500"
                   />
                </div>
                <div>
                   <label className="text-[9px] font-black text-orange-200 uppercase tracking-widest block mb-2 px-1">Traditional Practice</label>
                   <textarea 
                     value={practice}
                     onChange={e => setPractice(e.target.value)}
                     placeholder="e.g. Planting by the lunar cycle or using wood ash..."
                     className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-orange-500 resize-none"
                   />
                </div>
             </div>
             <button 
              onClick={handleIntegrate}
              disabled={loading}
              className="w-full py-5 bg-orange-600 hover:bg-orange-50 text-orange-950 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl transition-all"
             >
               {loading ? 'Consulting Elders & Science...' : 'Synthesize Hybrid'}
             </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 text-[180px] text-orange-500 opacity-[0.03] font-black pointer-events-none select-none">TRADITION</div>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-slideUp">
           <div className="lg:col-span-2 space-y-10">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
                 <div className="flex justify-between items-center mb-8">
                   <h3 className="text-xl font-black text-slate-800">Local Language Translation</h3>
                   <span className="text-[9px] font-black bg-orange-100 text-orange-700 px-3 py-1 rounded-full uppercase">{language} Active</span>
                 </div>
                 <div className="bg-[#fff9f0] p-8 rounded-[2.5rem] border border-orange-100 relative">
                    <span className="absolute -top-4 -left-4 text-4xl">🗣️</span>
                    <p className="text-xl font-bold text-orange-950 italic leading-relaxed text-center">
                      "{result.localLanguageOutput}"
                    </p>
                 </div>
                 <div className="mt-8 p-6 bg-slate-50 rounded-2xl">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cultural Nuance Report</h5>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{result.culturalNuance}</p>
                 </div>
              </div>

              <div className="bg-emerald-950 p-10 rounded-[3rem] text-white shadow-2xl border border-emerald-500/20">
                 <div className="flex justify-between items-start mb-10">
                    <div>
                       <h3 className="text-2xl font-black text-emerald-400">Integrated Hybrid Strategy</h3>
                       <p className="text-emerald-100/60 font-bold mt-1">Sovereign Protocol combining ancestral knowledge and modern biology.</p>
                    </div>
                    <button onClick={commitToVault} className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all">
                       Save to Vault
                    </button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <div>
                          <label className="text-[10px] font-black text-emerald-500 uppercase mb-2 block">Traditional Core</label>
                          <p className="text-sm font-medium leading-relaxed text-emerald-100/80">{result.traditionalWisdom}</p>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div>
                          <label className="text-[10px] font-black text-emerald-500 uppercase mb-2 block">Scientific Validation</label>
                          <p className="text-sm font-medium leading-relaxed text-emerald-100/80">{result.scientificValidation}</p>
                       </div>
                    </div>
                 </div>
                 <div className="mt-10 pt-10 border-t border-white/10">
                    <label className="text-[10px] font-black text-orange-400 uppercase mb-4 block tracking-widest">Master Protocol</label>
                    <p className="text-lg font-bold leading-relaxed">{result.combinedRecommendation}</p>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm text-center">
                 <div className="text-4xl mb-4">🏺</div>
                 <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Wisdom Preserved</h4>
                 <p className="text-[11px] text-slate-500 font-bold mt-4 italic">
                   "We do not overwrite the past. We illuminate it with data. Knowledge that works for centuries deserves scientific status."
                 </p>
              </div>

              <div className="bg-orange-600 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
                 <div className="relative z-10">
                    <h4 className="text-lg font-black mb-2">Multilingual Growth</h4>
                    <p className="text-xs font-bold text-orange-100 leading-relaxed">
                      AgriCore learns new agricultural terminologies in {language} as you input more traditional methods.
                    </p>
                    <div className="mt-4 flex gap-2">
                       <span className="text-[8px] bg-white/20 px-2 py-1 rounded">Dialect Aware</span>
                       <span className="text-[8px] bg-white/20 px-2 py-1 rounded">Culture Locked</span>
                    </div>
                 </div>
                 <div className="absolute -bottom-10 -right-10 text-8xl opacity-10 group-hover:rotate-12 transition-transform duration-700">🐘</div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CulturalLearningHub;
