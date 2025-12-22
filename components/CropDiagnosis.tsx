import React, { useState } from 'react';
import { diagnoseCrop, generateHealthyPlantImage } from '../services/geminiService';
import { DiagnosisResult } from '../types';
import { regionalDatabase } from '../services/regionalDatabase';
import FeedbackForm from './FeedbackForm';

const CropDiagnosis: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [userHealthyReference, setUserHealthyReference] = useState<string | null>(null);
  const [cropInfo, setCropInfo] = useState('');
  const [growthStage, setGrowthStage] = useState('Seedling');
  const [soilType, setSoilType] = useState('Loamy');
  const [weatherEvents, setWeatherEvents] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(regionalDatabase[0].region);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState('');
  
  const [healthyImage, setHealthyImage] = useState<string | null>(null);
  const [generatingHealthy, setGeneratingHealthy] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async () => {
    if (!image) {
      setError('Please provide an image of the symptomatic plant.');
      return;
    }
    setLoading(true);
    setError('');
    setHealthyImage(null); 
    try {
      const regionalData = regionalDatabase.find(r => r.region === selectedRegion);
      const data = await diagnoseCrop(
        image, 
        cropInfo, 
        growthStage, 
        { soilType, weatherEvents }, 
        regionalData
      );
      setResult(data);
    } catch (err) {
      setError('Failed to analyze the crop. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateHealthy = async () => {
    if (!result?.plantName) return;
    setGeneratingHealthy(true);
    try {
      const imageUrl = await generateHealthyPlantImage(result.plantName, growthStage);
      setHealthyImage(imageUrl);
    } catch (err) {
      console.error("Healthy image generation failed", err);
    } finally {
      setGeneratingHealthy(false);
    }
  };

  const resetAll = () => {
    setImage(null);
    setUserHealthyReference(null);
    setResult(null);
    setHealthyImage(null);
    setCropInfo('');
    setWeatherEvents('');
    setSoilType('Loamy');
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8 animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm">
        <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">AgriCore Crop Vision</h3>
        <p className="text-slate-500 font-bold mb-8">Identify diseases and pests using planetary-scale diagnostic models.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Field Reality (Symptomatic)</label>
              <div className={`
                border-2 border-dashed rounded-[2rem] h-64 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden shadow-inner
                ${image ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}
              `}>
                {image ? (
                  <img src={image} className="w-full h-full object-cover" alt="Symptomatic crop" />
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer group">
                    <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">📸</span>
                    <span className="text-xs font-black text-slate-600 px-4 text-center uppercase tracking-wider">Upload symptomatic part</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, setImage)} />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Local Benchmark (Your Healthy Reference)</label>
              <div className={`
                border-2 border-dashed rounded-[1.5rem] h-32 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden shadow-sm
                ${userHealthyReference ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 hover:border-emerald-200'}
              `}>
                {userHealthyReference ? (
                  <img src={userHealthyReference} className="w-full h-full object-cover opacity-80" alt="Local healthy reference" />
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer group">
                    <span className="text-2xl mb-1">🌿</span>
                    <span className="text-[10px] font-black text-slate-400 px-4 text-center uppercase tracking-tight">Add your healthy sample</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, setUserHealthyReference)} />
                  </label>
                )}
              </div>
            </div>

            {(image || userHealthyReference) && (
              <button onClick={resetAll} className="text-xs text-red-500 font-black uppercase tracking-widest hover:underline px-2">Clear Inputs</button>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 px-1">Growth Stage</label>
                <select 
                  value={growthStage} 
                  onChange={e => setGrowthStage(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500"
                >
                  <option>Seedling</option>
                  <option>Vegetative</option>
                  <option>Flowering</option>
                  <option>Fruit/Grain Set</option>
                  <option>Maturity</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 px-1">Region</label>
                <select 
                  value={selectedRegion} 
                  onChange={e => setSelectedRegion(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500"
                >
                  {regionalDatabase.map(r => (
                    <option key={r.region} value={r.region}>{r.region}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-slate-50/50 p-5 rounded-[2rem] border border-slate-100 space-y-4">
              <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.25em] px-1">Growing Environment</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 px-1">Soil Type</label>
                  <select 
                    value={soilType} 
                    onChange={e => setSoilType(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500"
                  >
                    <option>Sandy</option><option>Silty</option><option>Clay</option><option>Loamy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 px-1">Recent Weather</label>
                  <input
                    type="text"
                    value={weatherEvents}
                    onChange={(e) => setWeatherEvents(e.target.value)}
                    placeholder="e.g. Frost"
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 px-1">Crop Variety</label>
              <input
                type="text"
                value={cropInfo}
                onChange={(e) => setCropInfo(e.target.value)}
                placeholder="e.g. Heirloom Tomato"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handleDiagnose}
              disabled={loading}
              className={`
                mt-auto py-5 rounded-3xl font-black text-white transition-all text-base shadow-xl
                ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'}
              `}
            >
              {loading ? 'Synthesizing Pathogen Data...' : 'Inference Global Diagnosis'}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-8 animate-slideUp">
          <div className="bg-white rounded-[3rem] border border-emerald-100 shadow-2xl overflow-hidden">
            <div className={`p-8 md:p-12 flex items-center justify-between border-b bg-emerald-50/50`}>
              <div className="flex gap-6 items-center">
                <div className="text-5xl">🌿</div>
                <div>
                  <h4 className="text-3xl font-black text-slate-900">{result.name}</h4>
                  <div className="flex gap-3 mt-3">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white text-emerald-800 px-3 py-1 rounded-full shadow-sm">{result.plantName}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm ${
                      result.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {result.severity} severity
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12 space-y-12">
              {/* Visual Benchmark Laboratory Matrix */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">Differential Visualization Lab</h5>
                  {!healthyImage && !generatingHealthy && (
                    <button 
                      onClick={handleGenerateHealthy}
                      className="text-[10px] bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-all shadow-md font-black uppercase tracking-widest"
                    >
                      ✨ Imaging AI Health Standard
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Reality Slot */}
                  <div className="space-y-3">
                    <div className="relative rounded-[2rem] overflow-hidden border-4 border-red-50 aspect-square shadow-xl group">
                      <img src={image || ""} className="w-full h-full object-cover grayscale-[0.2] contrast-110" alt="Field Reality" />
                      <div className="absolute inset-0 bg-red-900/10 opacity-40"></div>
                      <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase shadow-lg">Field Reality</div>
                    </div>
                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Symptomatic Sample</p>
                  </div>

                  {/* Local Healthy Slot */}
                  <div className="space-y-3">
                    <div className={`relative rounded-[2rem] overflow-hidden border-4 border-emerald-50 aspect-square shadow-xl transition-all ${!userHealthyReference ? 'bg-slate-50 border-dashed border-slate-200' : ''}`}>
                      {userHealthyReference ? (
                        <>
                          <img src={userHealthyReference} className="w-full h-full object-cover" alt="Local Health" />
                          <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase shadow-lg">Local Benchmark</div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-slate-400 font-black text-center px-6 uppercase leading-relaxed opacity-60 italic">
                          <span>No Healthy local reference provided</span>
                        </div>
                      )}
                    </div>
                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Field Baseline</p>
                  </div>

                  {/* AI Standard Slot */}
                  <div className="space-y-3">
                    <div className={`relative rounded-[2rem] overflow-hidden border-4 border-blue-50 aspect-square shadow-xl transition-all ${!healthyImage && !generatingHealthy ? 'bg-slate-50 border-dashed border-slate-200' : 'bg-blue-50/50'}`}>
                      {generatingHealthy ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
                          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Generating Golden Standard...</span>
                        </div>
                      ) : healthyImage ? (
                        <>
                          <img src={healthyImage} className="w-full h-full object-cover" alt="AI Standard" />
                          <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase shadow-lg">Planetary Standard</div>
                          <div className="absolute bottom-4 right-4 bg-white/90 text-blue-900 px-2 py-1 rounded text-[8px] font-black">AI SYNTHESIZED</div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-slate-400 font-black text-center px-6 uppercase leading-relaxed opacity-60">
                          <span>Click above to visualize the healthy state</span>
                        </div>
                      )}
                    </div>
                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Foundation Benchmark</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                <div className="space-y-8">
                  <div>
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] mb-4">Etiology Report</h5>
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 shadow-inner">
                      <p className="text-slate-800 leading-relaxed text-[15px] font-medium">{result.causeDescription}</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] mb-4">Sustainable Protocol</h5>
                    <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100">
                      <p className="text-slate-800 leading-relaxed text-[15px] font-medium italic">"{result.treatmentOrganic}"</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] mb-4">Agrochemical Intervention</h5>
                    <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 shadow-sm">
                      <p className="text-slate-800 leading-relaxed text-[15px] font-medium">{result.treatmentChemical}</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] mb-4">Planetary Prevention Advice</h5>
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
                      <p className="text-emerald-50/80 leading-relaxed text-sm font-medium italic">"{result.prevention}"</p>
                    </div>
                  </div>
                </div>
              </div>

              <FeedbackForm type="crop" context={`Diagnosis: ${result.name} for ${result.plantName} in ${selectedRegion}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropDiagnosis;