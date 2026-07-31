'use client';

import { motion } from 'framer-motion';
import { Factory, Building2, Warehouse, Truck, Wind, Wheat, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const solutions = [
  {
    icon: Factory,
    title: 'Smart Manufacturing',
    description: 'Real-time production monitoring, predictive maintenance, and quality control with AI-powered computer vision.',
    gradient: 'from-accent/20 to-blue-500/10',
    iconColor: 'text-accent',
  },
  {
    icon: Building2,
    title: 'Smart Buildings',
    description: 'HVAC optimization, energy management, occupancy sensing, and automated lighting for commercial spaces.',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Warehouse,
    title: 'Warehouse Automation',
    description: 'Inventory tracking, fleet management, environmental monitoring, and automated material handling systems.',
    gradient: 'from-violet-500/20 to-purple-500/10',
    iconColor: 'text-violet-400',
  },
  {
    icon: Truck,
    title: 'Logistics & Fleet',
    description: 'GPS tracking, cold chain monitoring, route optimization, and driver behavior analytics in real time.',
    gradient: 'from-orange-500/20 to-amber-500/10',
    iconColor: 'text-orange-400',
  },
  {
    icon: Wind,
    title: 'Environmental Monitoring',
    description: 'Air quality, water quality, noise pollution, and weather monitoring networks for smart cities.',
    gradient: 'from-cyan-500/20 to-sky-500/10',
    iconColor: 'text-cyan-400',
  },
  {
    icon: Wheat,
    title: 'Precision Agriculture',
    description: 'Soil monitoring, automated irrigation, drone integration, and crop health analytics for modern farming.',
    gradient: 'from-lime-500/20 to-green-500/10',
    iconColor: 'text-lime-400',
  },
];

export default function Solutions() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-sm text-xs font-bold text-accent mb-5 border border-accent/10 tracking-wide uppercase">
            <Factory size={12} /> Industry Solutions
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4 tracking-tight">
            One Platform. <span className="gradient-text">Every Industry</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base font-semibold">
            Purpose-built solutions for the world&apos;s most demanding industrial environments.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {solutions.map((sol, i) => (
            <motion.div
              key={sol.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="group relative dashboard-card p-6 hover-lift"
            >
              <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${sol.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <sol.icon className={`w-5.5 h-5.5 ${sol.iconColor}`} />
              </div>
              <h3 className="text-base font-bold text-text-primary mb-2">{sol.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">{sol.description}</p>
              <Link
                href="/explore"
                className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:text-accent-hover transition-colors group/link"
              >
                Learn more <ChevronRight size={13} className="group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
