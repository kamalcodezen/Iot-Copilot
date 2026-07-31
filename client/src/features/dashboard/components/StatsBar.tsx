'use client';

import { motion } from 'framer-motion';
import { Flame, FolderKanban, Clock, Zap, TrendingUp } from 'lucide-react';

interface StatsBarProps {
  stats: {
    learningStreak: number;
    totalProjects: number;
    totalSessions: number;
    totalHours: number;
  };
}

const items = [
  { key: 'streak', icon: Flame, label: 'Day Streak', valueKey: 'learningStreak' as const, gradient: 'from-orange-500/20 to-amber-500/10', iconBg: 'bg-gradient-to-br from-orange-500/20 to-amber-500/10 text-orange-400' },
  { key: 'projects', icon: FolderKanban, label: 'Projects', valueKey: 'totalProjects' as const, gradient: 'from-accent/20 to-blue-500/10', iconBg: 'bg-gradient-to-br from-accent/20 to-blue-500/10 text-accent' },
  { key: 'sessions', icon: Clock, label: 'Sessions', valueKey: 'totalSessions' as const, gradient: 'from-violet-500/20 to-purple-500/10', iconBg: 'bg-gradient-to-br from-violet-500/20 to-purple-500/10 text-violet-400' },
  { key: 'hours', icon: Zap, label: 'Hours', valueKey: 'totalHours' as const, gradient: 'from-emerald-500/20 to-teal-500/10', iconBg: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-400' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {items.map((item, index) => {
        const Icon = item.icon;
        const value = item.key === 'hours' ? Math.floor(stats[item.valueKey]) : stats[item.valueKey];

        return (
          <motion.div
            key={item.key}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="relative dashboard-card p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover-lift group overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300 shadow-sm relative z-10`} aria-hidden="true">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 relative z-10">
              <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-text-primary tabular-nums tracking-tight">{value}</p>
              <p className="text-[11px] sm:text-xs font-semibold text-text-tertiary tracking-wide truncate uppercase">{item.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
