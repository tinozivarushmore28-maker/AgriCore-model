
import React, { useState, useRef, useEffect } from 'react';
import { connectToFieldLive } from '../services/geminiService';

const LiveFieldAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [status, setStatus] = useState('Standby');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const sessionRef = useRef<any>(null);

  const decodeAudio = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  const startSession = async () => {
    try {
      setStatus('Connecting...');
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = connectToFieldLive({
        onopen: () => {
          setStatus('Listening');
          setIsActive(true);
          const source = inputCtx.createMediaStreamSource(stream);
          const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              int16[i] = inputData[i] * 32768;
            }
            const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
            sessionPromise.then(session => {
              session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
            });
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(inputCtx.destination);
        },
        onmessage: async (msg: any) => {
          if (msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
            const audioData = decodeAudio(msg.serverContent.modelTurn.parts[0].inlineData.data);
            const buffer = await decodeAudioData(audioData, audioContextRef.current!);
            const source = audioContextRef.current!.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current!.destination);
            
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContextRef.current!.currentTime);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
          }
          
          if (msg.serverContent?.outputTranscription) {
            setTranscription(prev => [...prev, `AI: ${msg.serverContent.outputTranscription.text}`].slice(-5));
          }
          if (msg.serverContent?.inputTranscription) {
            setTranscription(prev => [...prev, `You: ${msg.serverContent.inputTranscription.text}`].slice(-5));
          }
        },
        onerror: () => setStatus('Error'),
        onclose: () => {
          setIsActive(false);
          setStatus('Closed');
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Failed');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      setIsActive(false);
      setStatus('Standby');
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-14rem)] flex flex-col bg-slate-950 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden animate-fadeIn">
      <div className="p-10 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-emerald-950 to-slate-950">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-500 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/20 animate-pulseSlow">🛰️</div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">Live Field Link</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{status}</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={isActive ? stopSession : startSession}
          className={`px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${isActive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40'}`}
        >
          {isActive ? 'Disconnect' : 'Establish Link'}
        </button>
      </div>

      <div className="flex-1 p-10 flex flex-col justify-center items-center relative space-y-12">
        <div className="flex gap-4">
           {[...Array(5)].map((_, i) => (
             <div key={i} className={`w-2 h-16 bg-emerald-500/30 rounded-full ${isActive ? 'animate-bounce' : ''}`} style={{ animationDelay: `${i * 0.15}s` }}></div>
           ))}
        </div>
        
        <div className="max-w-xl w-full space-y-4">
          {transcription.map((t, i) => (
            <div key={i} className={`p-4 rounded-2xl text-sm font-bold ${t.startsWith('AI:') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-slate-400'}`}>
              {t}
            </div>
          ))}
          {transcription.length === 0 && (
            <div className="text-center text-slate-600 italic font-medium">
              Awaiting neural stream from field sensors...
            </div>
          )}
        </div>
      </div>

      <div className="p-8 bg-black/40 border-t border-white/5 flex items-center justify-center gap-10">
        <div className="text-center">
           <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Latency</div>
           <div className="text-xs font-bold text-white">42ms</div>
        </div>
        <div className="text-center">
           <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Encoding</div>
           <div className="text-xs font-bold text-white">PCM 16k</div>
        </div>
        <div className="text-center">
           <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Encryption</div>
           <div className="text-xs font-bold text-emerald-500 uppercase">Sovereign-S</div>
        </div>
      </div>
    </div>
  );
};

export default LiveFieldAssistant;
