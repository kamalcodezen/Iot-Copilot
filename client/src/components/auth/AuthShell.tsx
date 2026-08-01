import Link from 'next/link';
import { motion } from 'framer-motion';
import { CircuitBoard } from 'lucide-react';

interface AuthShellProps {
  title: string;
  subtitle: string;
  apiError: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

// Shared layout for the auth pages: full-screen background with the radial
// glow, the branded card with logo and title, the inline API error banner,
// and the footer line under the form.
export default function AuthShell({ title, subtitle, apiError, children, footer }: AuthShellProps) {
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
            <h1 className="text-xl font-extrabold text-text-primary mb-1.5">{title}</h1>
            <p className="text-sm font-semibold text-text-tertiary">{subtitle}</p>
          </div>

          {apiError && (
            <div className="mb-4 p-3 rounded-xl bg-error-light border border-error/30 text-sm font-semibold text-error">
              {apiError}
            </div>
          )}

          {children}

          <p className="text-center text-sm font-semibold text-text-secondary mt-6">{footer}</p>
        </div>
      </motion.div>
    </div>
  );
}
