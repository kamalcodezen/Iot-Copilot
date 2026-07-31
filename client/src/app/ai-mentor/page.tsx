'use client';

import { useCallback } from 'react';
import { useAIStore } from '@/store/aiStore';
import ChatContainer from '@/features/ai/components/ChatContainer';
import { streamChat } from '@/lib/api/ai-stream';

const suggestedQuestions = [
  'What is IoT and how do I get started?',
  'What\'s the difference between ESP32 and Arduino?',
  'How do I connect a DHT11 sensor?',
  'Explain MQTT protocol like I\'m 10',
  'What sensors should I use for a weather station?',
  'How do I power my IoT project with batteries?',
];

export default function AIMentorPage() {
  const { addMessage, addStreamToken, setStreaming } = useAIStore();

  const handleSend = useCallback(async (message: string) => {
    addMessage([{ id: Date.now().toString(), role: 'user', content: message, timestamp: new Date() }]);
    setStreaming(true);
    try {
      await streamChat(message, addStreamToken);
    } catch (error) {
      console.error('AI Chat error:', error);
      addStreamToken('Sorry, I encountered an error. Please try again.');
    } finally {
      setStreaming(false);
    }
  }, [addMessage, addStreamToken, setStreaming]);

  return (
    <div className="min-h-screen dashboard-bg px-4 sm:px-6 lg:px-8 pb-24 sm:pb-20 lg:pb-10 pt-20 bg-gradient-to-b from-transparent to-accent/5">
      <ChatContainer
        type="mentor"
        onSend={handleSend}
        suggestedQuestions={suggestedQuestions}
        placeholder="Ask your IoT question... (e.g., How do I use PWM on ESP32?)"
      />
    </div>
  );
}
