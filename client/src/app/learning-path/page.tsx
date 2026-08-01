'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Route, Sparkles, ArrowLeft, Target, BookOpen } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PageHeader from '@/components/layout/PageHeader';
import LearningModuleRow from '@/features/learning/components/LearningModuleRow';
import { getLearningPaths } from '@/lib/api/learning';
import { updateLearningPathAction } from '@/lib/actions/learning';
import { generateRoadmapAction } from '@/lib/actions/ai';
import { LearningPath } from '@/types';
import toast from 'react-hot-toast';

export default function LearningPathPage() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [activePath, setActivePath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [skillLevel, setSkillLevel] = useState('beginner');
  const [goals, setGoals] = useState('');

  useEffect(() => { fetchPaths(); }, []);

  const fetchPaths = async () => {
    try {
      const { data } = await getLearningPaths();
      setPaths(data);
      if (data.length > 0) setActivePath(data[0]);
    } catch (err) {
      console.error('Failed to fetch learning paths:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateRoadmap = async () => {
    setGenerating(true);
    try {
      const { data } = await generateRoadmapAction(skillLevel, goals);
      setPaths((prev) => [data, ...prev]);
      setActivePath(data);
      toast.success('Learning roadmap generated!');
    } catch {
      toast.error('Failed to generate roadmap');
    } finally {
      setGenerating(false);
    }
  };

  const updateModuleStatus = async (moduleIndex: number, status: string) => {
    if (!activePath) return;
    const updatedModules = [...activePath.modules];
    updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], status: status as LearningPath['modules'][0]['status'] };
    const completed = updatedModules.filter((m) => m.status === 'completed').length;
    const progress = Math.round((completed / updatedModules.length) * 100);
    try {
      const { data } = await updateLearningPathAction(activePath._id, { modules: updatedModules, progress });
      setActivePath(data);
      setPaths((prev) => prev.map((p) => (p._id === data._id ? data : p)));
    } catch (err) {
      console.error('Failed to update progress:', err);
      toast.error('Failed to update progress');
    }
  };

  return (
    <div className="min-h-screen dashboard-bg space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 pb-24 sm:pb-20 lg:pb-10 pt-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader icon={Route} title="Learning Path" subtitle="Your personalized IoT roadmap" />
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:text-accent-hover transition-colors shrink-0">
          <ArrowLeft size={13} /> Dashboard
        </Link>
      </div>

      <div className="dashboard-card p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-6 rounded-lg bg-accent-light flex items-center justify-center">
            <Target size={13} className="text-accent" />
          </div>
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">Configure</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-1.5">
            <label htmlFor="skill-level" className="text-sm font-bold text-text-secondary">Skill Level</label>
            <select id="skill-level" value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} className="w-full rounded-xl border border-border-default bg-bg-elevated px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent/40 transition-all duration-200 shadow-elevation-low">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="goals" className="text-sm font-bold text-text-secondary">Goals (optional)</label>
            <input id="goals" value={goals} onChange={(e) => setGoals(e.target.value)} placeholder="e.g., Build a smart home system" className="w-full rounded-xl border border-border-default bg-bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent/40 transition-all duration-200 shadow-elevation-low" />
          </div>
        </div>

        <Button onClick={generateRoadmap} isLoading={generating}>
          <Sparkles size={15} className="mr-2" />
          Generate Personalized Roadmap
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-bg-card border border-border-default rounded-xl p-5 animate-skeleton skeleton-shimmer">
              <div className="h-4 bg-bg-surface rounded w-1/3 mb-2" />
              <div className="h-3 bg-bg-surface rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : activePath ? (
        <Card>
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-6 w-6 rounded-lg bg-accent-light flex items-center justify-center">
                  <BookOpen size={12} className="text-accent" />
                </div>
                <h3 className="text-base font-bold text-text-primary">{activePath.title}</h3>
              </div>
              <p className="text-sm font-semibold text-text-tertiary">{activePath.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-accent tabular-nums">{activePath.progress}%</div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wide">Complete</p>
            </div>
          </div>

          <div className="relative h-2 bg-bg-surface rounded-full overflow-hidden mb-7">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${activePath.progress}%` }}
              className="absolute inset-y-0 left-0 rounded-full bg-accent"
              style={{ boxShadow: '0 0 8px rgba(95,161,179,0.3)' }}
            />
          </div>

          <div className="space-y-0">
            {activePath.modules.map((module, index) => (
              <LearningModuleRow
                key={module.order}
                module={module}
                index={index}
                total={activePath.modules.length}
                onToggle={updateModuleStatus}
              />
            ))}
          </div>
        </Card>
      ) : (
        <div className="text-center py-16">
          <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-accent-light border border-accent/20 mx-auto mb-4">
            <Route className="w-7 h-7 text-accent/60" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">No Learning Path Yet</h3>
          <p className="text-sm font-semibold text-text-tertiary mb-6">Generate your personalized IoT roadmap to get started</p>
          <p className="text-xs font-medium text-text-muted">Set your skill level and goals above, then click Generate</p>
        </div>
      )}
    </div>
  );
}
