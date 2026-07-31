'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Project, PopulatedProject } from '@/types';
import { formatDate } from '@/utils/date';
import Badge from '@/components/ui/Badge';

interface ProjectCardProps {
  project: Project | PopulatedProject;
  onDelete?: (id: string) => void;
  isOwner?: boolean;
}

export default function ProjectCard({ project, onDelete, isOwner }: ProjectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="dashboard-card p-4 sm:p-5 group relative hover-lift shadow-elevation-low"
    >
      {isOwner && (
        <div className="absolute top-3 right-3 z-10">
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center h-8 w-8 rounded-xl hover:bg-bg-surface text-text-muted hover:text-text-primary transition-colors touch-target"
            aria-label={menuOpen ? 'Close menu' : 'Open project menu'} aria-expanded={menuOpen}
          >
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-1 bg-bg-elevated border border-border-default rounded-xl p-1.5 w-36 z-20 animate-scale-in shadow-elevation-medium" role="menu">
              <Link href={`/projects/${project._id}/edit`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface rounded-xl transition-colors"
                role="menuitem" onClick={() => setMenuOpen(false)}
              ><Edit size={14} /> Edit</Link>
              <button onClick={() => { onDelete?.(project._id); setMenuOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-error hover:text-error/80 hover:bg-error/10 rounded-xl transition-colors w-full"
                role="menuitem"
              ><Trash2 size={14} /> Delete</button>
            </div>
          )}
        </div>
      )}

      <Link href={`/projects/${project._id}`} className="block">
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          <Badge variant={project.status === 'completed' ? 'success' : project.status === 'in-progress' ? 'info' : project.status === 'paused' ? 'warning' : 'default'} size="sm">{project.status}</Badge>
          <Badge variant={project.difficulty === 'beginner' ? 'success' : project.difficulty === 'intermediate' ? 'warning' : 'error'} size="sm">{project.difficulty}</Badge>
          <Badge variant="default" size="sm">{project.category}</Badge>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">{project.title}</h3>
        <p className="text-sm text-text-secondary mb-4 line-clamp-2">{project.description}</p>

        {'tags' in project && project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-bg-surface text-text-muted">#{tag}</span>
            ))}
          </div>
        )}

        <div className="relative h-1.5 bg-bg-surface rounded-xl overflow-hidden mb-2" role="progressbar"
          aria-valuenow={project.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${project.title} progress: ${project.progress}%`}
        >
          <div className="absolute inset-y-0 left-0 rounded-xl bg-accent transition-all duration-700 ease-out" style={{ width: `${project.progress}%`, boxShadow: '0 0 4px rgba(59,130,246,0.3)' }} />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted tabular-nums">{project.progress}% complete</span>
          <span className="text-xs text-text-muted">{formatDate(project.updatedAt)}</span>
        </div>
      </Link>

      {menuOpen && <div className="fixed inset-0 z-0" onClick={() => setMenuOpen(false)} aria-hidden="true" />}
    </motion.div>
  );
}
