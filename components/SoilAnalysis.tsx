
import React, { useState } from 'react';
import { analyzeSoil, findNearbySoilLabs } from '../services/geminiService';
import { SoilResult } from '../types';

const SoilAnalysis: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [testData, setTestData] = useState({ ph: '', n: '', p: '', k: '', moisture: '', crop: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SoilResult | null>(null);
  const [nearbyLabs, setNearbyLabs] = useState<any[]>([]);

  const handleSubmit = async () => {
    setLoading(true);
    const context = `pH: ${testData.ph}, N: ${testData.n}, P: ${testData.p}, K: ${testData.k}, Moisture: ${testData.moisture}, Target Crop: ${testData.crop}`;
    try {
      const data = await analyzeSoil(image, context);
      setResult(data);
      
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const labs = await findNearbySoilLabs(pos.coords.latitude, pos.coords.longitude);
          setNearbyLabs(labs);
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <h3 className="text-2xl font-bold mb-6">Pedology Core</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <input type="text" placeholder="pH Level" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={testData.ph} onChange={e => setTestData({...testData, ph: e.target.value})} />
            <input type="text" placeholder="Target Crop" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={testData.crop} onChange={e => setTestData({...testData, crop: e.target.value})} />
          </div>
          <button onClick={handleSubmit} disabled={loading} className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl transition-all">
            {loading ? 'Analyzing Foundation Data...' : 'Generate Soil Report'}
          </button>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slideUp">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h4 className="text-2xl font-extrabold mb-6 text-slate-900">{result.classification}</h4>
            <p className="text-sm text-slate-600 mb-6">{result.fertilizerAdvice}</p>
            
            {nearbyLabs.length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Nearby Professional Labs</h5>
                <div className="space-y-3">
                  {nearbyLabs.map((lab, i) => (
                    <a key={i} href={lab.maps?.uri} target="_blank" className="block p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-all">
                      📍 {lab.maps?.title || 'Soil Testing Center'}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-emerald-950 text-white p-10 rounded-[2.5rem]">
             <h4 className="text-xl font-bold mb-4 text-emerald-400">Compost Strategy</h4>
             <p className="text-emerald-100/70 text-sm leading-relaxed">{result.compostAdvice}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoilAnalysis;
