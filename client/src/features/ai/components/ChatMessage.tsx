'use client';

import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import { cn } from '@/utils/cn';
import MarkdownText from './MarkdownText';

interface ChatMessageProps {
  message: { id: string; role: 'user' | 'assistant'; content: string };
  isLast?: boolean;
}

export default function ChatMessage({ message, isLast }: ChatMessageProps) {
  const isUser = message.role === 'user';

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
        <div className="text-sm leading-relaxed font-medium">
          <MarkdownText content={message.content} />
        </div>
      </div>
    </motion.div>
  );
}
