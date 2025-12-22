
import React, { useState, useEffect } from 'react';
import { getAI } from '../services/geminiService';

interface TrainingStep {
  id: number;
  label: string;
  desc: string;
  status: 'pending' | 'active' | 'complete';
  progress: number;
}

const TrainingSimulator: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [steps, setSteps] = useState<TrainingStep[]>([
    { id: 1, label: 'Data Collection', desc: 'Ingesting FAO, Research Papers & Images', status: 'pending', progress: 0 },
    { id: 2, label: 'Data Cleaning', desc: 'Normalization & Regional Metadata Tagging', status: 'pending', progress: 0 },
    { id: 3, label: 'Global Pretraining', desc: 'Synthesizing General Farming Knowledge', status: 'pending', progress: 0 },
    { id: 4, label: 'Localized Fine-Tuning', desc: 'Optimizing for Regional Agri-Varieties', status: 'pending', progress: 0 },
  ]);

  const [logs, setLogs] = useState<string[]>(['[SYSTEM] Initializing Genesis Protocol...']);
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  useEffect(() => {
    if (activeStepIdx < steps.length) {
      const timer = setInterval(() => {
        setSteps(prev => prev.map((s, i) => {
          if (i === activeStepIdx) {
            const nextProgress = s.progress + Math.random() * 15;
            if (nextProgress >= 100) {
              clearInterval(timer);
              setActiveStepIdx(i + 1);
              return { ...s, progress: 100, status: 'complete' };
            }
            return { ...s, progress: nextProgress, status: 'active' };
          }
          return s;
        }));
      }, 800);

      const logGen = async () => {
        try {
          const ai = getAI();
          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate 3 technical-sounding short log lines for an AI training process: ${steps[activeStepIdx].label}. Focus on agricultural model architecture. One line per line.`
          });
          const newLines = (response.text || "").split('\n').filter(l => l.trim());
          setLogs(prev => [...newLines.map(l => `[NODE-${Math.floor(Math.random()*999)}] ${l}`), ...prev].slice(0, 15));
        } catch (e) {
          setLogs(prev => [`[LOG] Processed node block for ${steps[activeStepIdx].label}`, ...prev]);
        }
      };

      const logTimer = setInterval(logGen, 3000);
      return () => {
        clearInterval(timer);
        clearInterval(logTimer);
      };
    } else {
      setTimeout(onComplete, 2000);
    }
  }, [activeStepIdx]);

  return (
    <div className="fixed inset-0 bg-slate-950 z-[100] flex items-center justify-center p-4 md:p-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] border border-emerald-500/20">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              AgriCore Model Genesis
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
              Executing <br/><span className="text-emerald-500">Foundation</span><br/> Training.
            </h1>
            <p className="text-slate-400 font-bold max-w-md">
              Step-by-step distillation of global internet agricultural data into a cohesive planetary farming brain.
            </p>
          </div>

          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.id} className={`p-6 rounded-3xl border transition-all duration-500 ${step.status === 'active' ? 'bg-emerald-500/5 border-emerald-500/40 scale-105' : 'bg-white/5 border-white/10 opacity-40'}`}>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-black text-white">{step.label}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{step.desc}</p>
                  </div>
                  <span className="text-xs font-black text-emerald-500">{Math.floor(step.progress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black/40 border border-white/5 rounded-[3rem] p-8 h-[600px] flex flex-col font-mono text-[11px]">
          <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
            <div className="text-slate-500 font-bold uppercase tracking-widest">Training Telemetry Logs</div>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/40"></div>
              <div className="w-2 h-2 rounded-full bg-amber-500/40"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-500/40"></div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden space-y-2">
            {logs.map((log, i) => (
              <div key={i} className={`flex gap-3 ${i === 0 ? 'text-emerald-400' : 'text-slate-600'}`}>
                <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
                <span className="break-all">{log}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
             <div className="space-y-1">
               <div className="text-[9px] text-slate-500 uppercase font-black">Memory Bandwidth</div>
               <div className="text-emerald-500 font-bold">1.8 PB/epoch</div>
             </div>
             <div className="space-y-1 text-right">
               <div className="text-[9px] text-slate-500 uppercase font-black">Pretrained Status</div>
               <div className="text-blue-500 font-bold">Base Model Optimized</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingSimulator;
