
import React, { useState, useRef, useEffect } from 'react';
import { performSearchAugmentedResearch } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am AgriCore. I have been updated with Search-Augmented Learning capabilities. I can now research the latest global reports and compare them with my internal clusters. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResearchMode, setIsResearchMode] = useState(false);
  const [regionContext, setRegionContext] = useState('Southern Africa (ZWE)');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      if (isResearchMode) {
        const research = await performSearchAugmentedResearch(userText, regionContext);
        setMessages(prev => [...prev, { role: 'model', text: research.text }]);
        // Optionally show sources in a separate UI block or append
      } else {
        // Standard chat logic (existing)
        const ai = new (await import("@google/genai")).GoogleGenAI({ apiKey: process.env.API_KEY });
        const chat = ai.chats.create({
          model: 'gemini-3-pro-preview',
          config: {
            systemInstruction: `You are AgriCore, a search-augmented farming model. 
            Identify the user's region: ${regionContext}. 
            Adjust advice based on their climate and regional practices. 
            Discard outdated or irrelevant methods.`
          }
        });
        const response = await chat.sendMessage({ message: userText });
        setMessages(prev => [...prev, { role: 'model', text: response.text || "Processing error." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: 'Brain link error. Retrying neural path...' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-14rem)] flex flex-col bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn">
      <div className="p-8 bg-emerald-950 text-white flex flex-col gap-4 border-b border-emerald-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-emerald-400 rounded-2xl flex items-center justify-center text-3xl shadow-lg">🤖</div>
            <div>
              <h3 className="font-black text-xl tracking-tight">AgriCore Brain</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">Search-Augmented • v4.0</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Deep Research</span>
            <button 
              onClick={() => setIsResearchMode(!isResearchMode)}
              className={`w-12 h-6 rounded-full transition-all relative ${isResearchMode ? 'bg-emerald-500' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isResearchMode ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>
        </div>
        <div className="flex gap-4">
           <select 
             value={regionContext} 
             onChange={e => setRegionContext(e.target.value)}
             className="bg-emerald-900/50 border border-emerald-500/20 rounded-xl px-4 py-1 text-[10px] font-black uppercase text-emerald-400 outline-none"
           >
             <option>Southern Africa (ZWE)</option>
             <option>West Africa (NGA)</option>
             <option>Europe (FRA)</option>
             <option>North America (USA)</option>
             <option>South Asia (IND)</option>
           </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/20" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}>
            <div className={`
              max-w-[85%] px-8 py-5 rounded-[2.5rem] text-[15px] font-bold leading-relaxed shadow-sm
              ${msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none shadow-emerald-100' 
                : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white px-8 py-5 rounded-[2rem] rounded-tl-none border border-slate-100 flex gap-2 items-center">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce"></div>
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <span className="text-xs font-black text-slate-400 ml-3 uppercase tracking-widest">
                {isResearchMode ? 'Researching Web Clusters...' : 'Synthesizing Advice...'}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-slate-100 bg-white">
        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isResearchMode ? "Run deep grounded research..." : "Ask the Foundation Brain..."}
            className="flex-1 px-8 py-4 bg-slate-100 rounded-[2.5rem] text-[15px] font-bold outline-none border-2 border-transparent focus:border-emerald-500 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-14 h-14 bg-emerald-950 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-800 transition-all shadow-xl"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
