'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, FolderKanban } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProjectCard from '@/features/projects/components/ProjectCard';
import ProjectFilters from '@/features/projects/components/ProjectFilters';
import { getProjects } from '@/lib/api/project';
import { deleteProjectAction } from '@/lib/actions/project';
import { Project } from '@/types';
import toast from 'react-hot-toast';
import IoTLoader from '@/components/ui/IoTLoader';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', category: '', difficulty: '' });

  const fetchProjects = useCallback(async () => {
    try {
      const params: Record<string, string> = {};
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.difficulty) params.difficulty = filters.difficulty;
      const { data } = await getProjects(params);
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProjectAction(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success('Project deleted');
    } catch {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="min-h-screen dashboard-bg space-y-6 px-4 sm:px-6 lg:px-8 pb-24 sm:pb-20 lg:pb-10 pt-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Projects</h1>
          <p className="text-sm text-text-tertiary mt-1">Manage your IoT projects</p>
        </div>
        <Link href="/projects/new">
          <Button><Plus size={16} className="mr-2" />New Project</Button>
        </Link>
      </div>

      <ProjectFilters onFilter={setFilters} />

      {loading ? (
        <div className="flex items-center justify-center py-20"><IoTLoader size="md" /></div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16">
          <FolderKanban className="w-14 h-14 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No projects yet</h3>
          <p className="text-sm text-text-tertiary mb-6">Create your first IoT project to get started</p>
          <Link href="/projects/new"><Button><Plus size={16} className="mr-2" />Create Project</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} onDelete={handleDelete} isOwner />
          ))}
        </div>
      )}
    </div>
  );
}
