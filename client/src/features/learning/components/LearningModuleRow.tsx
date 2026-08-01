import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Lock } from 'lucide-react';
import { LearningPath } from '@/types';
import { formatTime } from '@/utils/format';

interface LearningModuleRowProps {
  module: LearningPath['modules'][0];
  index: number;
  total: number;
  onToggle: (index: number, status: 'completed' | 'available') => void;
}

// One module in the learning path timeline: the status toggle (checkmark,
// spinner, lock, or empty circle) plus the module card with its resources.
export default function LearningModuleRow({ module, index, total, onToggle }: LearningModuleRowProps) {
  return (
    <motion.div
      key={module.order}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex gap-4 relative pb-5 last:pb-0"
    >
      <div className="flex flex-col items-center">
        <button
          onClick={() => {
            if (module.status === 'locked') return;
            const nextStatus = module.status === 'completed' ? 'available' : 'completed';
            onToggle(index, nextStatus);
          }}
          disabled={module.status === 'locked'}
          aria-label={module.status === 'locked' ? `Module ${module.order} locked` : module.status === 'completed' ? `Mark module ${module.order} as not completed` : `Mark module ${module.order} as completed`}
          aria-pressed={module.status === 'completed'}
          className={`relative z-10 transition-all ${module.status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {module.status === 'completed' ? (
            <CheckCircle2 className="w-5 h-5 text-success" />
          ) : module.status === 'in-progress' ? (
            <div className="w-5 h-5 rounded-full border-2 border-accent flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-soft" />
            </div>
          ) : module.status === 'locked' ? (
            <Lock className="w-5 h-5 text-text-muted" />
          ) : (
            <Circle className="w-5 h-5 text-text-tertiary" />
          )}
        </button>
        {index < total - 1 && <div className="w-px flex-1 bg-gradient-to-b from-accent/20 to-transparent mt-1" />}
      </div>

      <div className={`flex-1 bg-bg-card border rounded-xl p-4 shadow-elevation-low transition-all duration-200 hover:shadow-elevation-medium ${module.status === 'in-progress' ? 'border-accent/30' : 'border-border-default'} ${module.status === 'locked' ? 'opacity-50' : ''}`}>
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-bold text-text-primary text-sm">Module {module.order}: {module.title}</h4>
            <p className="text-sm font-medium text-text-tertiary mt-1">{module.description}</p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-text-muted shrink-0">
            <Clock size={11} />
            {formatTime(module.estimatedHours * 60)}
          </div>
        </div>

        {module.resources.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {module.resources.map((r, i) => (
              <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-bg-elevated border border-border-default text-text-tertiary flex items-center gap-1">
                {r.type === 'video' ? '🎥' : r.type === 'article' ? '📄' : '📚'} {r.title}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
