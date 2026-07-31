'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles, Target, Layers, Gauge, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const aiFeatures = [
  {
    icon: Brain,
    title: 'Context-Aware AI',
    description: 'Our AI understands your hardware constraints — pin layouts, voltage limits, memory budgets — and generates optimized code.',
  },
  {
    icon: Sparkles,
    title: 'Smart Suggestions',
    description: 'As you design circuits, the AI suggests alternative components, identifies bottlenecks, and recommends best practices.',
  },
  {
    icon: Target,
    title: 'Predictive Analytics',
    description: 'ML models trained on millions of IoT data points predict device failures, maintenance windows, and performance issues.',
  },
  {
    icon: Layers,
    title: 'Multi-Model Engine',
    description: 'GPT-4o, Claude, and specialized embedded models work together to give you the best answer for every task.',
  },
  {
    icon: Gauge,
    title: 'Optimized Firmware',
    description: 'AI automatically optimizes your compiled binary size, power consumption, and real-time performance.',
  },
  {
    icon: Shield,
    title: 'Security Analysis',
    description: 'Automated vulnerability scanning for your firmware, identifying OTA exploits, buffer overflows, and insecure configs.',
  },
];

export default function AIFeatures() {
  return (
    <section className="py-24 relative overflow-hidden" id="ai-features">
      <div className="absolute inset-0 bg-gradient-to-b from-bg-secondary/50 via-transparent to-bg-secondary/50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-sm text-xs font-bold text-accent mb-5 border border-accent/10 tracking-wide uppercase">
            <Sparkles size={12} /> AI Engine
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4 tracking-tight">
            Powered by{' '}<span className="gradient-text">Advanced AI</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base font-semibold mb-8">
            Multi-model AI engine purpose-built for embedded systems and IoT development.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="px-3 py-1.5 glass-sm text-xs font-bold text-text-secondary rounded-lg border border-border-default">GPT-4o</span>
            <span className="px-3 py-1.5 glass-sm text-xs font-bold text-text-secondary rounded-lg border border-border-default">Claude 4</span>
            <span className="px-3 py-1.5 glass-sm text-xs font-bold text-text-secondary rounded-lg border border-border-default">Codex</span>
            <span className="px-3 py-1.5 glass-sm text-xs font-bold text-accent rounded-lg bg-accent/10">+ Custom Models</span>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {aiFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="dashboard-card p-6 hover-lift group"
            >
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-5.5 h-5.5 text-accent" />
              </div>
              <h3 className="text-base font-bold text-text-primary mb-2">{feature.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
