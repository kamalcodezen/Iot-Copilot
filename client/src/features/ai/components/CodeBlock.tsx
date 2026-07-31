'use client';

import { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dashboard-card bg-bg-elevated border border-border-default rounded-2xl overflow-hidden my-3 shadow-elevation-medium">
      <div className="flex items-center justify-between px-4 py-2 bg-bg-primary border-b border-border-default">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 p-1.5">
            <Terminal size={13} className="text-accent" />
          </div>
          <span className="text-xs font-medium text-text-tertiary">{language || 'code'}</span>
        </div>
        <button onClick={handleCopy} className="flex items-center gap-1 text-xs font-bold text-text-tertiary hover:text-accent transition-colors rounded-xl px-2 py-1 hover:-translate-y-0.5">
          {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="code-font text-sm font-medium text-text-primary leading-relaxed whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}
