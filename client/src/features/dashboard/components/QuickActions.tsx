'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Bot, Bug, Route, Compass, ArrowRight, Zap } from 'lucide-react';
import SectionHeader from '@/components/layout/SectionHeader';

const actions = [
  { href: '/projects/new', icon: Plus, label: 'New Project', description: 'Start a new IoT project', gradient: 'from-accent/20 to-blue-500/10', iconColor: 'text-accent' },
  { href: '/ai-mentor', icon: Bot, label: 'AI Mentor', description: 'Ask any IoT question', gradient: 'from-violet-500/20 to-purple-500/10', iconColor: 'text-violet-400' },
  { href: '/ai-debugger', icon: Bug, label: 'Debug Circuit', description: 'Troubleshoot your code', gradient: 'from-orange-500/20 to-amber-500/10', iconColor: 'text-orange-400' },
  { href: '/learning-path', icon: Route, label: 'Learning Path', description: 'Follow your roadmap', gradient: 'from-emerald-500/20 to-teal-500/10', iconColor: 'text-emerald-400' },
  { href: '/explore', icon: Compass, label: 'Explore', description: 'Discover projects', gradient: 'from-rose-500/20 to-pink-500/10', iconColor: 'text-rose-400' },
];

export default function QuickActions() {
  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <div className="dashboard-card p-4 sm:p-5 lg:p-6" role="region" aria-label="Quick actions">
        <SectionHeader icon={Zap} title="Quick Actions" variant="card" />
      <p className="text-xs font-semibold text-text-tertiary mb-4 uppercase tracking-wide">Shortcuts to common tasks</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.href}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Link
                href={action.href}
                className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl bg-bg-elevated border border-border-default hover:bg-bg-elevated hover:-translate-y-1 hover:shadow-elevation-medium transition-all duration-300 group h-full shadow-elevation-low"
              >
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-sm`} aria-hidden="true">
                  <Icon className={`h-5 w-5 ${action.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors truncate">{action.label}</p>
                  <p className="text-[11px] font-semibold text-text-tertiary mt-0.5 truncate">{action.description}</p>
                </div>
                <ArrowRight size={13} className="text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0" aria-hidden="true" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
