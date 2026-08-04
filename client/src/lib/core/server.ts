import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000/api');

function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>) {
  const baseUrl = endpoint.startsWith('http') ? '' : API_URL;
  const url = new URL(endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

// Forwards the browser's request headers as-is so the API server can resolve
// the session with Better Auth. No cookies are parsed or named here.
export const authHeaders = async (): Promise<Record<string, string>> => {
  try {
    const headerStore = await headers();
    const cookie = headerStore.get('cookie');
    return cookie ? { Cookie: cookie } : {};
  } catch (error) {
    return {};
  }
};

export const serverFetch = async <T>(endpoint: string, options: RequestInit & { params?: Record<string, string | number | boolean | undefined> } = {}): Promise<T> => {
  const { params, headers, ...rest } = options;
  const url = buildUrl(endpoint, params);
  const aHeaders = await authHeaders();

  const isFormData = rest.body instanceof FormData;
  const requestHeaders = new Headers(aHeaders);
  
  if (headers) {
    const customHeaders = new Headers(headers);
    customHeaders.forEach((value, key) => requestHeaders.set(key, value));
  }

  if (!isFormData && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...rest,
    headers: requestHeaders,
  });

  if (!response.ok) {
    // Prevent redirect loop in Server Actions (cross-domain session drop)
    // if (response.status === 401) {
    //   redirect('/auth/login');
    // }
    const errorBody = await response.text();
    let parsedBody;
    try {
      parsedBody = JSON.parse(errorBody);
    } catch {
      parsedBody = { message: errorBody };
    }
    // Error responses don't match T, so cast the failed envelope that
    // server actions can inspect instead of throwing.
    return { success: false, error: `API Error: ${response.status}`, details: parsedBody } as T;
  }

  return response.json();
};

export const serverMutation = async <T>(endpoint: string, data?: unknown, method: string = 'POST'): Promise<T> => {
  const options: RequestInit = {
    method,
  };
  
  if (data !== undefined) {
    if (data instanceof FormData) {
      options.body = data;
    } else {
      options.body = JSON.stringify(data);
    }
  }

  return await serverFetch<T>(endpoint, options);
};
