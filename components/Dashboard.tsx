
import React, { useState, useEffect } from 'react';
import { Section } from '../types';
import { EvolutionService } from '../services/evolutionService';
import { CROP_PATHOLOGY_DB, LIVESTOCK_VET_DB, SOIL_PROFILES } from '../services/knowledgeBase';

interface DashboardProps {
  onNavigate: (section: Section) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState(EvolutionService.getGrowthStats());
  const [localDeltas, setLocalDeltas] = useState<{title: string, date: string, impact: string}[]>([
    { title: "Sovereign Node: Fall Armyworm Pattern Updated", date: "Just now", impact: "High" },
    { title: "Local Weight: Soil pH remediation refined", date: "15 mins ago", impact: "Medium" }
  ]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(EvolutionService.getGrowthStats());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const pathologyCount = Object.keys(CROP_PATHOLOGY_DB).length;
  const livestockCount = Object.keys(LIVESTOCK_VET_DB).length;
  const soilCount = Object.keys(SOIL_PROFILES).length;

  return (
    <div className="space-y-10 pb-16">
      {/* Genesis Header */}
      <div className="bg-emerald-950 rounded-[3.5rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl border border-emerald-900">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              100% Sovereign Brain Active
            </div>
            <div className="bg-blue-500/10 text-blue-400 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-500/20">
              Private Weight Synthesis Enabled
            </div>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.05] tracking-tight">
            An AI Model <br/><span className="text-emerald-400">That You Own.</span><br/> 100% Private.
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-12">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 block">Active Synapses</span>
              <div className="text-3xl font-black">{stats.synapses.toLocaleString()}</div>
              <p className="text-[10px] text-slate-400 font-bold mt-1">Stored in local vault</p>
            </div>
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 block">Data Sovereignty</span>
              <div className="text-3xl font-black">100%</div>
              <p className="text-[10px] text-slate-400 font-bold mt-1">Zero cloud dependency for inference</p>
            </div>
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 block">Sovereign Growth</span>
              <div className="text-3xl font-black">+{stats.totalInteractions}</div>
              <p className="text-[10px] text-slate-400 font-bold mt-1">New patterns distilled locally</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-5">
            <button 
              onClick={() => onNavigate('ml-lab')}
              className="bg-emerald-500 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-3 shadow-xl shadow-emerald-950/40"
            >
              Distill New Weights
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Sovereign Learning Feed */}
          <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                <span className="p-2 bg-emerald-100 rounded-xl text-sm">🧠</span> Private Knowledge Updates
              </h3>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Local Weight Evolution</div>
            </div>
            
            <div className="space-y-4">
              {localDeltas.map((sig, idx) => (
                <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:bg-emerald-50 hover:border-emerald-200 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm group-hover:rotate-12 transition-transform">🧪</div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800">{sig.title}</h4>
                      <div className="flex gap-3 mt-1">
                        <span className="text-[9px] font-bold text-slate-400">{sig.date}</span>
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Impact: {sig.impact}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-emerald-600 bg-white px-3 py-1 rounded-full border border-emerald-100">Distilled</div>
                </div>
              ))}
            </div>
          </section>

          {/* Model Composition */}
          <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black mb-12 text-slate-800 flex items-center gap-3">
              <span className="p-2 bg-emerald-100 rounded-xl text-sm">🏗️</span> Knowledge Architecture
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Crop Nodes', value: pathologyCount, icon: '🌱', color: 'text-emerald-600 bg-emerald-50' },
                { label: 'Vet Nodes', value: livestockCount, icon: '🐄', color: 'text-amber-600 bg-amber-50' },
                { label: 'Soil Nodes', value: soilCount, icon: '🪨', color: 'text-slate-600 bg-slate-100' },
                { label: 'Private Weights', value: stats.synapses, icon: '🧬', color: 'text-blue-600 bg-blue-50' },
              ].map((m, i) => (
                <div key={i} className={`p-6 rounded-[2rem] border border-transparent hover:border-current/10 transition-all ${m.color}`}>
                  <div className="text-3xl mb-4">{m.icon}</div>
                  <div className="text-2xl font-black leading-none mb-1">{m.value}</div>
                  <div className="text-[9px] font-black uppercase tracking-widest opacity-60">{m.label}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-xl font-black text-slate-800 mb-6 px-2">Knowledge Gates</h3>
          {[
            { id: 'crop' as Section, title: 'Crop Health', desc: 'Sovereign Diagnosis', icon: '📸', color: 'bg-emerald-50 text-emerald-700' },
            { id: 'livestock' as Section, title: 'Vet Assistant', desc: 'Private Vet Logic', icon: '🩺', color: 'bg-amber-50 text-amber-700' },
            { id: 'database' as Section, title: 'Private Vault', icon: '🌍', desc: 'Localized Weights', color: 'bg-purple-50 text-purple-700' },
            { id: 'ml-lab' as Section, title: 'Weight Synthesis', icon: '🔬', desc: 'Sovereign Lab', color: 'bg-slate-900 text-white' },
          ].map((act) => (
            <button
              key={act.id}
              onClick={() => onNavigate(act.id)}
              className={`w-full group text-left p-8 rounded-[2.5rem] border border-transparent transition-all hover:shadow-2xl hover:-translate-y-1 ${act.color} border-current/10 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <span className="text-4xl group-hover:scale-110 transition-transform">{act.icon}</span>
                  <div>
                    <h4 className="text-xl font-black tracking-tight">{act.title}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{act.desc}</p>
                  </div>
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
