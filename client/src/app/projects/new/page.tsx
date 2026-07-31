'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FolderKanban, ArrowLeft } from 'lucide-react';
import ProjectForm from '@/features/projects/components/ProjectForm';
import { createProjectAction } from '@/lib/actions/project';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function NewProjectPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const { data: project } = await createProjectAction(data);
      toast.success('Project created!');
      router.push(`/projects/${project._id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create project');
    }
  };

  return (
    <div className="min-h-screen dashboard-bg max-w-2xl mx-auto px-4 pb-24 sm:pb-20 lg:pb-10 pt-20">
      <Link href="/projects" className="inline-flex items-center gap-1 text-sm font-bold text-text-tertiary hover:text-text-primary transition-colors mb-6">
        <ArrowLeft size={15} /> Back to Projects
      </Link>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-bg-elevated border border-border-default rounded-2xl p-6 sm:p-8 shadow-elevation-high">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 flex items-center justify-center">
            <FolderKanban className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-text-primary">New Project</h2>
            <p className="text-sm font-semibold text-text-tertiary">Create a new IoT project</p>
          </div>
        </div>
        <ProjectForm onSubmit={handleSubmit} />
      </motion.div>
    </div>
  );
}
