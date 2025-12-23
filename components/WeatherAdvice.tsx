
import React, { useState, useEffect } from 'react';
import { getRealtimeWeather } from '../services/geminiService';

const WeatherAdvice: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [cropType, setCropType] = useState('Maize');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<{ text: string, sources: any[] } | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }, (err) => {
        setLocation({ lat: -17.8248, lng: 31.0530 }); // Zimbabwe fallback
      });
    } else {
      setLocation({ lat: -17.8248, lng: 31.0530 });
    }
  }, []);

  const handleGetAdvice = async () => {
    if (!location) return;
    setLoading(true);
    setReport(null);
    try {
      const result = await getRealtimeWeather(location, cropType);
      setReport(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 space-y-10 animate-fadeIn">
      <div className="bg-white rounded-[3rem] p-8 md:p-14 border border-slate-200 shadow-sm overflow-hidden relative group">
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-14">
          <div className="flex-1 space-y-8">
            <div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">Weather-Aware Intelligence</h3>
              <p className="text-slate-500 font-bold mt-4 max-w-xl leading-relaxed">
                Aggregating real-time satellite telemetry and ground sensor arrays via Google Search grounding to predict precise farming windows.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-inner">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 block px-1">GPS Fixed</label>
                <div className="text-sm font-black text-slate-700 flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                  {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Locating...'}
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-inner">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 block px-1">Target Crop</label>
                <select 
                  className="w-full bg-transparent text-sm font-black text-slate-700 outline-none cursor-pointer"
                  value={cropType}
                  onChange={e => setCropType(e.target.value)}
                >
                  <option>Maize</option>
                  <option>Sorghum</option>
                  <option>Rice</option>
                  <option>Tobacco</option>
                  <option>Coffee</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGetAdvice}
              disabled={loading || !location}
              className={`
                w-full py-6 rounded-[2rem] font-black text-white transition-all text-lg shadow-2xl
                ${loading || !location ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}
              `}
            >
              {loading ? 'Consulting Global Weather Nodes...' : 'Generate Grounded Intel'}
            </button>
          </div>
          <div className="hidden lg:flex w-72 h-72 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full items-center justify-center text-8xl shadow-2xl border-8 border-white/20 relative">
            <span className="drop-shadow-lg">🌦️</span>
          </div>
        </div>
      </div>

      {report && (
        <div className="space-y-8 animate-slideUp">
          <div className="bg-blue-950 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
            <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.4em] mb-6">Meteorological Intelligence Summary</h4>
            <div className="text-blue-50 text-xl font-medium leading-relaxed max-w-4xl whitespace-pre-wrap">
              {report.text}
            </div>
            <div className="absolute -bottom-20 -right-20 w-[30rem] h-[30rem] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          </div>

          {report.sources.length > 0 && (
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Grounding Verification Sources</h5>
              <div className="flex flex-wrap gap-4">
                {report.sources.map((chunk, idx) => (
                  <a key={idx} href={chunk.web?.uri} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-50 hover:bg-emerald-50 text-emerald-700 border border-slate-200 rounded-xl text-[10px] font-bold transition-all">
                    {chunk.web?.title || 'Source'}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="bg-slate-900 p-8 rounded-[2.5rem] flex items-start gap-6 shadow-2xl">
             <span className="text-4xl">🌍</span>
             <div>
                <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-2">Planetary Data Integrity</h5>
                <p className="text-[13px] text-slate-300 font-bold leading-relaxed">
                  Weather intelligence is synthesized by cross-referencing real-time Google Search data with localized regional farming calendars.
                </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherAdvice;
