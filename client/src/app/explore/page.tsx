'use client';

import { useEffect, useState } from 'react';
import { Compass, Plus, AlertTriangle, RefreshCw, Search } from 'lucide-react';
import ProjectCard from '@/features/projects/components/ProjectCard';
import ProjectFilters from '@/features/projects/components/ProjectFilters';
import IoTLoader from '@/components/ui/IoTLoader';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { getCommunityProjects } from '@/lib/api/community';
import { PopulatedProject } from '@/types';

export default function ExplorePage() {
  const [projects, setProjects] = useState<PopulatedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', status: '', category: '', difficulty: '' });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const params: Record<string, string> = {};
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.difficulty) params.difficulty = filters.difficulty;
        const { data } = await getCommunityProjects(params);
        setProjects(data);
      } catch (err) {
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [filters]);

  return (
    <div className="min-h-screen dashboard-bg space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 pb-24 sm:pb-20 lg:pb-10 pt-20">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 flex items-center justify-center">
          <Compass className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary">Explore Projects</h1>
          <p className="text-sm font-semibold text-text-tertiary">Discover IoT projects from the community</p>
        </div>
      </div>

      <ProjectFilters onFilter={setFilters} />

      {loading ? (
        <div className="flex items-center justify-center py-20"><IoTLoader size="md" /></div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
          <div className="h-14 w-14 rounded-2xl bg-error-light flex items-center justify-center mb-4">
            <AlertTriangle size={28} className="text-error" />
          </div>
          <h2 className="text-lg font-bold text-text-primary mb-2">Something went wrong</h2>
          <p className="text-sm font-semibold text-text-tertiary mb-6 max-w-[280px]">{error}</p>
          <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-accent rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent/15">
            <RefreshCw size={14} />Retry
          </button>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-accent-light border border-accent/20 mx-auto mb-4">
            <Search className="w-7 h-7 text-accent/60" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">No projects found</h3>
          <p className="text-sm font-semibold text-text-tertiary mb-6">Be the first to share your IoT project!</p>
          <Link href="/projects/new"><Button><Plus size={16} className="mr-2" />Create Project</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {projects.map((project) => (<ProjectCard key={project._id} project={project} />))}
        </div>
      )}
    </div>
  );
}
