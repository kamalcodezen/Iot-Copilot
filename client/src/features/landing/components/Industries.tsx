'use client';

import { motion } from 'framer-motion';
import { Building, Factory, Stethoscope, TrendingUp, Truck, Leaf, ChevronRight } from 'lucide-react';

const industries = [
  { icon: Factory, name: 'Manufacturing', count: '2,400+', color: 'from-accent/20 to-blue-500/10' },
  { icon: Building, name: 'Smart Cities', count: '850+', color: 'from-emerald-500/20 to-teal-500/10' },
  { icon: Stethoscope, name: 'Healthcare', count: '1,200+', color: 'from-violet-500/20 to-purple-500/10' },
  { icon: TrendingUp, name: 'Energy', count: '680+', color: 'from-orange-500/20 to-amber-500/10' },
  { icon: Truck, name: 'Logistics', count: '1,900+', color: 'from-cyan-500/20 to-sky-500/10' },
  { icon: Leaf, name: 'Agriculture', count: '750+', color: 'from-lime-500/20 to-green-500/10' },
];

export default function Industries() {
  return (
    <section className="py-24 relative bg-bg-secondary/30 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(95,161,179,0.04)_0%,transparent_60%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-sm text-xs font-bold text-accent mb-5 border border-accent/10 tracking-wide uppercase">
            <Building size={12} /> Industries We Serve
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4 tracking-tight">
            Trusted Across <span className="gradient-text">Industries</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base font-semibold">
            From manufacturing floors to smart cities — organizations worldwide rely on IoT Copilot.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.map((ind, i) => (
              <motion.div
                key={ind.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                className="group relative"
              >
                <div className="dashboard-card p-5 flex flex-col items-center text-center hover-lift">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${ind.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <ind.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-xl font-extrabold text-text-primary tabular-nums mb-0.5">{ind.count}</div>
                  <div className="text-sm font-bold text-text-secondary">{ind.name}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
