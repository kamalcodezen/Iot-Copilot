'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Edit3 } from 'lucide-react';
import ProjectForm from '@/features/projects/components/ProjectForm';
import IoTLoader from '@/components/ui/IoTLoader';
import { getProjectById as getProject } from '@/lib/api/project';
import { updateProjectAction } from '@/lib/actions/project';
import toast from 'react-hot-toast';

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
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

  const handleSubmit = async (formData: any) => {
    try {
      await updateProjectAction(params.id as string, formData);
      toast.success('Project updated!');
      router.push(`/projects/${params.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update');
    }
  };

  if (loading) return <div className="min-h-screen dashboard-bg flex items-center justify-center"><IoTLoader /></div>;
  if (!project) return null;

  return (
    <div className="min-h-screen dashboard-bg max-w-2xl mx-auto px-4 pb-24 sm:pb-20 lg:pb-10 pt-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-bg-elevated border border-border-default rounded-2xl p-6 shadow-elevation-high">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 flex items-center justify-center">
            <Edit3 className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-text-primary">Edit Project</h2>
            <p className="text-sm text-text-tertiary">{project.title}</p>
          </div>
        </div>
        <ProjectForm initialData={{ title: project.title, description: project.description, category: project.category, difficulty: project.difficulty, status: project.status, isPublic: project.isPublic }} onSubmit={handleSubmit} />
      </motion.div>
    </div>
  );
}
