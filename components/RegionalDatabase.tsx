
import React, { useState } from 'react';
import { regionalDatabase } from '../services/regionalDatabase';
import { CROP_PATHOLOGY_DB, LIVESTOCK_VET_DB, GENERAL_FARMING_KNOWLEDGE, FINE_TUNING_DATA } from '../services/knowledgeBase';

const RegionalDatabase: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState(regionalDatabase[0].region);
  const [activeTab, setActiveTab] = useState<'crops' | 'livestock' | 'encyclopedia' | 'principles' | 'localization'>('crops');

  const currentData = regionalDatabase.find(r => r.region === selectedRegion);

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8">
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-bold">Foundation Knowledge Base</h3>
              <span className="bg-purple-100 text-purple-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter border border-purple-200">
                Step 4: Fully Fine-Tuned
              </span>
            </div>
            <p className="text-slate-500 text-sm">Localized agricultural intelligence optimized for regional performance.</p>
          </div>
          
          <select 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {regionalDatabase.map(r => (
              <option key={r.region} value={r.region}>{r.region}</option>
            ))}
          </select>
        </div>

        <div className="flex border-b border-slate-100 mb-6 overflow-x-auto no-scrollbar">
          {['crops', 'livestock', 'encyclopedia', 'principles', 'localization'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 font-bold text-sm transition-all border-b-2 capitalize whitespace-nowrap ${activeTab === tab ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-400'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'crops' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentData?.crops.map((crop, i) => (
              <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-3">
                    <span className="p-2 bg-emerald-100 rounded-lg text-lg">🌿</span>
                    <h4 className="font-bold text-slate-800">{crop.name}</h4>
                  </div>
                  <span className="text-[8px] font-black bg-emerald-950 text-emerald-400 px-2 py-1 rounded-md tracking-widest uppercase">FINE-TUNED</span>
                </div>
                <div className="space-y-4 flex-1">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Performance</label>
                    <p className="text-xs text-slate-600 leading-relaxed">{crop.climatePerformance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'livestock' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentData?.livestock.map((breed, i) => (
              <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-amber-100 rounded-lg text-lg">🐂</span>
                    <h4 className="font-bold text-slate-800">{breed.name}</h4>
                  </div>
                  <span className="text-[8px] font-black bg-slate-800 text-amber-400 px-2 py-1 rounded-md tracking-widest uppercase">FINE-TUNED</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{breed.suitability}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'encyclopedia' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
               {Object.entries(CROP_PATHOLOGY_DB).map(([disease, data], i) => (
                 <div key={i} className="p-8 bg-slate-900 rounded-3xl text-white border border-emerald-500/20 shadow-xl group hover:border-emerald-400/50 transition-all">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <h4 className="text-xl font-black text-emerald-400">{disease}</h4>
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Category: {(data as any).category}</span>
                     </div>
                     <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-300 px-2 py-1 rounded border border-emerald-500/30">PRETRAINED</span>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-4">
                       <div>
                         <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Symptoms</label>
                         <p className="text-sm text-slate-300 leading-relaxed font-medium">{data.symptoms}</p>
                       </div>
                       <div>
                         <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Organic Treatment</label>
                         <p className="text-sm text-emerald-200 leading-relaxed italic">{data.organic_treatment}</p>
                       </div>
                     </div>
                     <div className="space-y-4">
                       <div>
                         <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Cause</label>
                         <p className="text-sm text-slate-300 leading-relaxed font-medium">{data.cause}</p>
                       </div>
                       <div>
                         <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Chemical Option</label>
                         <p className="text-sm text-blue-200 leading-relaxed">{data.chemical_treatment}</p>
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'principles' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(GENERAL_FARMING_KNOWLEDGE).map(([title, data]: [string, any], i) => (
                <div key={i} className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 shadow-sm">
                  <h4 className="text-xl font-black text-emerald-900 mb-4">{title}</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">Core Principle</label>
                      <p className="text-sm text-emerald-800 leading-relaxed">{data.principle}</p>
                    </div>
                    {data.pillars && (
                      <div>
                        <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">Pillars</label>
                        <ul className="space-y-1">
                          {data.pillars.map((p: string, idx: number) => (
                            <li key={idx} className="text-xs text-emerald-700 flex gap-2">
                              <span className="font-bold">•</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'localization' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 gap-6">
              {Object.entries(FINE_TUNING_DATA).map(([region, data]: [string, any], i) => (
                <div key={i} className="p-10 bg-purple-50 rounded-[3rem] border border-purple-100 shadow-sm group hover:border-purple-300 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-2xl font-black text-purple-900">{region}</h4>
                      <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] mt-1">Fine-Tuned Profile Active</p>
                    </div>
                    <span className="bg-purple-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase">Step 4 Layer</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Climate Zone</label>
                      <p className="text-sm text-purple-800 font-bold">{data.climate_zone}</p>
                    </div>
                    {data.maize_specials && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Maize Varieties</label>
                        <p className="text-sm text-purple-800 font-medium leading-relaxed">{data.maize_specials}</p>
                      </div>
                    )}
                    {data.crop_specials && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Regional Methods</label>
                        <p className="text-sm text-purple-800 font-medium leading-relaxed">{data.crop_specials}</p>
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Soil Characteristics</label>
                      <p className="text-sm text-purple-800 font-medium leading-relaxed">{data.soil_quirks}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Livestock Suitability</label>
                      <p className="text-sm text-purple-800 font-medium leading-relaxed">{data.livestock_focus}</p>
                    </div>
                    {data.pest_notes && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Epidemic Surveillance</label>
                        <p className="text-sm text-purple-800 font-medium leading-relaxed">{data.pest_notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white flex items-start gap-6 shadow-xl">
              <span className="text-3xl">🎯</span>
              <div>
                <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] mb-2">Localization Precision</h5>
                <p className="text-xs text-slate-300 font-bold leading-relaxed">
                  AgriCore uses the Step 4 Fine-Tuning layer to override generic advice with regional expertise. For example, in Zimbabwe, the model prioritizes 'January Disease' protocols for livestock and SC-Series maize selection based on local rainfall patterns.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-10 bg-emerald-950 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="font-black text-xl mb-4 flex items-center gap-3 text-emerald-400">
            <span className="p-2 bg-emerald-900 rounded-xl">📍</span> Localized Fine-Tuning Layer
          </h4>
          <p className="text-sm text-emerald-100/70 leading-relaxed max-w-2xl">
            This database now integrates <strong>Step 4 Fine-Tuning</strong>. We've optimized the model for specific high-impact regions (Zimbabwe, East/West Africa) to ensure that recommendations are biologically and economically viable at the local farm gate.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-8 text-[120px] opacity-[0.03] font-black pointer-events-none uppercase">Localized</div>
      </div>
    </div>
  );
};

export default RegionalDatabase;
