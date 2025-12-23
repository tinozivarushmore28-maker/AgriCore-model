
import React, { useState } from 'react';
import { EvolutionService } from '../services/evolutionService';
import { FailureReason } from '../types';

interface FeedbackFormProps {
  type: 'crop' | 'livestock' | 'soil' | 'weather' | 'chat';
  context?: string;
  originalInput?: string;
  originalOutput?: any;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ type, context, originalInput, originalOutput }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [failureReason, setFailureReason] = useState<FailureReason>('unknown');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    EvolutionService.recordInteraction(
      originalInput || context || "Manual Feedback",
      originalOutput || {},
      rating,
      comment,
      rating <= 2 ? failureReason : undefined
    );
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center animate-fadeIn">
        <span className="text-2xl mb-2 block">🧠</span>
        <h5 className="font-bold text-emerald-800">Knowledge Registered!</h5>
        <p className="text-xs text-emerald-600">The brain is analyzing this feedback to grow its local logic.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t border-slate-100 pt-6">
      <h5 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
        <span className="p-1.5 bg-emerald-100 rounded-lg">💡</span> Was this recommendation accurate?
      </h5>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl transition-all hover:scale-125 ${rating >= star ? 'grayscale-0' : 'grayscale opacity-20'}`}
            >
              ⭐
            </button>
          ))}
        </div>

        {rating > 0 && rating <= 2 && (
          <div className="animate-fadeIn p-4 bg-red-50 border border-red-100 rounded-2xl space-y-3">
             <label className="text-[10px] font-black text-red-600 uppercase tracking-widest">Failure Diagnosis: Why did it fail?</label>
             <select 
              value={failureReason} 
              onChange={e => setFailureReason(e.target.value as FailureReason)}
              className="w-full bg-white p-3 rounded-xl border border-red-200 text-xs font-bold outline-none"
             >
                <option value="unknown">Unknown / Mixed</option>
                <option value="weather">Weather Patterns (Rain/Heat)</option>
                <option value="soil">Soil Conditions (PH/Nutrients)</option>
                <option value="timing">Incorrect Timing (Phase)</option>
                <option value="pests">Pest Resistance / New strain</option>
                <option value="practice">Inconsistent Application</option>
             </select>
          </div>
        )}
        
        <div className="flex gap-3">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Help me learn! What did I miss?"
            className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500 shadow-inner"
          />
          <button
            type="submit"
            disabled={rating === 0}
            className="px-8 py-2 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
          >
            Teach Brain
          </button>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 italic">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
          Self-Learning Protocol v7 enabled. Feedback is distilled into Private weights.
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
