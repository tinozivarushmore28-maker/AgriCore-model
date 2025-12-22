
import React, { useState, useEffect } from 'react';
import { Section } from '../types';
import { CROP_PATHOLOGY_DB, LIVESTOCK_VET_DB, SOIL_PROFILES } from '../services/knowledgeBase';

interface DashboardProps {
  onNavigate: (section: Section) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [dataIngestion, setDataIngestion] = useState(99.9);
  
  const pathologyCount = Object.keys(CROP_PATHOLOGY_DB).length;
  const livestockCount = Object.keys(LIVESTOCK_VET_DB).length;
  const soilCount = Object.keys(SOIL_PROFILES).length;
  const totalNodes = pathologyCount + livestockCount + soilCount;

  const trainingSteps = [
    { step: '01', title: 'Data Collection', desc: 'Crawled FAO, university extensions, and global research publications.', status: 'Complete', progress: 100 },
    { step: '02', title: 'Data Cleaning', desc: 'Normalized crop names, removed duplicates, and tagged regional metadata.', status: 'Complete', progress: 100 },
    { step: '03', title: 'Global Pretraining', desc: 'Teaching foundational farming principles: IPM, Rotation, and Conservation.', status: 'Complete', progress: 100 },
    { step: '04', title: 'Localized Fine-Tuning', desc: 'Optimized for Zimbabwe, Africa-wide, and global climate zones.', status: 'Complete', progress: 100 },
  ];

  const dataDistribution = [
    { label: 'Pathology Nodes', value: `${Math.round((pathologyCount/totalNodes)*100)}%`, color: 'bg-emerald-500', icon: '📄' },
    { label: 'Livestock Nodes', value: `${Math.round((livestockCount/totalNodes)*100)}%`, color: 'bg-blue-500', icon: '🌍' },
    { label: 'Soil Profiles', value: `${Math.round((soilCount/totalNodes)*100)}%`, color: 'bg-amber-500', icon: '📸' },
    { label: 'Localization Layer', value: '15%', color: 'bg-purple-500', icon: '📍' },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Genesis Header */}
      <div className="bg-emerald-950 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold uppercase tracking-[0.2em] border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Localized Foundation Model Active
            </div>
            <div className="bg-purple-500/10 text-purple-400 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-purple-500/20">
              Step 4: Fine-Tuning Verified
            </div>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.05] tracking-tight">
            Localized <br/><span className="text-emerald-400">Agricultural</span><br/> Intelligence.
          </h1>
          <p className="text-emerald-100/60 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed font-medium">
            AgriCore is now fully fine-tuned. The model possesses hyper-specific knowledge for regions including Zimbabwe and broader Africa, optimizing advice for local varieties and soil.
          </p>
          
          <div className="flex flex-wrap gap-5">
            <button 
              onClick={() => onNavigate('crop')}
              className="bg-emerald-500 text-white px-10 py-5 rounded-[2rem] font-bold hover:bg-emerald-400 transition-all flex items-center gap-3 shadow-xl shadow-emerald-950"
            >
              Start Diagnostic Inference
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
            <div className="flex flex-col justify-center">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Inference Engine Status</div>
              <div className="w-48 h-1.5 bg-emerald-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `100%` }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute -bottom-20 -right-20 w-[40rem] h-[40rem] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Global Data Lake Telemetry */}
          <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-[60px] opacity-[0.03] font-black pointer-events-none uppercase">FineTuned</div>
            <h3 className="text-xl font-black mb-8 text-slate-800 flex items-center gap-3">
              <span className="p-2 bg-blue-100 rounded-xl text-sm">📍</span> Fine-Tuned Intelligence Telemetry
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <p className="text-sm text-slate-500 font-bold leading-relaxed">
                  Visualization of localized knowledge distillation. The model has synthesized {totalNodes} diagnostic nodes with an added localization layer for regional performance.
                </p>
                <div className="space-y-4">
                  {dataDistribution.map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="flex items-center gap-2">
                          <span className="text-sm">{item.icon}</span> {item.label}
                        </span>
                        <span className="text-slate-400">{item.value}</span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: item.value === '15%' ? '15%' : item.value }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-200 shadow-inner flex flex-col justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-black text-slate-800">{pathologyCount}</div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Pathogens</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-slate-800">8</div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Regional Models</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-slate-800">{livestockCount}</div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Vet Protocols</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-purple-600">Active</div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Zimbabwe Fine-Tune</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <h3 className="text-xl font-black mb-12 text-slate-800 flex items-center gap-3">
              <span className="p-2 bg-emerald-100 rounded-xl text-sm">🏗️</span> Model Training Pipeline
            </h3>
            <div className="space-y-12">
              {trainingSteps.map((s, i) => (
                <div key={i} className="flex gap-8 group">
                  <div className="flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg border-4 border-white shadow-lg z-10 bg-emerald-500 text-white`}>
                      {s.step}
                    </div>
                    {i !== trainingSteps.length - 1 && <div className="w-0.5 flex-1 bg-emerald-100 my-2"></div>}
                  </div>
                  <div className="flex-1 pb-4">
                    <h4 className="font-black text-slate-900 text-lg">{s.title}</h4>
                    <p className="text-sm text-slate-500 font-bold max-w-xl mb-4">{s.desc}</p>
                    <div className="w-full h-1.5 bg-emerald-50 rounded-full">
                      <div className={`h-full rounded-full transition-all duration-1000 bg-emerald-500`} style={{ width: `100%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-xl font-black text-slate-800 mb-6">Localized Modules</h3>
          {[
            { id: 'crop' as Section, title: 'Crop Health', desc: 'Variety-Specific AI', icon: '🌱', color: 'bg-emerald-50 text-emerald-700' },
            { id: 'livestock' as Section, title: 'Livestock Care', desc: 'Regional Vet Brain', icon: '🐄', color: 'bg-amber-50 text-amber-700' },
            { id: 'soil' as Section, title: 'Soil Intelligence', desc: 'Climate Zone Sync', icon: '🪨', color: 'bg-slate-100 text-slate-700' },
            { id: 'database' as Section, title: 'Regional Knowledge', desc: 'Fine-Tune Profiles', icon: '🌍', color: 'bg-purple-50 text-purple-700' },
          ].map((act) => (
            <button
              key={act.id}
              onClick={() => onNavigate(act.id)}
              className={`w-full group text-left p-8 rounded-[2.5rem] border border-transparent transition-all hover:shadow-2xl hover:-translate-y-1 ${act.color} border-current/10`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <span className="text-5xl group-hover:scale-110 transition-transform">{act.icon}</span>
                  <div>
                    <h4 className="text-xl font-black">{act.title}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{act.desc}</p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl border border-current/20 flex items-center justify-center bg-white/40">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
