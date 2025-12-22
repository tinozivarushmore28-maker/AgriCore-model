
import React, { useState } from 'react';
import { diagnoseLivestock } from '../services/geminiService';
import { DiagnosisResult } from '../types';
import { regionalDatabase } from '../services/regionalDatabase';
import FeedbackForm from './FeedbackForm';

const LivestockHealth: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState('');
  const [animalType, setAnimalType] = useState('Cattle');
  const [animalAge, setAnimalAge] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(regionalDatabase[0].region);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image && !symptoms) {
      setError('Please provide an image or symptoms of the animal.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const meta = `${animalType}, Age: ${animalAge}`;
      const regionalData = regionalDatabase.find(r => r.region === selectedRegion);
      const data = await diagnoseLivestock(image || "", symptoms, meta, regionalData);
      setResult(data);
    } catch (err) {
      setError('Analysis failed. Foundation model connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-10 animate-fadeIn">
      <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-6 mb-10">
          <div className="bg-amber-100 w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner shadow-amber-200/50">🐄</div>
          <div>
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">Livestock Diagnostics</h3>
            <p className="text-slate-500 font-medium italic">Grounded in OIE & Global Veterinary Handbooks.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
             <div className={`
              border-2 border-dashed rounded-[2.5rem] h-80 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden
              ${image ? 'border-amber-200 bg-amber-50' : 'border-slate-200 hover:border-amber-300'}
            `}>
              {image ? (
                <img src={image} className="w-full h-full object-cover" alt="Animal" />
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-8 text-center group">
                  <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">📸</span>
                  <span className="text-sm font-bold text-slate-600">Snap image of animal or visible symptoms</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </div>
            {image && (
              <button onClick={() => setImage(null)} className="text-xs text-red-500 font-black uppercase tracking-widest hover:underline px-2">Remove Image</button>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Animal Type</label>
                <select 
                  value={animalType} 
                  onChange={e => setAnimalType(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-amber-500"
                >
                  <option>Cattle</option>
                  <option>Goats</option>
                  <option>Sheep</option>
                  <option>Poultry</option>
                  <option>Swine</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Regional Data</label>
                <select 
                  value={selectedRegion} 
                  onChange={e => setSelectedRegion(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-amber-500"
                >
                  {regionalDatabase.map(r => (
                    <option key={r.region} value={r.region}>{r.region}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Symptom Logic (Text/Voice)</label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe behavioral changes, sores, or symptoms..."
                className="w-full h-32 p-5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none text-[15px] font-medium resize-none"
              />
              <input 
                type="text"
                placeholder="Age of animal (e.g. 18 months)"
                value={animalAge}
                onChange={e => setAnimalAge(e.target.value)}
                className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-amber-500"
              />
            </div>
            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className={`
                mt-4 w-full py-5 rounded-3xl font-black text-white transition-all text-base shadow-xl
                ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-100'}
              `}
            >
              {loading ? 'Consulting OIE & WHO Nodes...' : 'Inference Veterinary Advice'}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-[3rem] border border-amber-100 shadow-2xl overflow-hidden animate-slideUp">
          <div className={`p-8 md:p-12 flex items-center justify-between border-b ${result.urgency?.toLowerCase() === 'high' ? 'bg-red-50' : 'bg-amber-50'}`}>
            <div className="flex gap-6 items-center">
              <div className="text-5xl">🐄</div>
              <div>
                <h4 className="text-3xl font-black text-slate-900 leading-tight">{result.name}</h4>
                <div className="flex gap-3 mt-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] bg-white text-amber-800 px-3 py-1 rounded-full shadow-sm">Probable Illness</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                    Localization Active
                  </span>
                </div>
              </div>
            </div>
            <div className={`px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest shadow-sm ${
              result.urgency?.toLowerCase() === 'high' ? 'bg-red-600 text-white' : 'bg-amber-200 text-amber-800'
            }`}>
              {result.urgency} Urgency
            </div>
          </div>
          
          <div className="p-8 md:p-12 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] mb-4">First-Aid Protocols</h5>
                  <div className="p-8 bg-red-50 rounded-[2.5rem] border border-red-100">
                    <p className="text-slate-800 leading-relaxed text-[15px] font-medium">{result.firstAid}</p>
                  </div>
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] mb-4">Vet Intervention Triggers</h5>
                  <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200">
                    <p className="text-slate-700 leading-relaxed text-[15px] italic font-medium">"{result.vetCall}"</p>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div>
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] mb-4">Feeding & Care Protocol</h5>
                  <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100">
                    <p className="text-slate-800 leading-relaxed text-[15px] font-medium">{result.feedingAndCare}</p>
                  </div>
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] mb-4">Pathogen Logic</h5>
                  <p className="text-slate-600 leading-relaxed text-[15px] font-medium">{result.causeDescription}</p>
                </div>
              </div>
            </div>

            <FeedbackForm type="livestock" context={`Livestock Diagnosis: ${result.name} in ${selectedRegion}`} />

            <div className="p-6 bg-slate-900 rounded-3xl text-white flex items-start gap-5 shadow-xl">
              <span className="text-3xl">⚠️</span>
              <div>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Inference Disclaimer</p>
                <p className="text-[13px] text-slate-300 font-medium leading-relaxed">
                  "AI guidance, not a vet replacement." This report is synthesized by the AgriCore Foundation Model using internet-scale veterinary data. Consult a local professional for surgical or high-risk cases.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivestockHealth;
