'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SuggestedQuestions from './SuggestedQuestions';
import { useAIStore, ChatType } from '@/store/aiStore';

interface ChatContainerProps {
  type: ChatType;
  onSend: (message: string) => void;
  suggestedQuestions?: string[];
  placeholder?: string;
}

export default function ChatContainer({ type, onSend, suggestedQuestions = [], placeholder }: ChatContainerProps) {
  const { messages, debugMessages, interviewMessages, isStreaming } = useAIStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeMessages = type === 'debug' ? debugMessages : type === 'interview' ? interviewMessages : messages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const title = type === 'mentor' ? 'AI IoT Mentor' : type === 'debug' ? 'AI Debugger' : 'Interview Coach';
  const subtitle = type === 'mentor'
    ? 'Ask any IoT question — I\'ll explain like a Senior Engineer'
    : type === 'debug'
    ? 'Describe your hardware or software problem for step-by-step diagnosis'
    : 'Practice with real IoT interview questions';

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="dashboard-card bg-bg-card border border-border-default rounded-xl p-4 mb-4 shadow-elevation-low">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary">{title}</h2>
            <p className="text-xs font-medium text-text-tertiary">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {activeMessages.length === 0 && suggestedQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <Bot className="w-14 h-14 text-accent/20" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">How can I help you today?</h3>
            <p className="text-sm font-medium text-text-tertiary mb-8">{subtitle}</p>
            <SuggestedQuestions questions={suggestedQuestions} onSelect={onSend} />
          </motion.div>
        )}

        {activeMessages.map((msg, index) => (
          <ChatMessage key={msg.id} message={msg} isLast={index === activeMessages.length - 1} />
        ))}

        {isStreaming && (
          <div className="flex items-center gap-2 text-accent text-sm">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span>AI is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={onSend} disabled={isStreaming} placeholder={placeholder || 'Ask your IoT question...'} />
    </div>
  );
}
