"use client";

export const streamChat = async (message: string, onToken: (token: string) => void) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/ai/chat`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
      body: JSON.stringify({ message }),
    }
  );

  if (!response.ok) throw new Error('Failed to get response');

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
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.token) {
            onToken(data.token);
          }
        } catch {}
      }
    }
  }
};

export const streamAssistant = async (
  message: string,
  page: string,
  pageInfo: string,
  onToken: (token: string) => void,
  timeoutMs = 90000
) => {
  const token = localStorage.getItem('accessToken');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/ai/assistant`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ message, page, pageInfo }),
        signal: controller.signal,
      }
    );

    if (!response.ok) throw new Error('Failed to get response');

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
        if (line.startsWith('data: ')) {
          let data: any;
          try {
            data = JSON.parse(line.slice(6));
          } catch {
            continue;
          }
          if (data.error) throw new Error(data.error);
          if (data.token) onToken(data.token);
        }
      }
    }
  } finally {
    clearTimeout(timeout);
  }
};

export const streamDebug = async (
  payload: { message: string; board: string; components: string[]; error: string },
  onToken: (token: string) => void
) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/ai/debug`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) throw new Error('Failed to get response');

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
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.token) onToken(data.token);
        } catch {}
      }
    }
  }
};
