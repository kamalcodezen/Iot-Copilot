const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function clientFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!response.ok) {
    if (response.status === 401) {
      const { useAuthStore } = await import('@/store/authStore');
      useAuthStore.getState().setUser(null);
    }
    const text = await response.text();
    let message = text || `Request failed: ${response.status}`;
    try {
      // The API returns { success, message } envelopes; unwrap the message
      // so errors surface as readable text.
      const parsed = JSON.parse(text) as { message?: unknown };
      if (typeof parsed.message === 'string' && parsed.message) message = parsed.message;
    } catch {
      // The body was not JSON, keep the raw text as the message.
    }
    throw new Error(message);
  }
  return response.json();
}
