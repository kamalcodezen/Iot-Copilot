'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { streamAssistant } from '@/lib/api/ai-stream';
import { getPageContext } from '@/lib/ai/pageContext';
import { getErrorMessage } from '@/utils/errors';
import MarkdownText from '@/features/ai/components/MarkdownText';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  failed?: boolean;
  error?: string;
  retryText?: string;
}

const SUGGESTIONS = [
  'What can I do on this page?',
  'Suggest a beginner IoT project',
  'How do I start learning IoT?',
  'What is MQTT?',
];

export default function AIAssistant() {
  const pathname = usePathname();
  const page = getPageContext(pathname || '');

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streaming, open]);

  const runStream = useCallback(async (text: string, botMsgId: string) => {
    setStreaming(true);
    try {
      await streamAssistant(text, page.name, page.context, (token) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === botMsgId ? { ...m, content: m.content + token, failed: false } : m))
        );
      });
    } catch (error) {
      const message = getErrorMessage(error, 'Connection issue');
      setMessages((prev) =>
        prev.map((m) => (m.id === botMsgId ? { ...m, failed: true, error: message } : m))
      );
    } finally {
      setStreaming(false);
    }
  }, [page.name, page.context]);

  const handleSend = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: trimmed };
    const botMsg: Message = { id: `a-${Date.now() + 1}`, role: 'assistant', content: '', retryText: trimmed };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
    runStream(trimmed, botMsg.id);
  }, [streaming, runStream]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="fixed right-4 bottom-40 lg:bottom-24 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[min(560px,72vh)] rounded-3xl bg-bg-surface/95 backdrop-blur-xl border border-border-default shadow-elevation-high overflow-hidden flex flex-col"
          >
            <div className="px-4 py-3.5 border-b border-border-default flex items-center gap-3 bg-gradient-to-r from-accent/10 via-transparent to-transparent">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-blue-500 flex items-center justify-center shadow-elevation-low flex-shrink-0">
                <Bot size={18} className="text-bg-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-text-primary">IoT Copilot</h3>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                </div>
                <p className="text-[11px] text-text-tertiary truncate">Helping with: {page.name}</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {messages.length === 0 ? (
                <>
                  <div className="rounded-2xl rounded-tl-sm bg-glass border border-border-default px-4 py-3 text-sm leading-relaxed text-text-secondary">
                    Hi, I'm your <span className="font-semibold text-text-primary">IoT Copilot</span>! I can answer IoT questions, explain this page, suggest projects, and help you debug hardware. Ask me anything.
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSend(s)}
                        className="text-xs px-3 py-1.5 rounded-full bg-bg-elevated border border-border-default text-text-secondary hover:text-accent hover:border-accent/50 hover:bg-accent/10 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                    <div
                      className={cn(
                        'max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-elevation-low',
                        m.role === 'user'
                          ? 'bg-gradient-to-br from-accent/90 to-blue-500/90 text-bg-primary rounded-tr-sm'
                          : 'bg-glass border border-border-default text-text-secondary rounded-tl-sm'
                      )}
                    >
                      {m.role === 'user' ? m.content : m.failed ? (
                        <div className="flex flex-col gap-2">
                          <p className="text-text-tertiary">
                            {m.error && /quota|credit|limit/i.test(m.error)
                              ? "The AI service quota is currently exhausted (daily Gemini API limit). Please try again later."
                              : `I couldn't finish my reply${m.error ? `: ${m.error}` : '. Please try again'}.`}
                          </p>
                          <button
                            onClick={() => m.retryText && runStream(m.retryText, m.id)}
                            className="self-start text-xs px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent hover:bg-accent/25 transition-colors"
                          >
                            Retry
                          </button>
                        </div>
                      ) : (
                        <MarkdownText content={m.content} />
                      )}
                      {m.role === 'assistant' && !m.failed && streaming && m.id === messages[messages.length - 1]?.id && !m.content && (
                        <span className="inline-flex gap-1 pl-1">
                          {[0, 1, 2].map((i) => (
                            <span key={i} className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                          ))}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 border-t border-border-default flex items-center gap-2 bg-bg-surface/80"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your IoT Copilot..."
                className="flex-1 bg-bg-elevated border border-border-default rounded-full px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition-all"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                disabled={!input.trim() || streaming}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                  input.trim() && !streaming
                    ? 'bg-gradient-to-br from-accent to-blue-500 text-bg-primary shadow-elevation-low'
                    : 'bg-bg-elevated border border-border-default text-text-tertiary'
                )}
                aria-label="Send message"
              >
                <Send size={16} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed right-4 bottom-24 lg:bottom-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-accent to-blue-500 shadow-elevation-high flex items-center justify-center text-bg-primary"
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
      >
        {streaming && !open && (
          <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-25" />
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'close' : 'open'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <X size={22} /> : <Sparkles size={22} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </>
  );
}
