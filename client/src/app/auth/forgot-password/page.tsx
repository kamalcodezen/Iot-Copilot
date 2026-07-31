'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CircuitBoard, ArrowLeft, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authClient.requestPasswordReset({ email });
      setSent(true);
      toast.success('Reset link sent!');
    } catch (error: any) {
      toast.error(error?.message || error?.error || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dashboard-bg relative pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(95,161,179,0.06)_0%,transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="bg-bg-elevated border border-border-default rounded-2xl p-7 sm:p-8 shadow-elevation-high">
          <div className="text-center mb-7">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group justify-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-accent-light border border-accent/20 group-hover:scale-105 transition-transform">
                <CircuitBoard className="w-6 h-6 text-accent" />
              </div>
              <span className="text-xl font-extrabold">
                <span className="text-text-primary">IoT</span><span className="text-accent">Copilot</span>
              </span>
            </Link>
            <h1 className="text-xl font-extrabold text-text-primary mb-1.5">Reset Password</h1>
            <p className="text-sm font-semibold text-text-tertiary">
              {sent ? 'Check your email for the reset link' : 'Enter your email to receive a reset link'}
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={15} />}
                required
              />
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Send Reset Link <ArrowRight size={15} className="ml-1.5" />
              </Button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="h-14 w-14 rounded-2xl bg-success-light flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-success" />
              </div>
              <p className="text-sm font-semibold text-text-secondary mb-2">Email sent to <strong className="text-text-primary">{email}</strong></p>
              <p className="text-xs font-medium text-text-muted">Check your spam folder if you don&apos;t see it</p>
            </div>
          )}

          <div className="text-center mt-5">
            <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:text-accent-hover transition-colors">
              <ArrowLeft size={13} /> Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
