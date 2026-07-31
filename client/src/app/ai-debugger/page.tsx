'use client';

import { useCallback, useState } from 'react';
import { Bug, Cpu, AlertTriangle } from 'lucide-react';
import { useAIStore } from '@/store/aiStore';
import ChatContainer from '@/features/ai/components/ChatContainer';
import { streamDebug } from '@/lib/api/ai-stream';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const suggestedQuestions = [
  'My ESP32 keeps resetting when I connect the sensor',
  'DHT11 always reads 0 temperature',
  'LED doesn\'t turn on with my Arduino code',
  'Motor driver getting hot after 2 minutes',
  'WiFi connection keeps dropping on ESP32',
  'LCD display showing random characters',
];

export default function AIDebuggerPage() {
  const { addMessage: addDebugMsg, addStreamToken, setStreaming, clearMessages, debugMessages } = useAIStore();
  const [board, setBoard] = useState('');
  const [error, setError] = useState('');
  const [components, setComponents] = useState('');

  const handleSend = useCallback(async (message: string) => {
    const msgId = Date.now().toString();
    addDebugMsg([{ id: msgId, role: 'user', content: message, timestamp: new Date() }], 'debug');
    setStreaming(true);
    try {
      await streamDebug({ message, board, components: components.split(',').map((c) => c.trim()), error }, (t) => addStreamToken(t, 'debug'));
    } catch (error) {
      console.error('Debug error:', error);
      addStreamToken('Failed to get debug analysis. Please try again.', 'debug');
    } finally {
      setStreaming(false);
    }
  }, [board, components, error, addDebugMsg, addStreamToken, setStreaming]);

  const startNewSession = () => {
    clearMessages('debug');
    setBoard('');
    setError('');
    setComponents('');
  };

  return (
    <div className="min-h-screen dashboard-bg px-4 sm:px-6 lg:px-8 pb-24 sm:pb-20 lg:pb-10 pt-20">
      {debugMessages.length === 0 && (
        <div className="bg-bg-elevated border border-border-default rounded-2xl p-5 mb-4 shadow-elevation-high">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 p-2">
                <Bug className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="text-text-primary font-bold text-sm uppercase tracking-wide">Diagnostic Info (Optional)</h3>
                <p className="text-xs text-text-tertiary">Fill in to get more accurate debugging</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Board/Microcontroller" placeholder="e.g., ESP32, Arduino Uno" value={board} onChange={(e) => setBoard(e.target.value)} icon={<Cpu size={15} />} />
            <Input label="Components" placeholder="e.g., DHT11, LED, resistor" value={components} onChange={(e) => setComponents(e.target.value)} />
            <Input label="Error Message" placeholder="Any error codes or messages" value={error} onChange={(e) => setError(e.target.value)} icon={<AlertTriangle size={15} />} />
          </div>
        </div>
      )}

      <ChatContainer type="debug" onSend={handleSend} suggestedQuestions={debugMessages.length === 0 ? suggestedQuestions : undefined} placeholder="Describe your problem in detail..." />

      {debugMessages.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Button variant="ghost" size="sm" onClick={startNewSession}>Start New Debug Session</Button>
        </div>
      )}
    </div>
  );
}
