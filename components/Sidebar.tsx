
import React from 'react';
import { Section } from '../types';

interface SidebarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, isOpen, onToggle }) => {
  const menuItems: { id: Section; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'crop', label: 'Crop Health', icon: '🌱' },
    { id: 'livestock', label: 'Livestock', icon: '🐄' },
    { id: 'soil', label: 'Soil Analysis', icon: '🪨' },
    { id: 'weather', label: 'Weather Advice', icon: '☀️' },
    { id: 'database', label: 'Regional Data', icon: '🌍' },
    { id: 'ml-lab', label: 'ML Research Lab', icon: '🔬' },
    { id: 'chat', label: 'AI Assistant', icon: '🤖' },
  ];

  const handleNav = (id: Section) => {
    setActiveSection(id);
    if (window.innerWidth < 768) onToggle();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden" 
          onClick={onToggle}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-emerald-900 text-white transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-emerald-400">Agri</span>Core
          </h1>
          <p className="text-xs text-emerald-300 mt-1 uppercase tracking-wider font-semibold">Global Foundation Model</p>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                ${activeSection === item.id 
                  ? 'bg-emerald-800 text-emerald-50 shadow-sm' 
                  : 'hover:bg-emerald-800/50 text-emerald-100/70'}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-8 left-4 right-4 bg-emerald-800/50 p-4 rounded-2xl border border-emerald-700/50">
          <p className="text-xs text-emerald-300 leading-relaxed italic">
            "Feeding the world through advanced planetary intelligence."
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
