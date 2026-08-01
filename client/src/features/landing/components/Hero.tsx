'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Radio, Activity, Globe, Monitor, Gauge } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import HeroNetworkVisual from './HeroNetworkVisual';

const stats = [
  { value: '99.97%', label: 'Platform Uptime', icon: Activity, color: 'bg-accent' },
  { value: '10K+', label: 'Connected Devices', icon: Monitor, color: 'bg-emerald-500' },
  { value: '120+', label: 'Countries Deployed', icon: Globe, color: 'bg-violet-500' },
  { value: '<50ms', label: 'Edge Latency', icon: Gauge, color: 'bg-teal-500' },
];

function StatCard({ icon: Icon, label, value, color, index }: { icon: LucideIcon; label: string; value: string; color: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 dashboard-card p-3.5 sm:p-4"
    >
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={16} className="text-white" />
      </div>
      <div className="min-w-0">
        <div className="font-bold text-text-primary tabular-nums tracking-tight text-sm sm:text-base">{value}</div>
        <div className="text-[11px] text-text-tertiary truncate">{label}</div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const { isAuthenticated, isLoading, fetchMe } = useAuthStore();
  const fetchedRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchMe();
    }
  }, [fetchMe]);

  const getStartedHref = !isLoading && isAuthenticated ? '/dashboard' : '/auth/login';

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.4]);

  return (
    <section ref={sectionRef} className="relative min-h-screen pt-28 sm:pt-32 pb-0 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-accent/[0.03] blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-[5%] w-[500px] h-[500px] rounded-full bg-highlight/[0.015] blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-[5%] w-[600px] h-[600px] rounded-full bg-deep-blue/[0.02] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 min-h-[calc(100vh-10rem)] items-center">
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="pt-8 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-sm text-xs sm:text-sm font-semibold text-accent mb-6 sm:mb-8 border border-accent/10 shadow-sm tracking-wide">
                <Radio size={13} className="text-accent" />
                Industrial AI + IoT Platform
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-text-primary tracking-tight leading-[1.04] mb-5"
            >
              Intelligence for
              <br />
              <span className="gradient-text">Connected Industry</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg md:text-xl text-text-secondary max-w-xl mb-8 leading-relaxed"
            >
              Design, deploy and monitor industrial IoT systems at scale.
              AI-powered analytics, predictive maintenance, and real-time device management — unified.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-12"
            >
              <Button href={getStartedHref} size="lg" className="rounded-full px-8 py-3.5 shadow-lg shadow-accent/20 group text-base w-full sm:w-auto justify-center">
                Start Building Free
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button href="#features" variant="outline" size="lg" className="rounded-full px-8 py-3.5 border-border-default text-text-secondary hover:border-accent/30 hover:text-accent w-full sm:w-auto justify-center">
                <Sparkles size={16} className="mr-2" />
                Explore Platform
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-3"
            >
              {stats.map((s, i) => (
                <StatCard key={s.label} icon={s.icon} value={s.value} label={s.label} color={s.color} index={i} />
              ))}
            </motion.div>
          </motion.div>

          <HeroNetworkVisual />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1.5"
        >
          <span className="text-[10px] font-medium text-text-muted tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-text-muted/30 flex items-start justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-1.5 rounded-full bg-text-muted"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
