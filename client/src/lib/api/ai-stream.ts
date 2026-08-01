"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// The server streams one JSON object per SSE "data:" line. A token object
// carries the next chunk of text; an error object ends the stream in failure.
interface SSEEvent {
  token?: string;
  error?: string;
}

// Reads the streamed response and hands every token chunk to onToken.
// Throws when the server signals an error event.
async function readStream(response: Response, onToken: (token: string) => void): Promise<void> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error('No reader available');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      // JSON.parse returns any, so narrow the decoded event to the shape
      // the server sends.
      let event: SSEEvent;
      try {
        event = JSON.parse(line.slice(6)) as SSEEvent;
      } catch {
        continue;
      }
      if (event.error) throw new Error(event.error);
      if (event.token) onToken(event.token);
    }
  }
}

async function postStream(
  path: string,
  body: unknown,
  onToken: (token: string) => void,
  timeoutMs?: number
): Promise<void> {
  const controller = new AbortController();
  const timeout = timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : undefined;

  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) throw new Error('Failed to get response');

    await readStream(response, onToken);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export const streamChat = (message: string, onToken: (token: string) => void) =>
  postStream('/ai/chat', { message }, onToken);

export const streamAssistant = (
  message: string,
  page: string,
  pageInfo: string,
  onToken: (token: string) => void,
  timeoutMs = 90000
) => postStream('/ai/assistant', { message, page, pageInfo }, onToken, timeoutMs);

export const streamDebug = (
  payload: { message: string; board: string; components: string[]; error: string },
  onToken: (token: string) => void
) => postStream('/ai/debug', payload, onToken);
