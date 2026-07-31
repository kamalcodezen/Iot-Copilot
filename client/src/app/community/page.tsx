'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Heart, AlertTriangle, RefreshCw, ChevronRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import IoTLoader from '@/components/ui/IoTLoader';
import { getCommunityProjects } from '@/lib/api/community';
import { PopulatedProject } from '@/types';
import { formatDate } from '@/utils/date';
import Link from 'next/link';

export default function CommunityPage() {
  const [projects, setProjects] = useState<PopulatedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await getCommunityProjects({ sort: '-likes' });
        setProjects(data);
      } catch (err) {
        setError('Failed to load community projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen dashboard-bg space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 pb-24 sm:pb-20 lg:pb-10 pt-20">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary">Community</h1>
          <p className="text-sm font-semibold text-text-tertiary">Connect with fellow IoT learners and makers</p>
        </div>
      </div>

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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {projects.map((project, index) => (
            <motion.div key={project._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Link href={`/projects/${project._id}`}>
                <Card className="h-full cursor-pointer group shadow-elevation-low hover:shadow-elevation-medium transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar name={project.userId?.name || 'User'} src={project.userId?.avatar} size="sm" />
                    <div>
                      <p className="text-sm font-bold text-text-primary">{project.userId?.name || 'Anonymous'}</p>
                      <p className="text-xs font-semibold text-text-muted">{formatDate(project.createdAt)}</p>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">{project.title}</h3>
                  <p className="text-sm font-medium text-text-secondary mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex items-center gap-4 text-sm text-text-muted mt-auto">
                    <span className="flex items-center gap-1 font-bold"><Heart size={14} className="text-error" />{project.likes}</span>
                    <span className="flex items-center gap-1 font-bold"><MessageSquare size={14} className="text-accent" />0</span>
                    <span className="ml-auto text-xs font-bold capitalize px-2.5 py-0.5 rounded-full bg-bg-surface border border-border-default text-text-tertiary">{project.difficulty}</span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
