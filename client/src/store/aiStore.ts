import { create } from 'zustand';
import { AIMemory } from '@/types';

export type ChatType = 'mentor' | 'debug' | 'interview';

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
  addMessage: (messages: ChatMessage[], type?: ChatType) => void;
  addStreamToken: (token: string, type?: ChatType) => void;
  setStreaming: (streaming: boolean) => void;
  setMessages: (messages: ChatMessage[], type: ChatType) => void;
  clearMessages: (type: ChatType) => void;
  setMemory: (memory: AIMemory[]) => void;
}

const generateId = () => Math.random().toString(36).substring(7);

// Each chat (mentor, debug, interview) keeps its own message list. These two
// helpers hide which store field holds a chat's messages so the actions below
// share one implementation.
function getMessageList(state: AIState, type: ChatType): ChatMessage[] {
  if (type === 'debug') return state.debugMessages;
  if (type === 'interview') return state.interviewMessages;
  return state.messages;
}

function updateMessageList(state: AIState, type: ChatType, messages: ChatMessage[]): Partial<AIState> {
  if (type === 'debug') return { debugMessages: messages };
  if (type === 'interview') return { interviewMessages: messages };
  return { messages };
}

export const useAIStore = create<AIState>((set) => ({
  messages: [],
  isStreaming: false,
  debugMessages: [],
  interviewMessages: [],
  memory: [],

  addMessage: (newMessages, type = 'mentor') =>
    set((state) => updateMessageList(state, type, [...getMessageList(state, type), ...newMessages])),

  addStreamToken: (token, type = 'mentor') =>
    set((state) => {
      const messages = getMessageList(state, type);
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'assistant') {
        const updated = [...messages];
        updated[updated.length - 1] = { ...lastMessage, content: lastMessage.content + token };
        return updateMessageList(state, type, updated);
      }
      return updateMessageList(state, type, [
        ...messages,
        { id: generateId(), role: 'assistant', content: token, timestamp: new Date() },
      ]);
    }),

  setStreaming: (streaming) => set({ isStreaming: streaming }),

  setMessages: (messages, type) =>
    set((state) => updateMessageList(state, type, messages)),

  clearMessages: (type) =>
    set((state) => updateMessageList(state, type, [])),

  setMemory: (memory) => set({ memory }),
}));
