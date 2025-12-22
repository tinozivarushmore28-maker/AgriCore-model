
import React, { useState } from 'react';

interface FeedbackFormProps {
  type: 'crop' | 'livestock' | 'soil' | 'weather' | 'chat';
  context?: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ type, context }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const feedback = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      rating,
      comment,
      timestamp: Date.now(),
      context
    };
    
    // Simulate API call to save feedback for retraining
    const existing = JSON.parse(localStorage.getItem('agricore_feedback') || '[]');
    localStorage.setItem('agricore_feedback', JSON.stringify([...existing, feedback]));
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center animate-fadeIn">
        <span className="text-2xl mb-2 block">🙏</span>
        <h5 className="font-bold text-emerald-800">Thank you!</h5>
        <p className="text-xs text-emerald-600">Your feedback helps improve our global farming model.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t border-slate-100 pt-6">
      <h5 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
        <span>💡</span> Was this recommendation accurate?
      </h5>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl transition-transform hover:scale-110 ${rating >= star ? 'grayscale-0' : 'grayscale opacity-30'}`}
            >
              ⭐
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us why it was (or wasn't) helpful..."
            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={rating === 0}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
        <p className="text-[10px] text-slate-400 italic">This feedback is used to fine-tune our regional agricultural models.</p>
      </form>
    </div>
  );
};

export default FeedbackForm;
