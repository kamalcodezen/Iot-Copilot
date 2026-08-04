'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bot, AlertTriangle, RefreshCw, Home } from 'lucide-react';
import StatsBar from '@/features/dashboard/components/StatsBar';
import ProgressChart from '@/features/dashboard/components/ProgressChart';
import SkillRadar from '@/features/dashboard/components/SkillRadar';
import RecentActivity from '@/features/dashboard/components/RecentActivity';
import AISuggestions, { AISuggestion } from '@/features/dashboard/components/AISuggestions';
import ProjectProgress from '@/features/dashboard/components/ProjectProgress';
import QuickActions from '@/features/dashboard/components/QuickActions';
import { authClient } from '@/lib/auth-client';
import { getActivities, getDashboardStats as getActivityStats } from '@/lib/api/dashboard';
import { getProjects } from '@/lib/api/project';
import { clientFetch } from '@/lib/api/client-api';
import { getErrorMessage } from '@/utils/errors';
import Button from '@/components/ui/Button';
import { StatsData, Activity, Project, ApiResponse } from '@/types';

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-56 animate-skeleton rounded-lg bg-bg-surface" />
          <div className="h-4 w-40 animate-skeleton rounded-lg bg-bg-surface" />
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-surface">
          <div className="h-4 w-4 animate-skeleton rounded bg-bg-card" />
          <div className="h-4 w-28 animate-skeleton rounded bg-bg-card" />
          <div className="h-2 w-2 animate-skeleton rounded-full bg-bg-card" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-bg-card border border-border-default rounded-xl p-5 flex items-center gap-4 animate-skeleton">
            <div className="h-11 w-11 rounded-lg bg-bg-surface" />
            <div className="space-y-2 flex-1">
              <div className="h-7 w-16 rounded bg-bg-surface" />
              <div className="h-3 w-20 rounded bg-bg-surface" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-bg-card border border-border-default rounded-xl p-6 animate-skeleton">
            <div className="h-5 w-44 rounded bg-bg-surface mb-4" />
            <div className="h-64 rounded-lg bg-bg-surface/50" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-bg-card border border-border-default rounded-xl p-6 animate-skeleton">
            <div className="h-5 w-36 rounded bg-bg-surface mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-12 rounded-lg bg-bg-surface/50" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [aiError, setAiError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [statsRes, activitiesRes, projectsRes] = await Promise.all([
        getActivityStats(),
        getActivities({ limit: '10' }),
        getProjects({ limit: '4' }),
      ]);
      setStats(statsRes.data);
      setActivities(activitiesRes.data);
      setProjects(projectsRes.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchAI = async () => {
    setSuggestionsLoading(true);
    setAiError('');
    try {
      const res = await clientFetch<ApiResponse<unknown>>('/ai/recommend');
      const data = res.data;
      let parsed = typeof data === 'string' ? JSON.parse(data) : data;
      if (Array.isArray(parsed)) setAiSuggestions(parsed);
    } catch (error) {
      setAiError(getErrorMessage(error, 'Could not load AI suggestions.'));
    } finally {
      setSuggestionsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { fetchAI(); }, []);

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in-up">
        <div className="h-14 w-14 rounded-2xl bg-error-light flex items-center justify-center mb-4">
          <AlertTriangle size={28} className="text-error" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">Failed to load dashboard</h2>
        <p className="text-sm text-text-secondary mb-6 max-w-[280px]">Could not fetch your dashboard data. Please try again.</p>
        <div className="flex items-center gap-3">
          <Button onClick={fetchData}>
            <RefreshCw size={15} className="mr-2" />
            Retry
          </Button>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors px-4 py-2.5 rounded-lg hover:bg-glass">
            <Home size={15} />
            Home
          </Link>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 sm:space-y-8 lg:space-y-10"
    >
      <motion.div
        variants={sectionVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-text-primary">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'Engineer'}
          </h1>
          <p className="text-sm text-text-secondary mt-1.5">Here&apos;s your IoT learning overview</p>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-bg-elevated border border-border-default shadow-elevation-low">
          <Bot size={14} className="text-accent shrink-0" />
          <span className="text-xs sm:text-sm text-text-secondary whitespace-nowrap font-medium">AI Mentor ready</span>
          <span className="h-2 w-2 rounded-full bg-success animate-pulse-soft shrink-0" />
        </div>
      </motion.div>

      <motion.div variants={sectionVariants} className="section-spacing">
        <QuickActions />
      </motion.div>

      <motion.div variants={sectionVariants} className="section-spacing">
        <StatsBar stats={{
          learningStreak: stats?.stats.learningStreak || 0,
          totalProjects: stats?.totals.totalProjects || 0,
          totalSessions: stats?.stats.totalSessions || 0,
          totalHours: stats?.stats.totalHours || 0,
        }} />
      </motion.div>

      <motion.div variants={sectionVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 section-spacing">
        <ProgressChart data={stats?.dailyActivity || []} />
        <SkillRadar />
      </motion.div>

      <motion.div variants={sectionVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
        <RecentActivity activities={activities} />
        <AISuggestions suggestions={aiSuggestions} loading={suggestionsLoading} error={aiError} onRetry={fetchAI} />
        <ProjectProgress projects={projects} />
      </motion.div>
    </motion.div>
  );
}
