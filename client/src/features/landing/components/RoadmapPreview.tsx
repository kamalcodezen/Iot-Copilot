'use client';

import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Circle, ArrowRight, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const roadmapItems = [
  {
    quarter: 'Q3 2026',
    title: 'Edge AI Runtime',
    description: 'Deploy TensorFlow Lite models directly to ESP32 and RP2040 with our optimized runtime.',
    status: 'completed',
    items: ['Model quantization toolkit', 'On-device inference engine', 'Real-time telemetry pipeline'],
  },
  {
    quarter: 'Q4 2026',
    title: 'Collaborative IDE',
    description: 'Real-time collaborative circuit design and code editor with multiplayer support.',
    status: 'in-progress',
    items: ['WebSocket sync engine', 'Live cursor sharing', 'Version control for hardware'],
  },
  {
    quarter: 'Q1 2027',
    title: 'Marketplace Launch',
    description: 'Buy and sell IoT components, pre-built modules, and complete project templates.',
    status: 'upcoming',
    items: ['Vendor integration API', 'Verified component catalog', 'Automated compatibility checker'],
  },
  {
    quarter: 'Q2 2027',
    title: 'Enterprise Suite',
    description: 'Dedicated server deployment, SSO, audit logs, and SLA-backed infrastructure.',
    status: 'upcoming',
    items: ['On-premise deployment', 'SOC 2 compliance', 'Advanced RBAC system'],
  },
];

export default function RoadmapPreview() {
  return (
    <section className="py-24 relative bg-bg-secondary/30 overflow-hidden" id="roadmap">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-sm text-xs font-bold text-accent mb-5 border border-accent/10 tracking-wide uppercase">
            <Calendar size={12} /> Roadmap
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4 tracking-tight">
            What&apos;s{' '}<span className="gradient-text">Coming Next</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base font-semibold">
            We&apos;re building the future of IoT development. Here&apos;s what&apos;s on the horizon.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {roadmapItems.map((item, i) => (
            <motion.div
              key={item.quarter}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative pl-8 pb-12 last:pb-0"
            >
              <div className="absolute left-0 top-2 bottom-0 w-px bg-gradient-to-b from-accent/40 to-transparent last:hidden" />
              <div className="absolute left-[-3.5px] top-2">
                {item.status === 'completed' ? (
                  <CheckCircle2 size={8} className="text-accent" />
                ) : item.status === 'in-progress' ? (
                  <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                ) : (
                  <Circle size={8} className="text-text-muted" />
                )}
              </div>

              <div className="dashboard-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-accent/10 text-accent uppercase tracking-wider">{item.quarter}</span>
                  <h3 className="text-base font-bold text-text-primary">{item.title}</h3>
                  {item.status === 'in-progress' && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      In Development
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary mb-4">{item.description}</p>
                <ul className="space-y-1.5">
                  {item.items.map((sub) => (
                    <li key={sub} className="flex items-center gap-2 text-xs font-semibold text-text-muted">
                      <div className="h-1 w-1 rounded-full bg-accent/60" />
                      {sub}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
