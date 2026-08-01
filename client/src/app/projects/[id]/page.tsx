'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Trash2, ExternalLink, Calendar, Cpu, Code, Layers, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProjectTimeline from '@/features/projects/components/ProjectTimeline';
import IoTLoader from '@/components/ui/IoTLoader';
import SectionHeader from '@/components/layout/SectionHeader';
import { getProjectById as getProject } from '@/lib/api/project';
import { deleteProjectAction } from '@/lib/actions/project';
import { Project } from '@/types';
import toast from 'react-hot-toast';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await getProject(params.id as string);
        setProject(data);
      } catch {
        toast.error('Project not found');
        router.push('/projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [params.id, router]);

  const handleDelete = async () => {
    if (!confirm('Delete this project?')) return;
    try {
      await deleteProjectAction(params.id as string);
      toast.success('Project deleted');
      router.push('/projects');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="min-h-screen dashboard-bg flex items-center justify-center"><IoTLoader size="md" /></div>;
  if (!project) return null;

  const milestones = [
    { title: 'Project Created', status: 'completed' as const, date: project.createdAt },
    { title: 'Planning Phase', status: project.status === 'planning' ? 'in-progress' as const : 'completed' as const },
    { title: 'Development', status: project.status === 'in-progress' ? 'in-progress' as const : project.status === 'completed' ? 'completed' as const : 'pending' as const },
    { title: 'Testing & Debugging', status: project.status === 'completed' ? 'completed' as const : 'pending' as const },
    { title: 'Project Complete', status: project.status === 'completed' ? 'completed' as const : 'pending' as const, date: project.updatedAt },
  ];

  return (
    <div className="min-h-screen dashboard-bg space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 pb-24 sm:pb-20 lg:pb-10 pt-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link href="/projects" className="inline-flex items-center gap-1 text-sm font-bold text-text-tertiary hover:text-text-primary transition-colors">
          <ArrowLeft size={15} /> Back to Projects
        </Link>
        <div className="flex items-center gap-2">
          <Button href={`/projects/${project._id}/edit`} variant="secondary" size="sm"><Edit size={15} className="mr-1" /> Edit</Button>
          <Button variant="danger" size="sm" onClick={handleDelete}><Trash2 size={15} className="mr-1" /> Delete</Button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant={project.status === 'completed' ? 'success' : project.status === 'in-progress' ? 'accent' : 'default'} dot>{project.status}</Badge>
                <Badge variant={project.difficulty === 'beginner' ? 'success' : project.difficulty === 'intermediate' ? 'warning' : 'error'}>{project.difficulty}</Badge>
                <Badge>{project.category}</Badge>
              </div>
              <h1 className="text-2xl font-extrabold text-text-primary">{project.title}</h1>
            </div>
            {project.isPublic && <Badge variant="success" dot><ExternalLink size={12} className="mr-1" /> Public</Badge>}
          </div>

          <p className="text-text-secondary font-semibold mb-6">{project.description}</p>

          <div className="relative h-2.5 bg-bg-surface rounded-full overflow-hidden mb-2">
            <motion.div initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} className="absolute inset-y-0 left-0 rounded-full bg-accent" style={{ boxShadow: '0 0 8px rgba(95,161,179,0.3)' }} />
          </div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-bold text-text-tertiary tabular-nums">{project.progress}% complete</span>
            {project.progress < 100 && (
              <Link href={`/projects/${project._id}/edit`} className="text-xs font-bold text-accent hover:text-accent-hover transition-colors">Update progress</Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div>
                <SectionHeader icon={Cpu} title="Components" />
              {project.components.length > 0 ? (
                <ul className="space-y-2">
                  {project.components.map((c, i) => (
                    <li key={i} className="flex items-center justify-between p-3 rounded-xl bg-bg-surface border border-border-default">
                      <span className="text-sm font-bold text-text-primary">{c.name}</span>
                      <span className="text-xs font-bold text-text-muted">x{c.quantity}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm font-medium text-text-muted p-3 rounded-xl bg-bg-surface border border-border-default">No components listed</p>}
            </div>
            <div>
                <SectionHeader icon={Layers} title="Timeline" tone="success" />
              <ProjectTimeline milestones={milestones} />
            </div>
          </div>
        </Card>
      </motion.div>

      {project.code && (
        <Card>
            <SectionHeader icon={Code} title="Code" tone="info" />
          <pre className="bg-bg-elevated border border-border-default rounded-xl p-4 overflow-x-auto"><code className="code-font text-sm text-text-primary whitespace-pre">{project.code}</code></pre>
        </Card>
      )}

      {project.learningOutcomes.length > 0 && (
        <Card>
            <SectionHeader icon={ArrowLeft} title="Learning Outcomes" tone="warning" iconClassName="rotate-90" />
          <ul className="space-y-2">
            {project.learningOutcomes.map((outcome, i) => (
              <li key={i} className="flex items-start gap-2 text-sm font-semibold text-text-secondary p-2.5 rounded-xl bg-bg-surface border border-border-default">
                <span className="text-accent mt-0.5 shrink-0">◆</span>{outcome}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
