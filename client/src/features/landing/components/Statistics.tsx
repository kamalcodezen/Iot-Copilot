'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Cpu, Wifi, Globe, HardDrive } from 'lucide-react';

const stats = [
  { icon: Cpu, value: '50K+', label: 'IoT Devices', sub: 'Connected & monitored' },
  { icon: Wifi, value: '99.97%', label: 'Platform Uptime', sub: 'Enterprise reliability' },
  { icon: Globe, value: '120+', label: 'Countries', sub: 'Global deployment' },
  { icon: HardDrive, value: '10M+', label: 'Data Points', sub: 'Processed daily' },
];

export default function Statistics() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section ref={ref} className="py-20 relative bg-bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border-default rounded-2xl overflow-hidden border border-border-default">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-bg-card p-6 sm:p-8 flex flex-col items-center text-center relative group"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 border border-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-6 h-6 text-accent" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-text-primary tabular-nums tracking-tight mb-1">{stat.value}</div>
              <div className="text-sm font-bold text-text-secondary mb-0.5">{stat.label}</div>
              <div className="text-xs font-medium text-text-muted">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
