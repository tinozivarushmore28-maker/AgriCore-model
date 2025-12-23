
import React, { useState } from 'react';
import { diagnoseCrop, generateHealthyCropReference } from '../services/geminiService';
import { performLocalInference } from '../services/localInferenceEngine';
import { DiagnosisResult } from '../types';
import { regionalDatabase } from '../services/regionalDatabase';
import FeedbackForm from './FeedbackForm';

const CropDiagnosis: React.FC = () => {
  const [brainMode, setBrainMode] = useState<'cloud' | 'local'>('cloud');
  const [image, setImage] = useState<string | null>(null);
  const [cropInfo, setCropInfo] = useState('Maize');
  const [growthStage, setGrowthStage] = useState('Vegetative');
  const [symptomType, setSymptomType] = useState('yellow_streaks');
  const [selectedRegion, setSelectedRegion] = useState(regionalDatabase[0].region);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [healthyRef, setHealthyRef] = useState<string | null>(null);
  const [loadingRef, setLoadingRef] = useState(false);
  const [error, setError] = useState('');

  const handleDiagnose = async () => {
    setLoading(true);
    setError('');
    try {
      if (brainMode === 'local') {
        const data = performLocalInference('crop', cropInfo, symptomType);
        setResult(data);
      } else {
        if (!image) throw new Error("Please upload an image for cloud diagnosis.");
        const regionalData = regionalDatabase.find(r => r.region === selectedRegion);
        const data = await diagnoseCrop(image, cropInfo, growthStage, { soilType: 'Loamy', weatherEvents: '' }, regionalData);
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateHealthy = async () => {
    setLoadingRef(true);
    try {
      const img = await generateHealthyCropReference(cropInfo);
      setHealthyRef(img);
    } catch (err) {
      setError("Failed to generate healthy reference.");
    } finally {
      setLoadingRef(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8 animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-8 right-8 flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
           <button onClick={() => setBrainMode('cloud')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${brainMode === 'cloud' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-400'}`}>Cloud Brain</button>
           <button onClick={() => setBrainMode('local')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${brainMode === 'local' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'}`}>Private Brain</button>
        </div>

        <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Diagnostic Core</h3>
        <p className="text-slate-500 font-bold mb-8">
          {brainMode === 'local' ? 'Private Sovereign Inference Engine' : 'Cloud-Assisted Foundation Model'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sample Visuals</label>
              <div className="border-2 border-dashed rounded-[2rem] h-64 flex items-center justify-center overflow-hidden bg-slate-50 border-slate-200">
                {image ? (
                  <img src={image} className="w-full h-full object-cover" alt="Symptom" />
                ) : (
                  <label className="cursor-pointer p-8 text-center flex flex-col items-center">
                    <span className="text-4xl mb-2">📸</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Upload Disease Image</span>
                    <input type="file" className="hidden" onChange={(e) => {
                      const f = e.target.files?.[0];
                      if(f){
                        const r = new FileReader();
                        r.onload = () => setImage(r.result as string);
                        r.readAsDataURL(f);
                      }
                    }} />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Crop</label>
                <input type="text" value={cropInfo} onChange={e => setCropInfo(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Stage</label>
                <select value={growthStage} onChange={e => setGrowthStage(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none">
                  <option>Vegetative</option>
                  <option>Flowering</option>
                  <option>Fruiting</option>
                  <option>Maturity</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 justify-center">
             <button
              onClick={handleDiagnose}
              disabled={loading}
              className={`w-full py-6 rounded-3xl font-black text-white transition-all text-lg shadow-xl ${loading ? 'bg-slate-400' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'}`}
            >
              {loading ? 'Synthesizing...' : 'Run Analysis'}
            </button>
            <button
              onClick={handleGenerateHealthy}
              disabled={loadingRef}
              className="w-full py-4 bg-white border-2 border-emerald-600 text-emerald-600 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all"
            >
              {loadingRef ? 'Generating Reference...' : 'Generate Healthy Comparison'}
            </button>
            {error && <p className="text-red-500 text-[10px] font-black text-center uppercase">{error}</p>}
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-8">
          <div className="animate-slideUp bg-white rounded-[3rem] p-10 border border-slate-200 shadow-2xl overflow-hidden relative">
             <div className="flex items-center gap-6 mb-8">
                <div className="text-5xl">🌿</div>
                <div>
                  <h4 className="text-3xl font-black text-slate-900 leading-tight">{result.name}</h4>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Diagnostic Report</span>
                </div>
             </div>
             
             {result.safetyAudit && (
               <div className="mb-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <span className="text-2xl">🛡️</span>
                     <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Safety Audited • Score: {result.safetyAudit.safetyScore}%</span>
                  </div>
                  <span className="text-[8px] font-black text-emerald-600 bg-white px-2 py-1 rounded border border-emerald-100 uppercase">Sustainable Advice</span>
               </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50 p-6 rounded-2xl">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase mb-2">Sustainable Strategy</h5>
                  <p className="text-sm font-bold text-slate-700">{result.treatmentOrganic}</p>
                </div>
                <div className="bg-emerald-950 text-white p-6 rounded-2xl">
                  <h5 className="text-[10px] font-black text-emerald-400 uppercase mb-2">Scientific Prevention</h5>
                  <p className="text-sm font-bold">{result.prevention}</p>
                </div>
             </div>

             {result.safetyAudit && result.safetyAudit.safetyScore < 70 && (
               <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100">
                  <h5 className="text-[10px] font-black text-amber-600 uppercase mb-2">Ecological Risks Detected</h5>
                  <p className="text-xs text-amber-800 font-bold">{result.safetyAudit.risksDetected.join(', ')}</p>
                  <p className="text-[10px] text-amber-600 mt-2 italic font-medium">Safe Alternative: {result.safetyAudit.safeAlternatives[0]}</p>
               </div>
             )}

             <FeedbackForm type="crop" context={`Diagnosis: ${result.name} for ${cropInfo}`} originalInput={image || ""} originalOutput={result} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CropDiagnosis;
