import { create } from 'zustand';
import { AIMemory } from '@/types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIState {
  messages: ChatMessage[];
  isStreaming: boolean;
  debugMessages: ChatMessage[];
  interviewMessages: ChatMessage[];
  memory: AIMemory[];
  addMessage: (messages: ChatMessage[], type?: 'mentor' | 'debug' | 'interview') => void;
  addStreamToken: (token: string, type?: 'mentor' | 'debug' | 'interview') => void;
  setStreaming: (streaming: boolean) => void;
  setMessages: (messages: ChatMessage[], type: 'mentor' | 'debug' | 'interview') => void;
  clearMessages: (type: 'mentor' | 'debug' | 'interview') => void;
  setMemory: (memory: AIMemory[]) => void;
}

const generateId = () => Math.random().toString(36).substring(7);

export const useAIStore = create<AIState>((set) => ({
  messages: [],
  isStreaming: false,
  debugMessages: [],
  interviewMessages: [],
  memory: [],

  addMessage: (newMessages, type = 'mentor') =>
    set((state): Partial<AIState> => {
      if (type === 'debug') return { debugMessages: [...state.debugMessages, ...newMessages] };
      if (type === 'interview') return { interviewMessages: [...state.interviewMessages, ...newMessages] };
      return { messages: [...state.messages, ...newMessages] };
    }),

  addStreamToken: (token, type = 'mentor') =>
    set((state): Partial<AIState> => {
      const targetMessages = type === 'debug' ? state.debugMessages : type === 'interview' ? state.interviewMessages : state.messages;
      const lastMsg = targetMessages[targetMessages.length - 1];
      if (lastMsg?.role === 'assistant') {
        const updated = [...targetMessages];
        updated[updated.length - 1] = { ...lastMsg, content: lastMsg.content + token };
        if (type === 'debug') return { debugMessages: updated };
        if (type === 'interview') return { interviewMessages: updated };
        return { messages: updated };
      }
      const newMessages: ChatMessage[] = [
        ...targetMessages,
        { id: generateId(), role: 'assistant', content: token, timestamp: new Date() },
      ];
      if (type === 'debug') return { debugMessages: newMessages };
      if (type === 'interview') return { interviewMessages: newMessages };
      return { messages: newMessages };
    }),

  setStreaming: (streaming) => set({ isStreaming: streaming }),

  setMessages: (messages, type) =>
    set((state) => {
      if (type === 'debug') return { debugMessages: messages };
      if (type === 'interview') return { interviewMessages: messages };
      return { messages };
    }),

  clearMessages: (type) =>
    set((state) => {
      if (type === 'debug') return { debugMessages: [] };
      if (type === 'interview') return { interviewMessages: [] };
      return { messages: [] };
    }),

  setMemory: (memory) => set({ memory }),
}));
