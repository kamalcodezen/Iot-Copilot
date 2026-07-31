import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import ToastProvider from '@/components/ui/Toast';
import Navbar from '@/components/layout/Navbar';
import AIAssistant from '@/components/ai/AIAssistant';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IoT Copilot AI — Your AI Senior IoT Engineer',
  description: 'Learn IoT with personalized AI guidance. Build projects, debug circuits, practice interviews, and master IoT with your AI Senior Engineer.',
  keywords: ['IoT', 'AI', 'Learning', 'Electronics', 'Embedded Systems', 'Arduino', 'ESP32'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${jetbrainsMono.variable} font-sans antialiased dashboard-bg text-text-primary`}>
        <NextTopLoader color="var(--color-accent)" showSpinner={false} shadow="0 0 10px var(--color-accent),0 0 5px var(--color-accent)" />
        <ToastProvider />
        <Navbar />
        {children}
        <AIAssistant />
      </body>
    </html>
  );
}
