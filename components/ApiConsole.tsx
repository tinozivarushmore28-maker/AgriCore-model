
import React, { useState, useEffect } from 'react';
import { ApiKeyRecord } from '../types';

const ApiConsole: React.FC = () => {
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [showDoc, setShowDoc] = useState<'python' | 'curl' | 'js'>('python');

  useEffect(() => {
    const savedKeys = localStorage.getItem('agricore_api_keys');
    if (savedKeys) {
      setKeys(JSON.parse(savedKeys));
    } else {
      const initial = [{
        id: '1',
        name: 'Farmer Mobile App v1',
        key: 'sk_live_67890abcdef12345',
        created: new Date().toLocaleDateString(),
        usage: 1245,
        status: 'active' as const
      }];
      setKeys(initial);
      localStorage.setItem('agricore_api_keys', JSON.stringify(initial));
    }
  }, []);

  const generateKey = () => {
    if (!newKeyName.trim()) return;
    const newKey: ApiKeyRecord = {
      id: Math.random().toString(36).substr(2, 9),
      name: newKeyName,
      key: `sk_live_${Math.random().toString(36).substr(2, 16)}`,
      created: new Date().toLocaleDateString(),
      usage: 0,
      status: 'active'
    };
    const updated = [...keys, newKey];
    setKeys(updated);
    localStorage.setItem('agricore_api_keys', JSON.stringify(updated));
    setNewKeyName('');
  };

  const revokeKey = (id: string) => {
    const updated = keys.map(k => k.id === id ? { ...k, status: 'revoked' as const } : k);
    setKeys(updated);
    localStorage.setItem('agricore_api_keys', JSON.stringify(updated));
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-10 animate-fadeIn">
      {/* Console Header */}
      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/30 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            Production API Gateway Active
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">API Management <br/><span className="text-emerald-400">Console</span></h2>
          <p className="text-slate-400 font-bold max-w-2xl text-lg">
            Your Production Gateway is now live. Use these keys to authenticate external apps against your <code>main.py</code> inference engine.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-8 text-[120px] opacity-[0.03] font-black pointer-events-none uppercase">Gateway</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] p-8 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-800">Live API Credentials</h3>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="App name..." 
                  className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-sm outline-none focus:border-emerald-500"
                />
                <button 
                  onClick={generateKey}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all"
                >
                  + Create Key
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Name</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Key (Secret)</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Inferences</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {keys.map((k) => (
                    <tr key={k.id} className={`group ${k.status === 'revoked' ? 'opacity-40' : ''}`}>
                      <td className="py-5 font-bold text-slate-800 text-sm">{k.name}</td>
                      <td className="py-5 font-mono text-[11px] text-slate-500">
                        {k.status === 'revoked' ? '••••••••••••••••' : k.key}
                      </td>
                      <td className="py-5 text-sm font-bold text-slate-600">{k.usage.toLocaleString()}</td>
                      <td className="py-5">
                        {k.status === 'active' ? (
                          <button 
                            onClick={() => revokeKey(k.id)}
                            className="text-[10px] text-red-500 font-black uppercase tracking-widest hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-100"
                          >
                            Revoke
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Disabled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black">Gateway Integration Docs</h3>
              <div className="flex bg-white/5 p-1 rounded-xl">
                {['python', 'curl', 'js'].map((lang) => (
                  <button 
                    key={lang}
                    onClick={() => setShowDoc(lang as any)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${showDoc === lang ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="font-mono text-sm space-y-6">
              {showDoc === 'python' && (
                <pre className="text-emerald-400 overflow-x-auto no-scrollbar whitespace-pre-wrap leading-relaxed">
{`import requests

# Production Gateway URL (from Docker deploy)
BASE_URL = "http://your-server-ip:8080"
API_KEY = "sk_live_..."

def diagnose_crop(image_path, crop="Maize"):
    with open(image_path, "rb") as f:
        response = requests.post(
            f"{BASE_URL}/v3/predict/crop",
            headers={"X-API-Key": API_KEY},
            files={"file": f},
            data={"crop_type": crop, "region": "Zimbabwe"}
        )
    return response.json()

result = diagnose_crop("leaf_sample.jpg")
print(f"AI Prediction: {result['diagnosis']}")`}
                </pre>
              )}
              {showDoc === 'curl' && (
                <pre className="text-emerald-400 overflow-x-auto no-scrollbar whitespace-pre-wrap leading-relaxed">
{`curl -X POST "http://your-server-ip:8080/v3/predict/crop" \\
  -H "X-API-Key: sk_live_your_key_here" \\
  -F "file=@/path/to/crop.jpg" \\
  -F "crop_type=Maize"`}
                </pre>
              )}
              {showDoc === 'js' && (
                <pre className="text-emerald-400 overflow-x-auto no-scrollbar whitespace-pre-wrap leading-relaxed">
{`const gatewayUrl = 'http://your-server-ip:8080/v3/predict/crop';

async function callGateway(imageBlob) {
  const body = new FormData();
  body.append('file', imageBlob);
  body.append('crop_type', 'Maize');

  const res = await fetch(gatewayUrl, {
    method: 'POST',
    headers: { 'X-API-Key': 'sk_live_...' },
    body
  });
  
  return await res.json();
}`}
                </pre>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Gateway Health</h4>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-sm font-black text-slate-800">Uptime</span>
                <span className="text-2xl font-black text-emerald-600">99.9%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '99.9%' }}></div>
              </div>
              
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div className="text-[10px] font-black text-emerald-700 uppercase">Status</div>
                <div className="text-xs font-bold text-emerald-900">Online & Scaling</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 p-8 rounded-[3rem] text-white shadow-xl">
             <h5 className="text-xs font-black uppercase tracking-widest mb-4">Deployment Instructions</h5>
             <ol className="text-[11px] font-bold space-y-3 opacity-90 list-decimal pl-4">
               <li>Set your Gemini API_KEY in the Docker environment.</li>
               <li>Build: <code>docker build -t agricore-gateway .</code></li>
               <li>Run: <code>docker run -p 8080:8080 -e API_KEY=... agricore-gateway</code></li>
               <li>Expose port 8080 to the internet.</li>
             </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiConsole;
