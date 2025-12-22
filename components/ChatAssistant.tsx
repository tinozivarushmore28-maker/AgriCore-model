
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am AgriCore, your global farming foundation model. I can assist with crops, soil, weather, or livestock. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: `You are AgriCore, the world's most advanced AI farming foundation model. 
          Your intelligence spans:
          1. Crop Pathology (leaf, fruit, stem diagnosis).
          2. Livestock Veterinary Intelligence (Always disclaimer: AI guidance only).
          3. Soil Science (ISRIC/FAO grounded).
          4. Weather-Aware Reasoning (Global calendars).
          
          Respond as an expert agricultural extension agent. Be practical, localized, and concise. 
          Support multilingual queries including regional languages (Shona, Swahili) if requested.`
        }
      });
      
      const response = await chat.sendMessage({ message: userText });
      const modelResponse = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'model', text: modelResponse }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: 'Foundation server connection error. Please retry.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-14rem)] flex flex-col bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn">
      <div className="p-8 bg-emerald-950 text-white flex items-center justify-between border-b border-emerald-900">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-14 h-14 bg-emerald-400 rounded-2xl flex items-center justify-center text-3xl shadow-lg rotate-6">🚜</div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-emerald-950 animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-black text-xl tracking-tight">AgriCore Brain</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">Foundation Model • v3.1</span>
              <span className="text-[10px] text-emerald-400/40 uppercase tracking-widest font-black">• Multilingual</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => speak(messages[messages.length - 1]?.text)}
            className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10"
            title="Listen"
          >
            🔊
          </button>
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
              {msg.role === 'model' && i === messages.length - 1 && (
                <button 
                  onClick={() => speak(msg.text)} 
                  className="block mt-4 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
                >
                  🔊 Read Response
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white px-8 py-5 rounded-[2rem] rounded-tl-none border border-slate-100 flex gap-2 items-center">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce"></div>
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <span className="text-xs font-black text-slate-400 ml-3 uppercase tracking-widest">Synthesizing Advice...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-slate-100 bg-white">
        <div className="flex gap-4 items-center">
          <div className="flex-1 flex gap-3 bg-slate-100 p-2.5 rounded-[2.5rem] border-2 border-transparent focus-within:border-emerald-500 transition-all shadow-inner">
            <button 
              onClick={startListening}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-slate-400 hover:text-emerald-600'}`}
              title="Voice Input"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 00-3 3v8a3 3 0 006 0V5a3 3 0 00-3-3z" /></svg>
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask the Foundation Brain (e.g. Why are my leaves yellow?)"
              className="flex-1 px-4 py-3 bg-transparent text-[15px] font-bold outline-none placeholder:text-slate-400"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="w-14 h-14 bg-emerald-950 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-800 transition-all shadow-xl disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
        <div className="flex justify-center gap-6 mt-6">
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em]">Voice Active</div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em]">Text Active</div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em]">Multilingual Support</div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
