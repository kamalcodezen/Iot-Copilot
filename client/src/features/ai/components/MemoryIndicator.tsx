'use client';

import { Brain } from 'lucide-react';

interface MemoryIndicatorProps {
  memoryCount: number;
  lastTopic?: string;
}

export default function MemoryIndicator({ memoryCount, lastTopic }: MemoryIndicatorProps) {
  return (
    <div className="dashboard-card bg-bg-surface border border-border-default rounded-xl px-3 py-2 inline-flex items-center gap-3 shadow-elevation-low">
      <div className="rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 p-1.5">
        <Brain size={13} className="text-accent" />
      </div>
      <span className="text-xs font-medium text-text-tertiary">
        {memoryCount > 0 ? `AI remembers your last ${memoryCount} conversations` : 'AI is ready to learn about you'}
      </span>
      {lastTopic && <span className="text-xs font-semibold text-accent">| Last: {lastTopic}</span>}
    </div>
  );
}
