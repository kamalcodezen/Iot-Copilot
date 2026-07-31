'use client';

import { motion } from 'framer-motion';
import { Lightbulb, ArrowRight, Cpu, BookOpen, Wrench, Sparkles, AlertCircle, RefreshCw, Bot } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export interface AISuggestion {
  title: string;
  description: string;
  iconType: 'book' | 'cpu' | 'wrench';
  color: 'cyan' | 'green' | 'orange';
}

interface AISuggestionsProps {
  suggestions: AISuggestion[];
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'book': return BookOpen;
    case 'cpu': return Cpu;
    case 'wrench': return Wrench;
    default: return Lightbulb;
  }
};

export default function AISuggestions({ suggestions, loading = false, error, onRetry }: AISuggestionsProps) {
  return (
    <div className="dashboard-card p-4 sm:p-5 lg:p-6 flex flex-col" role="region" aria-label="AI suggestions">
      <div className="flex items-center gap-2 mb-1">
        <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 flex items-center justify-center shrink-0">
          <Bot size={14} className="text-accent" aria-hidden="true" />
        </div>
        <h3 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-text-primary">AI Suggestions</h3>
        <Sparkles size={13} className="text-accent ml-auto animate-pulse-soft shrink-0" aria-hidden="true" />
      </div>
      <p className="text-xs text-text-tertiary font-medium mb-4">Dynamic recommendations based on your progress</p>

      <div className="flex-1 space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-skeleton h-[68px] w-full rounded-xl bg-bg-surface skeleton-shimmer" />
          ))
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-36 text-text-tertiary">
            <div className="h-10 w-10 rounded-2xl bg-warning-light flex items-center justify-center mb-3">
              <AlertCircle size={20} className="text-warning" />
            </div>
            <p className="text-sm font-bold text-text-secondary text-center px-2">{error}</p>
            {onRetry && (
              <Button variant="primary" size="sm" className="mt-3" onClick={onRetry}>
                <RefreshCw size={13} className="mr-1.5" />
                Retry
              </Button>
            )}
          </div>
        ) : suggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-36 text-text-tertiary">
            <div className="h-10 w-10 rounded-2xl bg-accent-light flex items-center justify-center mb-3">
              <Lightbulb size={20} className="text-accent/60" />
            </div>
            <p className="text-sm font-bold text-text-secondary">No suggestions yet</p>
            <p className="text-xs mt-1 font-medium text-text-muted text-center max-w-[220px]">Use AI Mentor to get personalized recommendations</p>
          </div>
        ) : (
          suggestions.map((item, index) => {
            const Icon = getIcon(item.iconType);
            return (
              <motion.div
                key={item.title + index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href="/ai-mentor"
                  className="flex items-start gap-3 p-3 rounded-2xl bg-bg-surface border border-border-default hover:bg-bg-hover hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="mt-0.5 h-8 w-8 shrink-0 rounded-xl bg-accent-light flex items-center justify-center group-hover:scale-110 transition-transform" aria-hidden="true">
                    <Icon className="h-4 w-4 text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors truncate">{item.title}</p>
                    <p className="text-xs font-medium text-text-tertiary mt-0.5 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>
                  <ArrowRight size={13} className="text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0 mt-1" aria-hidden="true" />
                </Link>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
