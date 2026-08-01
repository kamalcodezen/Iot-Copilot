'use client';

import { motion } from 'framer-motion';
import { CircuitBoard, Home, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center dashboard-bg relative pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(95,161,179,0.06)_0%,transparent_60%)]" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center relative z-10 px-4">
        <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-accent-light border border-accent/20 mx-auto mb-6">
          <CircuitBoard className="w-10 h-10 text-accent" />
        </div>
        <h1 className="text-7xl font-extrabold text-text-primary mb-4 tracking-tight">404</h1>
        <p className="text-lg font-bold text-text-secondary mb-2">Page Not Found</p>
        <p className="text-sm font-semibold text-text-tertiary mb-8 max-w-sm mx-auto">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="flex items-center justify-center gap-3">
          <Button href="/" variant="primary"><Home size={16} className="mr-2" />Back to Home</Button>
          <button onClick={() => window.history.back()} className="inline-flex items-center gap-1.5 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors px-4 py-2.5 rounded-xl hover:bg-glass">
            <ArrowLeft size={15} /> Go back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
