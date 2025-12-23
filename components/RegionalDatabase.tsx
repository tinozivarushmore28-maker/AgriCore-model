
import React, { useState } from 'react';
import { regionalDatabase } from '../services/regionalDatabase';
import { CROP_PATHOLOGY_DB, FINE_TUNING_DATA } from '../services/knowledgeBase';

const RegionalDatabase: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState(regionalDatabase[0].region);
  const [activeTab, setActiveTab] = useState<'crops' | 'clusters' | 'encyclopedia' | 'localization'>('crops');
  const [climateFilter, setClimateFilter] = useState<'All' | 'Arid' | 'Tropical' | 'Temperate'>('All');

  const currentData = regionalDatabase.find(r => r.region === selectedRegion);

  const climateClusters = [
    { type: 'Arid', icon: '🌵', desc: 'Water-scarce, high heat, sandy soils.', regions: ['Southern Africa', 'Middle East'] },
    { type: 'Tropical', icon: '🌴', desc: 'High humidity, heavy rainfall, leached soils.', regions: ['West Africa', 'Southeast Asia'] },
    { type: 'Temperate', icon: '❄️', desc: 'Four distinct seasons, rich organic soil.', regions: ['Europe', 'North America'] }
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8">
      <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h3 className="text-3xl font-black text-slate-900 mb-2">Knowledge Clusters</h3>
            <p className="text-slate-500 font-bold">Model internal knowledge is split into separate regional and climate clusters.</p>
          </div>
          <select 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-black outline-none"
          >
            {regionalDatabase.map(r => (
              <option key={r.region} value={r.region}>{r.region}</option>
            ))}
          </select>
        </div>

        <div className="flex border-b border-slate-100 mb-10 overflow-x-auto no-scrollbar gap-8">
          {['crops', 'clusters', 'encyclopedia', 'localization'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 font-black text-xs uppercase tracking-[0.2em] transition-all border-b-4 ${activeTab === tab ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-400'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'crops' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentData?.crops.map((crop, i) => (
              <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 flex flex-col group hover:border-emerald-500 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <span className="p-4 bg-white rounded-2xl text-2xl shadow-sm group-hover:rotate-12 transition-transform">🌿</span>
                  <span className="text-[9px] font-black bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full tracking-widest uppercase">Validated</span>
                </div>
                <h4 className="text-xl font-black text-slate-800 mb-2">{crop.name}</h4>
                <p className="text-sm text-slate-600 font-bold leading-relaxed mb-6">{crop.climatePerformance}</p>
                <div className="mt-auto pt-6 border-t border-slate-200">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Common Challenges</label>
                  <div className="flex flex-wrap gap-2">
                    {crop.commonIssues.map((issue, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-500">{issue}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'clusters' && (
          <div className="space-y-8">
             <div className="flex gap-4 mb-8">
               {['All', 'Arid', 'Tropical', 'Temperate'].map(f => (
                 <button 
                  key={f}
                  onClick={() => setClimateFilter(f as any)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${climateFilter === f ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                 >
                   {f}
                 </button>
               ))}
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {climateClusters.filter(c => climateFilter === 'All' || c.type === climateFilter).map((cluster, idx) => (
                  <div key={idx} className="p-8 bg-slate-900 text-white rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                    <span className="text-4xl mb-6 block group-hover:scale-110 transition-transform">{cluster.icon}</span>
                    <h4 className="text-xl font-black text-emerald-400 mb-2">{cluster.type} Cluster</h4>
                    <p className="text-xs text-slate-400 font-bold leading-relaxed mb-6">{cluster.desc}</p>
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl font-black">{cluster.type}</div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'encyclopedia' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
               {Object.entries(CROP_PATHOLOGY_DB).map(([disease, data], i) => (
                 <div key={i} className="p-10 bg-white rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all">
                   <div className="flex justify-between items-start mb-8">
                     <div>
                       <h4 className="text-2xl font-black text-slate-900">{disease}</h4>
                       <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Global Taxonomy Node</span>
                     </div>
                     <span className="text-[9px] font-black bg-slate-950 text-white px-3 py-1 rounded-full uppercase">Sovereign Core</span>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-6">
                        <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Visual Indicators</label>
                          <p className="text-sm text-slate-600 font-bold leading-relaxed">{data.symptoms}</p>
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block mb-2">Sustainable Control</label>
                          <p className="text-sm text-emerald-800 font-bold leading-relaxed italic">"{data.organic_treatment}"</p>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Primary Etiology</label>
                          <p className="text-sm text-slate-600 font-bold leading-relaxed">{data.cause}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Regional Adaptation</label>
                           <p className="text-[10px] text-slate-500 font-bold">Knowledge adjusted for local climate variables automatically.</p>
                        </div>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'localization' && (
          <div className="space-y-10">
            {Object.entries(FINE_TUNING_DATA).map(([region, data]: [string, any], i) => (
              <div key={i} className="p-10 bg-purple-950 text-white rounded-[3rem] shadow-2xl relative overflow-hidden group border border-purple-500/20">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <h4 className="text-3xl font-black text-purple-400">{region}</h4>
                      <p className="text-[10px] font-black text-purple-300/50 uppercase tracking-[0.3em] mt-1">Adaptive Learning Cluster Active</p>
                    </div>
                    <span className="bg-purple-500/20 text-purple-300 text-[10px] font-black px-4 py-1.5 rounded-full uppercase border border-purple-500/30">L-Cluster v9</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                      <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest block mb-2">Climate Variables</label>
                      <p className="text-sm font-black text-purple-50">{data.climate_zone}</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                      <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest block mb-2">Cluster-Specific Logic</label>
                      <p className="text-sm font-black text-purple-50">{data.maize_specials || data.crop_specials}</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                      <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest block mb-2">Local Biome Analysis</label>
                      <p className="text-sm font-black text-purple-50">{data.pest_notes || 'Standard surveillance'}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-8 text-9xl opacity-5 font-black pointer-events-none uppercase">Adaptive</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-12 bg-slate-900 rounded-[4rem] text-white shadow-2xl relative overflow-hidden border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="text-6xl p-8 bg-emerald-500/10 rounded-full border border-emerald-500/20">📚</div>
          <div className="flex-1">
            <h4 className="text-3xl font-black mb-4">Sovereign Evidence Loop</h4>
            <p className="text-slate-400 font-bold leading-relaxed max-w-2xl">
              Knowledge is not static. Our <strong>Search-Augmented Learning</strong> protocol continuously compares global web reports with internal clusters, discarding outdated practices and prioritizing farmer-tested, evidence-backed insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalDatabase;
