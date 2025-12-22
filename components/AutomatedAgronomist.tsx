
import React, { useState } from 'react';
import { automatedAgronomistInference } from '../services/geminiService';
import { AutomatedAgronomistResult } from '../types';

const AutomatedAgronomist: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AutomatedAgronomistResult | null>(null);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!image) {
      setError('Please upload an image.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await automatedAgronomistInference(image);
      setResult(data);
    } catch (err) {
      setError('Inference failed. Please check your image or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-10 animate-fadeIn">
      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/30 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            ML Research Laboratory Mode
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">The Automated <br/><span className="text-emerald-400">Agronomist</span></h2>
          <p className="text-slate-400 font-bold max-w-2xl text-lg">
            Specialized tool for Senior AI Research Engineers to generate high-fidelity structured training data for multimodal agricultural models.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-8 text-[120px] opacity-[0.03] font-black pointer-events-none uppercase">Dataset</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Input Visual Stimulus</h3>
            <div className={`
              border-2 border-dashed rounded-[2.5rem] h-96 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden group
              ${image ? 'border-emerald-500 bg-emerald-50 shadow-inner' : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'}
            `}>
              {image ? (
                <img src={image} className="w-full h-full object-cover" alt="Research Sample" />
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-10 text-center">
                  <span className="text-6xl mb-6 group-hover:scale-110 transition-transform">🔬</span>
                  <span className="text-sm font-black text-slate-600 uppercase tracking-widest">Inject Research Sample</span>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">PNG, JPG up to 10MB</p>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </div>
            {image && (
              <div className="mt-6 flex justify-between items-center px-4">
                <button onClick={() => setImage(null)} className="text-[10px] text-red-500 font-black uppercase tracking-widest hover:underline">Discard Sample</button>
                <button 
                  onClick={handleProcess} 
                  disabled={loading}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-xl transition-all disabled:opacity-50"
                >
                  {loading ? 'Processing Neural Weights...' : 'Run Inference'}
                </button>
              </div>
            )}
          </div>
          
          <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
            <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Architecture Specification</h4>
            <p className="text-xs text-slate-500 font-bold leading-relaxed italic">
              "AgriCore uses a late fusion strategy, combining EfficientNet-B4 features with metadata embeddings to reach this diagnostic consensus."
            </p>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex-1 bg-slate-950 rounded-[3rem] p-10 font-mono shadow-2xl overflow-hidden flex flex-col min-h-[500px] border border-white/5">
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] ml-2">Training_Set_Record.json</span>
              </div>
              <button 
                onClick={() => {
                  if (result) navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                }}
                className="text-[10px] text-emerald-400 font-black uppercase tracking-widest hover:text-emerald-300"
              >
                Copy JSON
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
              {loading ? (
                <div className="flex flex-col gap-3">
                  <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-white/5 rounded w-1/2 animate-pulse"></div>
                  <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-white/5 rounded w-2/3 animate-pulse"></div>
                  <div className="h-4 bg-white/5 rounded w-1/4 animate-pulse"></div>
                </div>
              ) : result ? (
                <pre className="text-emerald-400/90 text-[13px] leading-relaxed whitespace-pre-wrap">
                  {JSON.stringify(result, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-700 italic text-sm text-center px-10">
                  <span className="text-4xl mb-4 opacity-10">⌨️</span>
                  Output will be streamed here as a structured JSON record for your ML pipeline.
                </div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
                <span>Inference Engine: Gemini-3-Pro</span>
                <span className="text-emerald-500">Validated</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem] text-red-600 text-sm font-bold flex items-center gap-4">
          <span className="text-2xl">🚨</span> {error}
        </div>
      )}
    </div>
  );
};

export default AutomatedAgronomist;
