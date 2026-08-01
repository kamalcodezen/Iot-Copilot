'use client';

import { motion } from 'framer-motion';
import { ActivityIcon, Clock, History } from 'lucide-react';
import { Activity } from '@/types';
import { formatDate } from '@/utils/date';
import SectionHeader from '@/components/layout/SectionHeader';
import {
  FolderKanban,
  Bot,
  Bug,
  Briefcase,
  Route,
  Award,
  LogIn,
  CheckCircle2,
} from 'lucide-react';

const activityIcons: Record<string, React.ElementType> = {
  project_created: FolderKanban,
  project_completed: CheckCircle2,
  mentor_session: Bot,
  debug_session: Bug,
  interview_practice: Briefcase,
  roadmap_started: Route,
  roadmap_completed: Route,
  badge_earned: Award,
  login: LogIn,
};

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const displayActivities = activities.slice(0, 6);

  return (
    <div className="dashboard-card p-4 sm:p-5 lg:p-6 flex flex-col" role="region" aria-label="Recent activity">
        <SectionHeader icon={History} title="Recent Activity" variant="card" tone="warning" />
      <p className="text-xs font-semibold text-text-tertiary mb-4 uppercase tracking-wide">Your latest actions</p>

      <div className="flex-1 min-h-0">
        {displayActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-text-tertiary">
            <div className="h-12 w-12 rounded-2xl bg-accent-light flex items-center justify-center mb-3 shadow-elevation-low">
              <ActivityIcon size={22} className="text-accent/60" aria-hidden="true" />
            </div>
            <p className="text-sm font-bold text-text-secondary">No recent activity</p>
            <p className="text-xs mt-1 font-medium text-text-muted text-center max-w-[200px]">Start a project or use AI Mentor to see activity here</p>
          </div>
        ) : (
          <ul className="space-y-1" role="list">
            {displayActivities.map((activity, index) => {
              const Icon = activityIcons[activity.type] || Clock;
              return (
                <motion.li
                  key={activity._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-glass hover:shadow-elevation-low transition-all duration-200"
                >
                  <div className="mt-0.5 h-8 w-8 shrink-0 rounded-xl bg-accent-light flex items-center justify-center shadow-elevation-low" aria-hidden="true">
                    <Icon size={15} className="text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-primary truncate">{activity.description}</p>
                    <p className="text-[11px] font-semibold text-text-tertiary mt-0.5">{formatDate(activity.createdAt)}</p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
