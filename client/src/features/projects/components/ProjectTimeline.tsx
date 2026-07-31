'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { formatDate } from '@/utils/date';

interface Milestone { title: string; status: 'completed' | 'in-progress' | 'pending'; date?: string; }
interface ProjectTimelineProps { milestones: Milestone[]; }

export default function ProjectTimeline({ milestones }: ProjectTimelineProps) {
  return (
    <div className="space-y-0">
      {milestones.map((milestone, index) => (
        <motion.div key={milestone.title} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex gap-3 relative pb-6 last:pb-0 group">
          <div className="flex flex-col items-center">
            <div className="relative z-10 p-1 rounded-xl bg-gradient-to-br from-accent/10 to-transparent">
              {milestone.status === 'completed' ? (
                <CheckCircle2 size={18} className="text-success" />
              ) : milestone.status === 'in-progress' ? (
                <div className="w-[18px] h-[18px] rounded-xl border-2 border-accent flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-soft" />
                </div>
              ) : (
                <Circle size={18} className="text-text-muted" />
              )}
            </div>
            {index < milestones.length - 1 && <div className="w-px flex-1 bg-gradient-to-b from-accent/15 to-transparent mt-1" />}
          </div>
          <div className="flex-1 pb-2">
            <p className={`text-sm font-semibold ${milestone.status === 'completed' ? 'text-success' : milestone.status === 'in-progress' ? 'text-accent' : 'text-text-muted'}`}>
              {milestone.title}
            </p>
            {milestone.date && (
              <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1"><Clock size={11} />{formatDate(milestone.date)}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
