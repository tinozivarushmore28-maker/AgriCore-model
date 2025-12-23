
import React, { useState } from 'react';
import { diagnoseLivestock, diagnoseLivestockWithSearch } from '../services/geminiService';
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
  const [sources, setSources] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleAnalyze = async (withSearch: boolean = false) => {
    if (!image && !symptoms) {
      setError('Please provide an image or symptoms.');
      return;
    }
    setLoading(true);
    setError('');
    setSources([]);
    try {
      const meta = `${animalType}, Age: ${animalAge}, Region: ${selectedRegion}`;
      if (withSearch) {
        const data = await diagnoseLivestockWithSearch(image || "", symptoms, meta);
        setResult(data.diagnosis);
        setSources(data.sources);
      } else {
        const data = await diagnoseLivestock(image || "", symptoms, meta);
        setResult(data);
      }
    } catch (err) {
      setError('Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-10 animate-fadeIn">
      <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-200 shadow-sm">
        <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-8">Vet Intelligence</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
             <div className="border-2 border-dashed rounded-[2.5rem] h-80 flex items-center justify-center overflow-hidden bg-slate-50 border-slate-200">
              {image ? <img src={image} className="w-full h-full object-cover" /> : <input type="file" onChange={e => {
                const f = e.target.files?.[0];
                if(f){ const r = new FileReader(); r.onload = () => setImage(r.result as string); r.readAsDataURL(f); }
              }} />}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <textarea
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
              placeholder="Symptoms..."
              className="w-full h-32 p-5 rounded-2xl border border-slate-200 text-sm"
            />
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleAnalyze(false)} disabled={loading} className="py-4 bg-amber-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg">Local Core</button>
              <button onClick={() => handleAnalyze(true)} disabled={loading} className="py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg">Global Search</button>
            </div>
            {error && <p className="text-red-500 text-[10px] font-bold text-center">{error}</p>}
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden animate-slideUp">
          <div className="p-10">
            <h4 className="text-2xl font-black mb-4">{result.name}</h4>
            <p className="text-slate-600 leading-relaxed mb-8">{result.causeDescription}</p>
            
            {sources.length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Grounded Epidemic Sources</h5>
                <div className="flex flex-wrap gap-2">
                  {sources.map((s, idx) => (
                    <a key={idx} href={s.web?.uri} target="_blank" className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100">{s.web?.title}</a>
                  ))}
                </div>
              </div>
            )}
            <FeedbackForm type="livestock" context={result.name} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LivestockHealth;
