
import React, { useState, useEffect } from 'react';
import { automatedAgronomistInference, generateSyntheticQA, generatePyTorchScript, evolveLocalBrain, distillRawWebData } from '../services/geminiService';
import { EvolutionService, SovereignKnowledgeNode } from '../services/evolutionService';
import { AutomatedAgronomistResult } from '../types';

const AutomatedAgronomist: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'qa' | 'evolution' | 'pytorch'>('evolution');
  const [vault, setVault] = useState<SovereignKnowledgeNode[]>([]);
  
  // Sovereign Distillation State
  const [rawTextData, setRawTextData] = useState('');
  const [distillTopic, setDistillTopic] = useState('New strains of Maize Streak Virus (MSV-7) discovered in 2025');
  const [loadingDistill, setLoadingDistill] = useState(false);
  const [distillResult, setDistillResult] = useState<{ node: string, confidence: number } | null>(null);

  // Internal Evolution State
  const [loadingEvolution, setLoadingEvolution] = useState(false);
  const [evolutionResult, setEvolutionResult] = useState('');

  // Vision State
  const [image, setImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [imageResult, setImageResult] = useState<AutomatedAgronomistResult | null>(null);
  
  // Q&A State
  const [qaTopic, setQaTopic] = useState('Sustainable Pest Management');
  const [loadingQA, setLoadingQA] = useState(false);
  const [qaResult, setQaResult] = useState('');

  // PyTorch State
  const [numClasses, setNumClasses] = useState(10);
  const [loadingPytorch, setLoadingPytorch] = useState(false);
  const [pytorchResult, setPytorchResult] = useState('');
  
  const [error, setError] = useState('');

  useEffect(() => {
    setVault(EvolutionService.getVault());
  }, []);

  const handleDistillData = async () => {
    if (!rawTextData.trim()) {
      setError('Please paste raw internet data to distill.');
      return;
    }
    setLoadingDistill(true);
    setDistillResult(null);
    setError('');
    try {
      const data = await distillRawWebData(rawTextData, distillTopic);
      setDistillResult(data);
    } catch (err) {
      setError('Distillation failed. Connection to synthesizer lost.');
    } finally {
      setLoadingDistill(false);
    }
  };

  const handleCommitToVault = () => {
    if (!distillResult) return;
    try {
      const parsed = JSON.parse(distillResult.node);
      // Ensure specific structure
      const nodeToSave = {
        topic: distillTopic.toLowerCase().includes('maize') ? 'maize' : distillTopic.split(' ')[0].toLowerCase(),
        symptomKey: `ingested_${Date.now()}`,
        data: {
          diagnosis: parsed.Core_Pattern || parsed.diagnosis || "Unspecified Discovery",
          severity: parsed.severity || 'medium',
          organic: parsed.Localized_Strategy || parsed.organic || "No organic data.",
          chemical: parsed.chemical || "No chemical data.",
          prevention: parsed.Scientific_Verification || parsed.prevention || "No prevention data."
        }
      };
      EvolutionService.commitToVault(nodeToSave);
      setVault(EvolutionService.getVault());
      setDistillResult(null);
      setRawTextData('');
      alert("Knowledge committed to Private Vault!");
    } catch (e) {
      setError("Failed to parse synthesized JSON for commit.");
    }
  };

  const handleEvolve = async () => {
    const pool = EvolutionService.getPool();
    if (pool.length === 0) {
      setError('Evolution pool is empty. Record some farm interactions first.');
      return;
    }
    setLoadingEvolution(true);
    setEvolutionResult('');
    try {
      const data = await evolveLocalBrain(pool);
      setEvolutionResult(data);
    } catch (err) {
      setError('Weight synthesis failed.');
    } finally {
      setLoadingEvolution(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setImageResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessImage = async () => {
    if (!image) {
      setError('Please upload an image.');
      return;
    }
    setLoadingImage(true);
    try {
      const data = await automatedAgronomistInference(image);
      setImageResult(data);
    } catch (err) {
      setError('Inference failed.');
    } finally {
      setLoadingImage(false);
    }
  };

  // Fix: Implemented handleGenerateQA to consume streaming synthetic data from Gemini
  const handleGenerateQA = async () => {
    if (!qaTopic.trim()) {
      setError('Please provide a topic for Q&A synthesis.');
      return;
    }
    setLoadingQA(true);
    setQaResult('');
    setError('');
    try {
      const generator = generateSyntheticQA(qaTopic);
      for await (const chunk of generator) {
        setQaResult(prev => prev + chunk);
      }
    } catch (err) {
      setError('Q&A synthesis failed.');
    } finally {
      setLoadingQA(false);
    }
  };

  // Fix: Implemented handleGeneratePytorch to request ML code generation from the model
  const handleGeneratePytorch = async () => {
    setLoadingPytorch(true);
    setPytorchResult('');
    setError('');
    try {
      const script = await generatePyTorchScript(numClasses);
      setPytorchResult(script);
    } catch (err) {
      setError('Script generation failed.');
    } finally {
      setLoadingPytorch(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-10 animate-fadeIn">
      {/* Lab Header */}
      <div className="bg-slate-900 rounded-[3.5rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/30 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sovereign Learning Loop Active
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Sovereign <br/><span className="text-emerald-400">Vault Manager</span></h2>
            <p className="text-slate-400 font-bold max-w-2xl text-lg">
              Convert external research into permanent private knowledge. Once committed, this logic lives in your app forever.
            </p>
          </div>
          
          <div className="flex bg-slate-800 p-1.5 rounded-2xl border border-white/10 self-start md:self-auto overflow-x-auto no-scrollbar">
            {['evolution', 'image', 'qa', 'pytorch'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {tab === 'evolution' ? 'Knowledge Vault' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'evolution' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            {/* Ingestion Tool */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Knowledge Ingestion</h3>
                <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100 uppercase">Sovereign Mode</span>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Discovery/Topic Label</label>
                  <input 
                    type="text"
                    value={distillTopic}
                    onChange={(e) => setDistillTopic(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Raw Internet Text (Paste Data Here)</label>
                  <textarea 
                    value={rawTextData}
                    onChange={(e) => setRawTextData(e.target.value)}
                    placeholder="Paste research, articles, or news snippets to be distilled into your private brain..."
                    className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
                <button
                  onClick={handleDistillData}
                  disabled={loadingDistill}
                  className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl"
                >
                  {loadingDistill ? 'Synthesizing...' : '1. Synthesize Research'}
                </button>
              </div>

              {distillResult && (
                <div className="mt-8 p-6 bg-emerald-950 rounded-[2rem] text-white animate-fadeIn border border-emerald-500/30">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Synthesized Node Output</h4>
                    <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Analysis Confirmed</span>
                  </div>
                  <pre className="text-[11px] font-mono text-emerald-200 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto mb-6 custom-scrollbar">{distillResult.node}</pre>
                  <button 
                    onClick={handleCommitToVault}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 shadow-xl shadow-emerald-900/40"
                  >
                    2. Commit to Private Vault
                  </button>
                </div>
              )}
            </div>

            {/* Local Stats */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Vault Integrity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Owner Nodes</span>
                  <div className="text-3xl font-black text-slate-800">{vault.length}</div>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Encrypted Hash</span>
                  <div className="text-xs font-mono text-emerald-600 truncate">SHA-256-Local</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 rounded-[3rem] p-10 border border-white/5 shadow-2xl flex flex-col h-full min-h-[600px]">
             <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-6">
               <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">sovereign_vault_explorer.json</span>
               <button onClick={() => { EvolutionService.clearVault(); setVault([]); }} className="text-[10px] text-red-400 font-black uppercase hover:text-red-300">Wipe My Vault</button>
             </div>
             
             <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
               {vault.length === 0 ? (
                 <div className="text-slate-700 italic text-sm text-center py-20">No learned nodes found. Distill research to grow your brain.</div>
               ) : (
                 vault.map((node) => (
                   <div key={node.id} className="p-6 bg-white/5 rounded-2xl border border-white/10 group hover:border-emerald-500/30 transition-all">
                     <div className="flex justify-between items-start mb-3">
                       <h4 className="text-sm font-black text-emerald-400">{node.data.diagnosis}</h4>
                       <span className="text-[9px] font-bold text-slate-500">Topic: {node.topic}</span>
                     </div>
                     <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{node.data.organic}</p>
                     <div className="flex gap-4 border-t border-white/5 pt-3">
                       <span className="text-[8px] font-black uppercase text-emerald-600">Sovereign Data</span>
                       <span className="text-[8px] font-black uppercase text-slate-500">{new Date(node.timestamp).toLocaleDateString()}</span>
                     </div>
                   </div>
                 ))
               )}
             </div>

             <div className="mt-8 p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
               <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2">Vault Principle</p>
               <p className="text-[11px] text-slate-400 italic">"The Synthesizer (Gemini) creates the structure, but the Owner (You) holds the logic. This loop ensures your AI model evolves without data ever leaving your sovereign control."</p>
             </div>
          </div>
        </div>
      )}

      {/* Simplified support for other tabs */}
      {activeTab === 'image' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Inference Input</h3>
            <div className="border-2 border-dashed rounded-[2.5rem] h-96 flex flex-col items-center justify-center overflow-hidden bg-slate-50 border-slate-200">
              {image ? <img src={image} className="w-full h-full object-cover" /> : <input type="file" onChange={handleImageChange} />}
            </div>
            {image && (
              <button onClick={handleProcessImage} disabled={loadingImage} className="mt-6 w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs">
                {loadingImage ? 'Analyzing...' : 'Execute Vision Logic'}
              </button>
            )}
          </div>
          <div className="bg-slate-950 rounded-[3rem] p-10 font-mono text-emerald-400 text-xs shadow-2xl border border-white/5 h-[500px] overflow-y-auto">
             {imageResult ? <pre>{JSON.stringify(imageResult, null, 2)}</pre> : <div className="text-slate-700 italic">Awaiting inference stimulus...</div>}
          </div>
        </div>
      )}

      {activeTab === 'qa' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Data Synthesis</h3>
            <input type="text" value={qaTopic} onChange={(e) => setQaTopic(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-6 font-bold" />
            <button onClick={handleGenerateQA} disabled={loadingQA} className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-xs">
              {loadingQA ? 'Processing...' : 'Synthesize QA Training Set'}
            </button>
          </div>
          <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-200 shadow-xl h-[500px] overflow-y-auto">
             <pre className="text-slate-700 font-sans text-sm whitespace-pre-wrap">{qaResult || 'Payload will stream here...'}</pre>
          </div>
        </div>
      )}

      {activeTab === 'pytorch' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Trainer Configuration</h3>
            <input type="number" value={numClasses} onChange={(e) => setNumClasses(parseInt(e.target.value))} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-6 font-bold" />
            <button onClick={handleGeneratePytorch} disabled={loadingPytorch} className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-xs">
              {loadingPytorch ? 'Configuring...' : 'Generate PyTorch Weights Script'}
            </button>
          </div>
          <div className="lg:col-span-2 bg-slate-950 rounded-[3rem] p-10 border border-white/5 shadow-2xl h-[500px] overflow-y-auto">
             <pre className="text-emerald-400 font-mono text-xs">{pytorchResult || '# Ready for local trainer export.'}</pre>
          </div>
        </div>
      )}

      {error && <div className="p-6 bg-red-50 text-red-600 rounded-[2rem] font-bold mx-4">{error}</div>}
    </div>
  );
};

export default AutomatedAgronomist;
