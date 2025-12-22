
import React from 'react';
import { Section } from '../types';

interface SidebarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, isOpen, onToggle }) => {
  const menuItems: { id: Section; label: string; icon: string; category: string }[] = [
    { id: 'dashboard', label: 'Global Monitor', icon: '📊', category: 'Overview' },
    { id: 'crop', label: 'Crop Pathology', icon: '🌱', category: 'Analysis' },
    { id: 'livestock', label: 'Vet Diagnostics', icon: '🐄', category: 'Analysis' },
    { id: 'soil', label: 'Pedology Core', icon: '🪨', category: 'Analysis' },
    { id: 'weather', label: 'Climate Intel', icon: '☀️', category: 'Environmental' },
    { id: 'database', label: 'Knowledge Base', icon: '🌍', category: 'Environmental' },
    { id: 'ml-lab', label: 'ML Research Lab', icon: '🔬', category: 'Developer' },
    { id: 'api-console', label: 'Gateway Console', icon: '🔑', category: 'Developer' },
    { id: 'chat', label: 'AI Assistant', icon: '🤖', category: 'Support' },
  ];

  const handleNav = (id: Section) => {
    setActiveSection(id);
    if (window.innerWidth < 1024) onToggle();
  };

  // Group items by category
  const categories = Array.from(new Set(menuItems.map(item => item.category)));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60] lg:hidden animate-fadeIn" 
          onClick={onToggle}
        />
      )}

      {/* Sidebar Aside */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[70] w-80 bg-emerald-950 text-white transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-emerald-900/50 flex flex-col
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Branding Area */}
        <div className="p-8 lg:p-10">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => handleNav('dashboard')}>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-[1.25rem] flex items-center justify-center text-3xl shadow-xl shadow-emerald-500/20 group-hover:rotate-12 transition-transform duration-500">🌾</div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black tracking-tight leading-none text-white">
                Agri<span className="text-emerald-400">Core</span>
              </h1>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <p className="text-[10px] text-emerald-300/60 uppercase font-black tracking-[0.15em]">Private Brain v7.0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Content */}
        <nav className="flex-1 px-4 lg:px-6 space-y-8 overflow-y-auto no-scrollbar py-4">
          {categories.map((cat) => (
            <div key={cat} className="space-y-2">
              <h3 className="px-5 text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.25em] mb-4">{cat}</h3>
              <div className="space-y-1">
                {menuItems.filter(item => item.category === cat).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`
                      w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[14px] font-bold transition-all group relative
                      ${activeSection === item.id 
                        ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10' 
                        : 'text-emerald-100/40 hover:text-white hover:bg-white/5'}
                    `}
                  >
                    <span className={`text-xl transition-all duration-500 ${activeSection === item.id ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'group-hover:scale-110'}`}>
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left">{item.label}</span>
                    {activeSection === item.id && (
                      <>
                        <div className="absolute left-0 w-1 h-6 bg-emerald-400 rounded-r-full"></div>
                        <div className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Info Area */}
        <div className="p-6 lg:p-8 mt-auto">
          <div className="bg-emerald-900/30 p-5 rounded-[2rem] border border-white/5 backdrop-blur-sm group hover:border-emerald-500/30 transition-colors cursor-default">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm animate-pulse">📡</div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">Inference Node</span>
                <span className="text-[9px] text-emerald-100/40 font-bold uppercase tracking-tighter">ZW-Sovereign-Alpha</span>
              </div>
            </div>
            <p className="text-[11px] text-emerald-100/60 leading-relaxed font-medium">
              Offline capacity: <span className="text-white font-black">100%</span>
              <br />
              Encryption: <span className="text-white font-black">Quantum-S</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
