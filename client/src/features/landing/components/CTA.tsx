'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-bg-secondary/30 via-accent/[0.03] to-bg-secondary/30" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(95,161,179,0.06) 0%, transparent 50%)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto dashboard-card p-10 sm:p-14 lg:p-16 text-center relative overflow-hidden border-accent/10"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-sm text-xs font-bold text-accent mb-6 border border-accent/10 tracking-wide uppercase">
              <Sparkles size={12} /> Get Started
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4 tracking-tight leading-tight">
              Ready to Build the{' '}<br className="hidden sm:block" />
              <span className="gradient-text">Future of IoT</span>?
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto text-base font-semibold mb-8">
              Join thousands of engineers using AI to design, debug, and deploy IoT systems. Start building in minutes — no setup required.
            </p>
            <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
              <Link href="/auth/register">
                <Button size="lg" className="text-sm">
                  Start Building Free <ArrowRight size={15} />
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline" size="lg" className="text-sm">
                  Explore Projects
                </Button>
              </Link>
            </div>
            <p className="text-xs font-semibold text-text-muted mt-5">No credit card required &middot; Free tier includes 100 AI generations/month</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
