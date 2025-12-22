
import React, { useState, useEffect } from 'react';
import { Section } from '../types';

interface HeaderProps {
  onMenuClick: () => void;
  activeSection: Section;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, activeSection }) => {
  const [sovereignStatus, setSovereignStatus] = useState<'connected' | 'searching' | 'fallback'>('searching');

  useEffect(() => {
    const checkLink = async () => {
      try {
        const res = await fetch("http://localhost:8080/docs", { method: 'HEAD', mode: 'no-cors' });
        if (res.ok || res.status === 404 || res.type === 'opaque') {
           setSovereignStatus('connected');
        } else {
           setSovereignStatus('fallback');
        }
      } catch {
        setSovereignStatus('fallback');
      }
    };
    checkLink();
    const interval = setInterval(checkLink, 10000);
    return () => clearInterval(interval);
  }, []);

  const getTitle = () => {
    switch (activeSection) {
      case 'dashboard': return 'Dashboard Overview';
      case 'crop': return 'Crop Health & Diagnosis';
      case 'livestock': return 'Livestock Health Analysis';
      case 'soil': return 'Soil Health Intelligence';
      case 'weather': return 'Weather-Aware Reasoning';
      case 'database': return 'Regional Knowledge Base';
      case 'ml-lab': return 'ML Research Lab';
      case 'api-console': return 'API Developer Console';
      case 'chat': return 'Agri-Core AI Assistant';
      default: return 'AgriCore';
    }
  };

  return (
    <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 md:px-10 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-xl hover:bg-slate-100 lg:hidden text-slate-600 transition-colors"
          aria-label="Open Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex flex-col">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{getTitle()}</h2>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest lg:hidden">AgriCore Framework</span>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm transition-all hover:border-emerald-200">
          <div className={`w-2.5 h-2.5 rounded-full ${
            sovereignStatus === 'connected' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]' : 
            sovereignStatus === 'searching' ? 'bg-amber-400 animate-pulse' : 'bg-slate-300'
          }`}></div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none mb-0.5">
              {sovereignStatus === 'connected' ? 'Sovereign Private Brain' : 
               sovereignStatus === 'searching' ? 'Locating Node...' : 'Cloud Engine'}
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              {sovereignStatus === 'connected' ? 'Secure Link Established' : 'Gateway Fallback'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-black text-emerald-700 uppercase tracking-tighter">Admin Node</span>
            <span className="text-[9px] text-slate-400 font-bold">Foundation v7.0</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 border-2 border-emerald-500 flex items-center justify-center font-black text-white shadow-lg shadow-emerald-200 transition-transform hover:rotate-3 active:scale-95 cursor-pointer overflow-hidden relative group">
            <span className="relative z-10">A</span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
