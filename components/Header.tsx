
import React from 'react';
import { Section } from '../types';

interface HeaderProps {
  onMenuClick: () => void;
  activeSection: Section;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, activeSection }) => {
  const getTitle = () => {
    switch (activeSection) {
      case 'dashboard': return 'Dashboard Overview';
      case 'crop': return 'Crop Health & Pest Diagnosis';
      case 'livestock': return 'Livestock Health Analysis';
      case 'soil': return 'Soil Health & Recommendations';
      case 'weather': return 'Weather-Aware Intelligence';
      case 'database': return 'Regional Knowledge Base';
      case 'ml-lab': return 'ML Research Lab (Automated Agronomist)';
      case 'chat': return 'Agri-Core AI Assistant';
      default: return 'AgriCore';
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg hover:bg-slate-100 md:hidden"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-slate-800">{getTitle()}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-bold text-emerald-700">AgriCore AI v3.1</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Foundation Model</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-500">
          U
        </div>
      </div>
    </header>
  );
};

export default Header;
