import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL 
    ? `${process.env.NEXT_PUBLIC_API_URL}/auth` 
    : (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000/api/auth'),
});
