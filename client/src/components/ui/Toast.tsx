'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'rgba(22, 44, 59, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(230, 240, 244, 0.1)',
          borderRadius: '14px',
          color: '#f2f7f9',
          fontSize: '14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(95,161,179,0.08)',
        },
        success: {
          iconTheme: { primary: '#b7d56f', secondary: '#102330' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#102330' },
        },
      }}
    />
  );
}
