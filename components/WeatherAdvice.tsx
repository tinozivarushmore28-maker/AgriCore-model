
import React, { useState, useEffect } from 'react';
import { getWeatherAdvice } from '../services/geminiService';
import { WeatherIntelligence } from '../types';

const WeatherAdvice: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [cropType, setCropType] = useState('Maize');
  const [loading, setLoading] = useState(false);
  const [intelligence, setIntelligence] = useState<WeatherIntelligence | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }, (err) => {
        console.warn("Geolocation denied, using default (Zimbabwe - Southern Africa).");
        setLocation({ lat: -17.8248, lng: 31.0530 });
      });
    } else {
      setLocation({ lat: -17.8248, lng: 31.0530 });
    }
  }, []);

  const handleGetAdvice = async () => {
    if (!location) return;
    setLoading(true);
    try {
      const result = await getWeatherAdvice(location, cropType);
      setIntelligence(result);
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
                Aggregating satellite imagery, public meteorological sensor arrays, and historical climate datasets to predict precision farming schedules.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-inner">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 block px-1">Neural GPS Lock</label>
                <div className="text-sm font-black text-slate-700 flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                  {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Sourcing Coordinates...'}
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-inner">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 block px-1">Target Entity</label>
                <select 
                  className="w-full bg-transparent text-sm font-black text-slate-700 outline-none cursor-pointer"
                  value={cropType}
                  onChange={e => setCropType(e.target.value)}
                >
                  <optgroup label="Core Foundation Crops">
                    <option>Maize</option>
                    <option>Sorghum</option>
                    <option>Rice</option>
                    <option>Soybeans</option>
                    <option>Cassava</option>
                  </optgroup>
                  <optgroup label="Foundation Livestock">
                    <option>Beef Cattle</option>
                    <option>Dairy Cattle</option>
                    <option>Poultry</option>
                    <option>Goats</option>
                  </optgroup>
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
              {loading ? 'Synthesizing Planetary Outlook...' : 'Generate Foundation Intel'}
            </button>
          </div>
          <div className="hidden lg:flex w-72 h-72 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full items-center justify-center text-8xl shadow-2xl border-8 border-white/20 relative group-hover:scale-105 transition-transform duration-700">
            <span className="drop-shadow-lg">🌦️</span>
            <div className="absolute inset-0 border-4 border-dashed border-white/30 rounded-full animate-[spin_30s_linear_infinite]"></div>
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-3xl font-black text-blue-600">
               100%
            </div>
          </div>
        </div>
      </div>

      {intelligence && (
        <div className="space-y-8 animate-slideUp">
          <div className="bg-blue-950 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
            <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.4em] mb-6">Meteorological Core Summary</h4>
            <p className="text-blue-50 text-2xl md:text-3xl font-black leading-tight italic max-w-4xl">
              "{intelligence.summary}"
            </p>
            <div className="absolute -bottom-20 -right-20 w-[30rem] h-[30rem] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col hover:border-blue-300 transition-all hover:shadow-xl group">
              <div className="flex items-center gap-6 mb-8">
                <span className="text-5xl group-hover:scale-110 transition-transform">🗓️</span>
                <div>
                  <h5 className="font-black text-slate-900 text-xl tracking-tight">Planting Recommendation</h5>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Temporal Logic</span>
                </div>
              </div>
              <p className="text-slate-600 text-[15px] font-bold leading-relaxed mb-6 flex-1">{intelligence.plantingRecommendation}</p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col hover:border-blue-300 transition-all hover:shadow-xl group">
              <div className="flex items-center gap-6 mb-8">
                <span className="text-5xl group-hover:scale-110 transition-transform">💧</span>
                <div>
                  <h5 className="font-black text-slate-900 text-xl tracking-tight">Irrigation Advice</h5>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Hydration Strategy</span>
                </div>
              </div>
              <p className="text-slate-600 text-[15px] font-bold leading-relaxed mb-6 flex-1">{intelligence.irrigationAdvice}</p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border-2 border-red-50 shadow-sm flex flex-col hover:border-red-300 transition-all hover:shadow-xl group">
              <div className="flex items-center gap-6 mb-8">
                <span className="text-5xl group-hover:scale-110 transition-transform">⚠️</span>
                <div>
                  <h5 className="font-black text-red-900 text-xl tracking-tight">Pest Risk Alerts</h5>
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Critical Epidemic Data</span>
                </div>
              </div>
              <p className="text-slate-600 text-[15px] font-bold leading-relaxed mb-6 flex-1">{intelligence.pestRiskAlerts}</p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col hover:border-emerald-300 transition-all hover:shadow-xl group">
              <div className="flex items-center gap-6 mb-8">
                <span className="text-5xl group-hover:scale-110 transition-transform">🌾</span>
                <div>
                  <h5 className="font-black text-emerald-900 text-xl tracking-tight">Harvest Timing</h5>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Yield Optimization</span>
                </div>
              </div>
              <p className="text-slate-600 text-[15px] font-bold leading-relaxed mb-6 flex-1">{intelligence.harvestTiming}</p>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] flex items-start gap-6 shadow-2xl">
             <span className="text-4xl">🌍</span>
             <div>
                <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-2">Foundation Data Integrity</h5>
                <p className="text-[13px] text-slate-300 font-bold leading-relaxed">
                  Weather intelligence is synthesized by cross-referencing global meteorological models (NOAA, ECMWF) with local regional farming calendars stored in the localization layer.
                </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherAdvice;
