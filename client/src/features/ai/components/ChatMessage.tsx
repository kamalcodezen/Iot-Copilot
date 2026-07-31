'use client';

import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import { cn } from '@/utils/cn';
import CodeBlock from './CodeBlock';

interface ChatMessageProps {
  message: { id: string; role: 'user' | 'assistant'; content: string };
  isLast?: boolean;
}

export default function ChatMessage({ message, isLast }: ChatMessageProps) {
  const isUser = message.role === 'user';

  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        if (match) {
          return <CodeBlock key={i} code={match[2].trim()} language={match[1] || 'text'} />;
        }
      }
      const formatted = part.split(/\n/).map((line, j) => (
        <p key={`${i}-${j}`} className={line.trim() ? 'mb-2 last:mb-0' : 'h-2'}>
          {line.split(/(`[^`]+`)/g).map((segment, k) => {
            if (segment.startsWith('`') && segment.endsWith('`')) {
              return (
                <code key={k} className="px-1.5 py-0.5 rounded bg-glass text-accent text-sm code-font">
                  {segment.slice(1, -1)}
                </code>
              );
            }
            const boldParts = segment.split(/(\*\*[^*]+\*\*)/g);
            return boldParts.map((boldPart, l) => {
              if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
                return <strong key={l} className="font-semibold text-text-primary">{boldPart.slice(2, -2)}</strong>;
              }
              return boldPart;
            });
          })}
        </p>
      ));
      return <div key={i}>{formatted}</div>;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-elevation-low border border-border-default', isUser ? 'bg-bg-elevated' : 'bg-gradient-to-br from-accent/20 to-blue-500/10')}>
        {isUser ? <User size={16} className="text-text-primary" /> : <Bot size={16} className="text-accent" />}
      </div>

      <div className={cn('max-w-[85%] rounded-2xl px-5 py-3.5 shadow-elevation-low', isUser ? 'bg-bg-elevated border border-border-default text-text-primary' : 'bg-bg-surface border border-border-default text-text-primary')}>
        <div className="text-sm leading-relaxed font-medium">{renderContent(message.content)}</div>
      </div>
    </motion.div>
  );
}
