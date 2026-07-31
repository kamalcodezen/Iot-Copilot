'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Code, Beaker, Rocket, ArrowRight, Cpu } from 'lucide-react';

const steps = [
  {
    icon: Lightbulb,
    title: 'Describe Your Project',
    description: 'Tell our AI what you want to build — a smart thermostat, a drone controller, or an industrial sensor network.',
    gradient: 'from-accent/20 to-blue-500/10',
    iconColor: 'text-accent',
    step: '01',
  },
  {
    icon: Code,
    title: 'AI Generates Everything',
    description: 'Our AI produces the firmware, wiring diagram, component list, and configuration files in under 30 seconds.',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    iconColor: 'text-emerald-400',
    step: '02',
  },
  {
    icon: Beaker,
    title: 'Simulate & Debug',
    description: 'Test your circuit in our virtual simulator. The AI debugger catches issues before you solder a single wire.',
    gradient: 'from-violet-500/20 to-purple-500/10',
    iconColor: 'text-violet-400',
    step: '03',
  },
  {
    icon: Rocket,
    title: 'Deploy & Monitor',
    description: 'Flash your device OTA, view real-time telemetry on dashboards, and receive AI-powered maintenance alerts.',
    gradient: 'from-amber-500/20 to-orange-500/10',
    iconColor: 'text-amber-400',
    step: '04',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 relative bg-bg-secondary/30 overflow-hidden" id="how-it-works">
      <div className="absolute inset-0 section-grid opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-sm text-xs font-bold text-accent mb-5 border border-accent/10 tracking-wide uppercase">
            <Cpu size={12} /> How It Works
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4 tracking-tight">
            Idea to Production{' '}<span className="gradient-text">in 4 Steps</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base font-semibold">
            From concept to deployment — our AI handles the heavy lifting so you can focus on innovation.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-12 bottom-12 w-px bg-gradient-to-b from-accent/40 via-accent/10 to-accent/40 -translate-x-1/2" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`flex items-start gap-6 sm:gap-10 mb-12 last:mb-0 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
            >
              <div className={`flex-1 ${i % 2 === 0 ? 'lg:text-right' : ''}`}>
                <div className={`dashboard-card p-6 inline-block max-w-lg ${i % 2 === 0 ? 'lg:ml-auto' : ''}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shrink-0`}>
                      <step.icon className={`w-5.5 h-5.5 ${step.iconColor}`} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-accent uppercase tracking-widest">{step.step}</div>
                      <h3 className="text-base font-bold text-text-primary">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
                </div>
              </div>

              <div className="hidden lg:flex items-center justify-center w-12 shrink-0 relative">
                <div className="h-10 w-10 rounded-full bg-bg-card border-2 border-accent/30 flex items-center justify-center z-10">
                  <ArrowRight className={`w-4 h-4 text-accent ${i % 2 === 0 ? '' : 'rotate-180'}`} />
                </div>
              </div>

              <div className="flex-1 hidden lg:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
