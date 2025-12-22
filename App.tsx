
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

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isTraining, setIsTraining] = useState(true);

  // Check if already "trained" in this session
  useEffect(() => {
    const trained = sessionStorage.getItem('agricore_trained');
    if (trained) setIsTraining(false);
  }, []);

  const handleTrainingComplete = () => {
    setIsTraining(false);
    sessionStorage.setItem('agricore_trained', 'true');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard onNavigate={setActiveSection} />;
      case 'crop': return <CropDiagnosis />;
      case 'livestock': return <LivestockHealth />;
      case 'soil': return <SoilAnalysis />;
      case 'weather': return <WeatherAdvice />;
      case 'database': return <RegionalDatabase />;
      case 'ml-lab': return <AutomatedAgronomist />;
      case 'chat': return <ChatAssistant />;
      default: return <Dashboard onNavigate={setActiveSection} />;
    }
  };

  if (isTraining) {
    return <TrainingSimulator onComplete={handleTrainingComplete} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        isOpen={isSidebarOpen}
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} activeSection={activeSection} />
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto animate-fadeIn">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
