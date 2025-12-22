
import React, { useState, useEffect } from 'react';
import { Section } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CropDiagnosis from './components/CropDiagnosis';
import LivestockHealth from './components/LivestockHealth';
import SoilAnalysis from './components/SoilAnalysis';
import WeatherAdvice from './components/WeatherAdvice';
import ChatAssistant from './components/ChatAssistant';
import RegionalDatabase from './components/RegionalDatabase';
import TrainingSimulator from './components/TrainingSimulator';
import AutomatedAgronomist from './components/AutomatedAgronomist';
import ApiConsole from './components/ApiConsole';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isTraining, setIsTraining] = useState(true);

  useEffect(() => {
    const trained = sessionStorage.getItem('agricore_trained');
    if (trained) setIsTraining(false);
  }, []);

  const handleTrainingComplete = () => {
    setIsTraining(false);
    sessionStorage.setItem('agricore_trained', 'true');
  };

  const renderSection = () => {
    const sectionClasses = "animate-fadeIn w-full max-w-6xl mx-auto px-2 sm:px-4";
    
    switch (activeSection) {
      case 'dashboard': return <div className={sectionClasses}><Dashboard onNavigate={setActiveSection} /></div>;
      case 'crop': return <div className={sectionClasses}><CropDiagnosis /></div>;
      case 'livestock': return <div className={sectionClasses}><LivestockHealth /></div>;
      case 'soil': return <div className={sectionClasses}><SoilAnalysis /></div>;
      case 'weather': return <div className={sectionClasses}><WeatherAdvice /></div>;
      case 'database': return <div className={sectionClasses}><RegionalDatabase /></div>;
      case 'ml-lab': return <div className={sectionClasses}><AutomatedAgronomist /></div>;
      case 'api-console': return <div className={sectionClasses}><ApiConsole /></div>;
      case 'chat': return <div className={sectionClasses}><ChatAssistant /></div>;
      default: return <div className={sectionClasses}><Dashboard onNavigate={setActiveSection} /></div>;
    }
  };

  if (isTraining) {
    return <TrainingSimulator onComplete={handleTrainingComplete} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        isOpen={isSidebarOpen}
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header onMenuClick={() => setSidebarOpen(true)} activeSection={activeSection} />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 p-4 sm:p-6 lg:p-8">
          <div className="pb-12">
            {renderSection()}
          </div>
        </main>

        {activeSection !== 'chat' && (
          <button 
            onClick={() => setActiveSection('chat')}
            className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group border-4 border-white"
          >
            <span className="text-2xl group-hover:rotate-12 transition-transform">🤖</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
