'use client';

import { motion } from 'framer-motion';
import { Code, Bot, Bug, Cpu, Zap, Globe } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Bot,
    title: 'AI Code Generation',
    description: 'Generate production-ready microcontroller code from natural language prompts. Supports ESP32, Arduino, Raspberry Pi, and more.',
    href: '/ai-mentor',
    gradient: 'from-accent/20 to-blue-500/10',
    iconColor: 'text-accent',
    badge: 'GPT-4o',
  },
  {
    icon: Bug,
    title: 'AI Debug Assistant',
    description: 'Upload your circuit schematics and code — our AI will identify wiring errors, logic bugs, and compatibility issues in seconds.',
    href: '/ai-debugger',
    gradient: 'from-rose-500/20 to-pink-500/10',
    iconColor: 'text-rose-400',
    badge: 'Visual',
  },
  {
    icon: Code,
    title: 'Visual Circuit Designer',
    description: 'Drag-and-drop components to build circuits visually. Export to PCB, generate BOM, and simulate before building.',
    href: '/projects',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    iconColor: 'text-emerald-400',
    badge: 'NEW',
  },
  {
    icon: Cpu,
    title: 'Real-Time Monitoring',
    description: 'Live device telemetry with customizable dashboards. Set alerts, track metrics, and monitor fleet health from anywhere.',
    href: '/projects',
    gradient: 'from-violet-500/20 to-purple-500/10',
    iconColor: 'text-violet-400',
    badge: 'Live',
  },
  {
    icon: Globe,
    title: 'Cloud Dashboard',
    description: 'Centralized control panel for all your IoT devices. OTA updates, remote configuration, and data visualization.',
    href: '/dashboard',
    gradient: 'from-cyan-500/20 to-sky-500/10',
    iconColor: 'text-cyan-400',
    badge: 'Web',
  },
  {
    icon: Zap,
    title: 'Interview Coach',
    description: 'AI-powered mock interviews tailored to IoT and embedded systems roles. Get real-time feedback on your answers.',
    href: '/interview-coach',
    gradient: 'from-amber-500/20 to-orange-500/10',
    iconColor: 'text-amber-400',
    badge: 'AI',
  },
];

export default function Features() {
  return (
    <section className="py-24 relative overflow-hidden" id="features">
      <div className="absolute inset-0 bg-gradient-to-b from-bg-secondary via-transparent to-bg-secondary/50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-sm text-xs font-bold text-accent mb-5 border border-accent/10 tracking-wide uppercase">
            <Zap size={12} /> Core Features
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4 tracking-tight">
            Your Complete{' '}<span className="gradient-text">IoT Toolkit</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base font-semibold">
            Everything you need to design, build, and deploy IoT systems — powered by AI.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <Link key={feature.title} href={feature.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="dashboard-card p-6 h-full hover-lift group relative cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-5.5 h-5.5 ${feature.iconColor}`} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-accent/10 text-accent uppercase tracking-wider">{feature.badge}</span>
                </div>
                <h3 className="text-base font-bold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
