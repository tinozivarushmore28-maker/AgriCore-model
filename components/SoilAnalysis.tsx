
import React, { useState } from 'react';
import { analyzeSoil } from '../services/geminiService';
import { SoilResult } from '../types';

const SoilAnalysis: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [testData, setTestData] = useState({ ph: '', n: '', p: '', k: '', moisture: '', crop: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SoilResult | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    const context = `pH: ${testData.ph}, N: ${testData.n}, P: ${testData.p}, K: ${testData.k}, Moisture: ${testData.moisture}, Target Crop: ${testData.crop}`;
    try {
      const data = await analyzeSoil(image, context);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <h3 className="text-2xl font-bold mb-6">Foundation Soil Core</h3>
        <p className="text-slate-500 mb-8 text-sm italic">Analyze soil texture and chemistry using ISRIC and FAO global databases.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-1">
             <div className={`
              border-2 border-dashed rounded-[2rem] h-full flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden min-h-[220px]
              ${image ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}
            `}>
              {image ? (
                <img src={image} className="w-full h-full object-cover" alt="Soil Texture" />
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-6 text-center">
                  <span className="text-4xl mb-4">🏜️</span>
                  <span className="text-xs font-bold text-slate-500 tracking-wide uppercase">Snap Soil Texture</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const r = new FileReader();
                      r.onloadend = () => setImage(r.result as string);
                      r.readAsDataURL(file);
                    }
                  }} />
                </label>
              )}
            </div>
          </div>
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">pH Level</label>
                <input type="text" placeholder="e.g. 6.5" className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                  value={testData.ph} onChange={e => setTestData({...testData, ph: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Moisture %</label>
                <input type="text" placeholder="e.g. 20" className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  value={testData.moisture} onChange={e => setTestData({...testData, moisture: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">N-P-K Values</label>
                <input type="text" placeholder="e.g. 20-10-10" className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  value={testData.n} onChange={e => setTestData({...testData, n: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Target Crop</label>
                <input type="text" placeholder="e.g. Maize" className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  value={testData.crop} onChange={e => setTestData({...testData, crop: e.target.value})} />
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-100 transition-all disabled:opacity-50"
            >
              {loading ? 'Synthesizing Soil Records...' : 'Generate Foundation Soil Report'}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slideUp">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col h-full">
            <h4 className="text-2xl font-extrabold mb-8 text-slate-900 flex items-center gap-3">
              <span className="p-3 bg-emerald-100 rounded-2xl text-2xl">⛰️</span> {result.classification}
            </h4>
            
            <div className="space-y-10 flex-1">
              <div>
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Nutrient Deficiency Matrix</h5>
                <div className="flex flex-wrap gap-2">
                  {result.deficiencies.map((d, i) => (
                    <span key={i} className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-extrabold">{d}</span>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Planetary Matching Crops</h5>
                <div className="grid grid-cols-1 gap-3">
                  {result.recommendedCrops.map((c, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 transition-transform hover:translate-x-1">
                      <span className="text-2xl">🌱</span>
                      <span className="text-sm font-bold text-emerald-900">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-emerald-950 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-3 text-emerald-400">
                  <span>🧪</span> Precision Fertilizer Plan
                </h4>
                <p className="text-emerald-100/70 leading-relaxed text-[15px] whitespace-pre-line">{result.fertilizerAdvice}</p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
            </div>
            
            <div className="bg-white p-10 rounded-[2.5rem] border-2 border-emerald-100 shadow-sm">
              <h4 className="text-xl font-bold mb-4 flex items-center gap-3 text-emerald-800">
                <span>🌳</span> Sustainable Compost Strategy
              </h4>
              <p className="text-slate-600 leading-relaxed text-[15px] whitespace-pre-line">{result.compostAdvice}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoilAnalysis;
