'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FolderKanban, Plus, Layers } from 'lucide-react';
import { Project } from '@/types';
import Badge from '@/components/ui/Badge';

interface ProjectProgressProps {
  projects: Project[];
}

export default function ProjectProgress({ projects }: ProjectProgressProps) {
  const displayProjects = projects.slice(0, 4);

  if (displayProjects.length === 0) {
    return (
      <div className="dashboard-card p-4 sm:p-5 lg:p-6 flex flex-col" role="region" aria-label="Project progress">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center shrink-0">
            <Layers size={14} className="text-emerald-400" aria-hidden="true" />
          </div>
          <h3 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-text-primary">Project Progress</h3>
        </div>
        <p className="text-xs font-semibold text-text-tertiary mb-4 uppercase tracking-wide">Your ongoing projects</p>
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <div className="h-12 w-12 rounded-2xl bg-accent-light flex items-center justify-center mb-3 shadow-elevation-low">
            <FolderKanban size={24} className="text-accent/60" aria-hidden="true" />
          </div>
          <p className="text-text-secondary text-sm font-bold mb-1">No projects yet</p>
          <p className="text-xs font-medium text-text-muted mb-5">Create your first IoT project</p>
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-white bg-accent hover:bg-accent-hover transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 px-4 py-2.5 rounded-xl shadow-lg shadow-accent/15"
          >
            <Plus size={14} />
            Create project
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card p-4 sm:p-5 lg:p-6 flex flex-col" role="region" aria-label="Project progress">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center shrink-0">
            <Layers size={14} className="text-emerald-400" aria-hidden="true" />
          </div>
          <h3 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-text-primary">Project Progress</h3>
        </div>
        <Link href="/projects" className="text-[11px] font-bold text-accent hover:text-accent-hover transition-colors uppercase tracking-wide">View all</Link>
      </div>
      <p className="text-xs font-semibold text-text-tertiary mb-4 uppercase tracking-wide">Your ongoing projects</p>

      <div className="flex-1 space-y-2.5">
        {displayProjects.map((project, index) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href={`/projects/${project._id}`} className="block p-3.5 rounded-2xl hover:bg-glass border border-transparent hover:border-border-default transition-all duration-300 group">
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <h4 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors truncate">{project.title}</h4>
                <Badge
                  variant={project.status === 'completed' ? 'success' : project.status === 'in-progress' ? 'info' : project.status === 'paused' ? 'warning' : 'default'}
                  size="sm"
                  className="shrink-0"
                  dot
                >
                  {project.status}
                </Badge>
              </div>
              <div className="relative h-2.5 bg-bg-surface rounded-full overflow-hidden" role="progressbar" aria-valuenow={project.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${project.title} progress: ${project.progress}%`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                  className="absolute inset-y-0 left-0 rounded-full bg-accent"
                  style={{ boxShadow: '0 0 8px rgba(95,161,179,0.3)' }}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[11px] font-bold text-text-tertiary tabular-nums">{project.progress}%</span>
                <span className="text-[11px] font-semibold text-text-muted capitalize truncate ml-2">{project.category?.replace('-', ' ') || 'General'}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
