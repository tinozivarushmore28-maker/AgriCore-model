
import React, { useState } from 'react';
// Fix: removed non-existent export generateHealthyPlantImage from the import list
import { diagnoseCrop } from '../services/geminiService';
import { performLocalInference } from '../services/localInferenceEngine';
import { DiagnosisResult } from '../types';
import { regionalDatabase } from '../services/regionalDatabase';
import FeedbackForm from './FeedbackForm';

const CropDiagnosis: React.FC = () => {
  const [brainMode, setBrainMode] = useState<'cloud' | 'local'>('cloud');
  const [image, setImage] = useState<string | null>(null);
  const [userHealthyReference, setUserHealthyReference] = useState<string | null>(null);
  const [cropInfo, setCropInfo] = useState('');
  const [growthStage, setGrowthStage] = useState('Seedling');
  const [symptomType, setSymptomType] = useState('yellow_streaks');
  const [selectedRegion, setSelectedRegion] = useState(regionalDatabase[0].region);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState('');
  const [healthyImage, setHealthyImage] = useState<string | null>(null);
  const [generatingHealthy, setGeneratingHealthy] = useState(false);

  const handleDiagnose = async () => {
    setLoading(true);
    setError('');
    try {
      if (brainMode === 'local') {
        // PERFORMS 100% PRIVATE OFFLINE INFERENCE
        const data = performLocalInference('crop', cropInfo || 'Maize', symptomType);
        setResult(data);
      } else {
        // PERFORMS CLOUD-ASSISTED INFERENCE
        if (!image) throw new Error("Cloud mode requires an image upload.");
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

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8 animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Brain Mode Toggle */}
        <div className="absolute top-8 right-8 flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
           <button 
             onClick={() => setBrainMode('cloud')}
             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${brainMode === 'cloud' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-400'}`}
           >
             Cloud Brain
           </button>
           <button 
             onClick={() => setBrainMode('local')}
             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${brainMode === 'local' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'}`}
           >
             Private Brain
           </button>
        </div>

        <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Diagnosis Center</h3>
        <p className="text-slate-500 font-bold mb-8">
          {brainMode === 'local' ? 'Running 100% Private Local Inference Engine (ALIC v4)' : 'Running Cloud-Assisted Foundation Model'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Symptom Visuals</label>
              <div className={`border-2 border-dashed rounded-[2rem] h-64 flex flex-col items-center justify-center overflow-hidden bg-slate-50`}>
                {image ? (
                  <img src={image} className="w-full h-full object-cover" alt="Symptom" />
                ) : (
                  <label className="cursor-pointer p-8 text-center">
                    <span className="text-4xl">📸</span>
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
            
            {brainMode === 'local' && (
              <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3">Local Logic Selector</label>
                <select 
                  value={symptomType}
                  onChange={e => setSymptomType(e.target.value)}
                  className="w-full bg-white p-3 rounded-xl text-sm font-bold border border-emerald-200 outline-none"
                >
                  <option value="yellow_streaks">Yellowish Streaks (Veins)</option>
                  <option value="ragged_holes">Ragged Holes in Leaves</option>
                  <option value="stunted_purple">Purplish Stunted Growth</option>
                </select>
                <p className="mt-3 text-[10px] text-emerald-700 font-bold italic opacity-70">"Private brain matches visual patterns to localized pathology records."</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6 justify-center">
             <button
              onClick={handleDiagnose}
              disabled={loading}
              className={`w-full py-6 rounded-3xl font-black text-white transition-all text-lg shadow-xl ${loading ? 'bg-slate-400' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'}`}
            >
              {loading ? 'Synthesizing...' : brainMode === 'local' ? 'Run Private Inference' : 'Consult Foundation Brain'}
            </button>
            <div className="p-6 bg-slate-900 rounded-3xl text-white">
               <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Intellectual Property Note</h4>
               <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                 Using <strong>Private Brain</strong> ensures you own the logic. The data stays in your codebase and does not transit to external AI providers.
               </p>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="animate-slideUp bg-white rounded-[3rem] p-10 border border-slate-200 shadow-2xl">
           <div className="flex items-center gap-6 mb-8">
              <div className="text-5xl">🌱</div>
              <div>
                <h4 className="text-3xl font-black text-slate-900">{result.name}</h4>
                <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">{brainMode === 'local' ? 'Verified Local Record' : 'Inferred Cloud Result'}</span>
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Sustainable Protocol</h5>
                <p className="text-slate-800 font-bold leading-relaxed">{result.treatmentOrganic}</p>
              </div>
              <div className="bg-emerald-950 text-white p-8 rounded-[2rem]">
                <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">Foundation Prevention</h5>
                <p className="text-emerald-50 font-bold leading-relaxed">{result.prevention}</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CropDiagnosis;
