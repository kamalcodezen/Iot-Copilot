'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export default function SuggestedQuestions({ questions, onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 p-1.5">
          <Sparkles size={13} className="text-accent" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wide text-text-tertiary">Suggested questions</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {questions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            className="px-4 py-2 rounded-xl font-bold bg-bg-surface border border-border-default text-sm text-text-secondary hover:text-accent hover:border-accent/30 hover:-translate-y-0.5 transition-all shadow-elevation-low"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
