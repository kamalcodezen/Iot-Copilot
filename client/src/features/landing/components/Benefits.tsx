'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, TrendingUp, Clock, Users, Cpu } from 'lucide-react';

const benefits = [
  {
    icon: Zap,
    title: '10x Faster Development',
    description: 'AI generates code, wiring diagrams, and configurations in seconds. Stop searching forums and start building.',
    gradient: 'from-amber-500/20 to-orange-500/10',
    iconColor: 'text-amber-400',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'End-to-end encryption, secure device authentication, and role-based access control for production deployments.',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    iconColor: 'text-emerald-400',
  },
  {
    icon: TrendingUp,
    title: 'Smart Analytics',
    description: 'Real-time dashboards with predictive maintenance alerts. Know when a device will fail before it does.',
    gradient: 'from-accent/20 to-blue-500/10',
    iconColor: 'text-accent',
  },
  {
    icon: Clock,
    title: '80% Less Debug Time',
    description: 'AI-powered debugger analyzes your circuit diagrams and code simultaneously, pinpointing issues instantly.',
    gradient: 'from-violet-500/20 to-purple-500/10',
    iconColor: 'text-violet-400',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Share projects, components, and dashboards with your team. Real-time sync across all devices.',
    gradient: 'from-rose-500/20 to-pink-500/10',
    iconColor: 'text-rose-400',
  },
  {
    icon: Cpu,
    title: 'Edge AI Processing',
    description: 'Run ML models directly on ESP32, Raspberry Pi, and other edge devices. Low latency, offline capable.',
    gradient: 'from-cyan-500/20 to-sky-500/10',
    iconColor: 'text-cyan-400',
  },
];

export default function Benefits() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.02] to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-sm text-xs font-bold text-accent mb-5 border border-accent/10 tracking-wide uppercase">
            <Zap size={12} /> Platform Benefits
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4 tracking-tight">
            Built for <span className="gradient-text">Industrial Scale</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base font-semibold">
            Every feature engineered for real-world IoT deployments — from prototype to production.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="dashboard-card p-6 hover-lift group relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${benefit.gradient} rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative`}>
                <benefit.icon className={`w-5.5 h-5.5 ${benefit.iconColor}`} />
              </div>
              <h3 className="text-base font-bold text-text-primary mb-2 relative">{benefit.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed relative">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
